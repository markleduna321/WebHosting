<?php

namespace App\Services;

use App\Exceptions\PaymentException;
use App\Jobs\SendInvoiceEmailJob;
use App\Models\Addon;
use App\Models\Payment;
use App\Models\Plan;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class CheckoutService
{
    public function __construct(
        private readonly PayMongoService $paymongo,
        private readonly PaymentMethodRegistry $methods,
        private readonly InvoiceService $invoices,
    ) {}

    /**
     * Starts a payment for a plan and optional add-ons: QR Ph inline, everything else via hosted checkout.
     *
     * @throws ValidationException|PaymentException
     */
    public function start(User $user, Plan $plan, string $cycle, array $addonIds = [], string $method = PaymentMethodRegistry::QRPH): Payment
    {
        // Re-checked here so a flag flipped between validation and charge cannot slip through.
        if (! $this->methods->isEnabled($method)) {
            throw ValidationException::withMessages([
                'payment_method' => 'This payment method is temporarily unavailable. Please use QR Ph.',
            ]);
        }

        [$amount, $lineItems] = $this->priceFor($plan, $cycle, $addonIds);

        $payment = $user->payments()->create([
            'plan_id' => $plan->id,
            'billing_cycle' => $cycle,
            'amount' => $amount,
            'currency' => $plan->currency ?? 'PHP',
            'payment_method' => $method,
            'status' => Payment::STATUS_PENDING,
            'addons' => $addonIds,
            'line_items' => $lineItems,
        ]);

        $metadata = [
            'payment_uuid' => $payment->uuid,
            'user_id' => (string) $user->id,
            'plan_slug' => $plan->slug,
            'addons' => implode(',', $addonIds),
        ];

        return $method === PaymentMethodRegistry::QRPH
            ? $this->startQr($payment, $plan, $cycle, $amount, $metadata)
            : $this->startHostedCheckout($payment, $plan, $cycle, $amount, $method, $metadata);
    }

    /**
     * @param  array<string, string>  $metadata
     *
     * @throws PaymentException
     */
    private function startHostedCheckout(Payment $payment, Plan $plan, string $cycle, string $amount, string $method, array $metadata): Payment
    {
        try {
            $session = $this->paymongo->createCheckoutSession(
                $this->toCentavos($amount),
                "{$plan->name} plan ({$cycle})",
                $method,
                route('checkout.return', ['payment' => $payment->uuid, 'status' => 'success']),
                route('checkout.return', ['payment' => $payment->uuid, 'status' => 'cancel']),
                $payment->uuid,
                $metadata,
                'CALEHO HOST'
            );
        } catch (PaymentException $e) {
            $this->markFailed($payment, $e->getMessage());

            throw $e;
        }

        $attributes = $session['data']['attributes'] ?? [];
        $checkoutUrl = $attributes['checkout_url'] ?? null;

        if (! is_string($checkoutUrl) || ! str_starts_with($checkoutUrl, 'https://')) {
            $this->markFailed($payment, 'PayMongo did not return a checkout page.');

            throw new PaymentException('We could not open the payment page. Please try again.');
        }

        $payment->update([
            'paymongo_checkout_session_id' => $session['data']['id'] ?? null,
            // Lets the payment.paid event for the underlying intent resolve to this row too.
            'paymongo_payment_intent_id' => $attributes['payment_intent']['id'] ?? null,
            'checkout_url' => $checkoutUrl,
            'status' => Payment::STATUS_AWAITING_PAYMENT,
        ]);

        return $payment->fresh();
    }

    /**
     * @param  array<string, string>  $metadata
     *
     * @throws PaymentException
     */
    private function startQr(Payment $payment, Plan $plan, string $cycle, string $amount, array $metadata): Payment
    {
        try {
            $intent = $this->paymongo->createPaymentIntent(
                $this->toCentavos($amount),
                "{$plan->name} plan ({$cycle})",
                $metadata,
                'CALEHO HOST'
            );

            $intentId = $intent['data']['id'];
            $clientKey = $intent['data']['attributes']['client_key'];

            $method = $this->paymongo->createQrPaymentMethod();
            $attached = $this->paymongo->attach($intentId, $method['data']['id'], $clientKey);
        } catch (PaymentException $e) {
            $payment->update([
                'status' => Payment::STATUS_FAILED,
                'failure_reason' => $e->getMessage(),
            ]);

            throw $e;
        }

        $attributes = $attached['data']['attributes'] ?? [];
        $code = $attributes['next_action']['code'] ?? [];
        $qr = $code['image_url'] ?? null;

        if ($qr === null) {
            $payment->update([
                'status' => Payment::STATUS_FAILED,
                'failure_reason' => 'PayMongo did not return a QR code.',
            ]);

            throw new PaymentException('We could not generate a QR code. Please try again.');
        }

        $payment->update([
            'paymongo_payment_intent_id' => $intentId,
            'qr_image_url' => $qr,
            // Present in test mode only; PayMongo omits it for live keys.
            'paymongo_test_url' => $code['test_url'] ?? null,
            'status' => Payment::STATUS_AWAITING_PAYMENT,
            'expires_at' => $this->expiryFor($code),
        ]);

        return $payment->fresh();
    }

    /**
     * PayMongo states when the code dies; only fall back to our own clock if it does not.
     *
     * @param  array<string, mixed>  $code
     */
    private function expiryFor(array $code): Carbon
    {
        $expiresAt = $code['expires_at'] ?? null;

        if (is_string($expiresAt)) {
            try {
                return Carbon::parse($expiresAt);
            } catch (\Throwable) {
                // Fall through to the configured window.
            }
        }

        return now()->addSeconds((int) config('services.paymongo.qr_expiry_seconds'));
    }

    /**
     * Activates the subscription for a paid payment.
     *
     * Idempotent: PayMongo retries deliveries, so this must be safe to run
     * repeatedly for the same payment.
     *
     * @param  array<string, mixed>  $paymongoAttributes  The PayMongo payment's attributes, for fee records.
     */
    public function markPaid(Payment $payment, ?string $paymongoPaymentId = null, array $paymongoAttributes = []): void
    {
        if ($payment->status === Payment::STATUS_PAID) {
            // Self-heals if an earlier delivery activated the plan but failed to queue the email.
            if ($payment->invoice_emailed_at === null) {
                $this->queueInvoiceEmail($payment);
            }

            return;
        }

        DB::transaction(function () use ($payment, $paymongoPaymentId, $paymongoAttributes) {
            $starts = now();
            $months = Payment::cycleToMonths($payment->billing_cycle);
            $ends = $starts->copy()->addMonths($months);

            // A new paid plan supersedes the pending_payment it originated from,
            // as well as any older active subscriptions the user might be upgrading from.
            $payment->user->subscriptions()
                ->whereIn('status', [
                    Subscription::STATUS_ACTIVE,
                    Subscription::STATUS_TRIALING,
                    Subscription::STATUS_PENDING_PAYMENT,
                ])
                ->update([
                    'status' => Subscription::STATUS_CANCELED,
                    'canceled_at' => $starts,
                ]);

            $subscription = $payment->user->subscriptions()->create([
                'plan_id' => $payment->plan_id,
                'status' => Subscription::STATUS_ACTIVE,
                'billing_cycle' => $payment->billing_cycle,
                'starts_at' => $starts,
                'ends_at' => $ends,
                'addons' => $payment->addons,
            ]);

            $payment->update([
                'status' => Payment::STATUS_PAID,
                'paid_at' => $starts,
                'subscription_id' => $subscription->id,
                'paymongo_payment_id' => $paymongoPaymentId,
                'failure_reason' => null,
                ...$this->feeRecord($paymongoAttributes),
            ]);

            $this->invoices->assignNumber($payment);
        });

        $this->queueInvoiceEmail($payment);
    }

    /**
     * Never lets email trouble surface as a webhook failure; activation has already committed.
     */
    private function queueInvoiceEmail(Payment $payment): void
    {
        try {
            SendInvoiceEmailJob::dispatch($payment->id);
        } catch (\Throwable $e) {
            Log::error('Could not queue the invoice email.', [
                'payment_id' => $payment->id,
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * @param  array<string, mixed>  $attributes
     * @return array<string, mixed>
     */
    private function feeRecord(array $attributes): array
    {
        $int = fn (string $key) => isset($attributes[$key]) && is_numeric($attributes[$key])
            ? (int) $attributes[$key]
            : null;

        $taxes = is_array($attributes['taxes'] ?? null)
            ? array_values(array_map(fn ($tax) => [
                'name' => (string) ($tax['name'] ?? ''),
                'type' => (string) ($tax['type'] ?? ''),
                'value' => (string) ($tax['value'] ?? ''),
                'amount' => (int) ($tax['amount'] ?? 0),
                'inclusive' => (bool) ($tax['inclusive'] ?? false),
            ], array_filter($attributes['taxes'], 'is_array')))
            : null;

        return [
            'paymongo_fee' => $int('fee'),
            'paymongo_foreign_fee' => $int('foreign_fee'),
            'paymongo_tax_amount' => $int('tax_amount'),
            'paymongo_net_amount' => $int('net_amount'),
            'paymongo_taxes' => $taxes,
        ];
    }

    public function markFailed(Payment $payment, ?string $reason = null): void
    {
        if ($payment->status === Payment::STATUS_PAID) {
            return;
        }

        $payment->update([
            'status' => Payment::STATUS_FAILED,
            'failure_reason' => $reason,
        ]);
    }

    /**
     * The price is calculated cleanly in centavos, reading directly from the DB.
     * Returns the decimal total and the invoice line items (centavos) that sum to it.
     *
     * @return array{0: string, 1: array<int, array{description: string, detail: string|null, quantity: int, unit_amount: int, amount: int}>}
     *
     * @throws ValidationException
     */
    private function priceFor(Plan $plan, string $cycle, array $addonIds = []): array
    {
        $months = Payment::cycleToMonths($cycle);
        $basePrice = $plan->priceForPeriod($months);

        if ($basePrice === null) {
            if ($plan->monthly_price !== null) {
                throw ValidationException::withMessages([
                    'billing_cycle' => 'That billing period is not available for this plan.',
                ]);
            }

            throw ValidationException::withMessages([
                'plan_slug' => 'That plan is quote-only. Please contact sales.',
            ]);
        }

        if ((float) $basePrice <= 0) {
            throw ValidationException::withMessages([
                'plan_slug' => 'That plan cannot be purchased online.',
            ]);
        }

        $planCentavos = (int) round(((float) $basePrice) * 100);
        $totalCentavos = $planCentavos;

        $lineItems = [[
            'description' => "{$plan->name} plan",
            'detail' => InvoiceService::cycleLabel($cycle),
            'quantity' => 1,
            'unit_amount' => $planCentavos,
            'amount' => $planCentavos,
        ]];

        if (! empty($addonIds)) {
            $addons = Addon::whereIn('slug', $addonIds)
                ->where('is_active', true)
                ->get();

            if ($addons->count() !== count($addonIds)) {
                throw ValidationException::withMessages([
                    'addons' => 'One or more selected add-ons are invalid or no longer available.',
                ]);
            }

            foreach ($addons as $addon) {
                // Addon price is already stored in centavos!
                $quantity = $months > 1 && $addon->billing_period === 'month' ? $months : 1;
                $addonTotal = $addon->price * $quantity;
                $totalCentavos += $addonTotal;

                $lineItems[] = [
                    'description' => $addon->name,
                    'detail' => $quantity > 1 ? "{$quantity} months" : ($addon->billing_period ? "Per {$addon->billing_period}" : null),
                    'quantity' => $quantity,
                    'unit_amount' => (int) $addon->price,
                    'amount' => (int) $addonTotal,
                ];
            }
        }

        // Convert final centavos back to a decimal string for the Payment model
        return [sprintf('%.2f', $totalCentavos / 100), $lineItems];
    }

    private function toCentavos(string $amount): int
    {
        return (int) round(((float) $amount) * 100);
    }
}

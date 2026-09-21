<?php

namespace App\Services;

use App\Exceptions\PaymentException;
use App\Models\Payment;
use App\Models\Plan;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class CheckoutService
{
    public function __construct(private readonly PayMongoService $paymongo) {}

    /**
     * Starts a QR Ph payment for a plan and optional add-ons.
     *
     * @throws ValidationException|PaymentException
     */
    public function start(User $user, Plan $plan, string $cycle, array $addonIds = []): Payment
    {
        $amount = $this->priceFor($plan, $cycle, $addonIds);

        $payment = $user->payments()->create([
            'plan_id' => $plan->id,
            'billing_cycle' => $cycle,
            'amount' => $amount,
            'currency' => $plan->currency ?? 'PHP',
            'status' => Payment::STATUS_PENDING,
            'addons' => $addonIds,
        ]);

        try {
            $intent = $this->paymongo->createPaymentIntent(
                $this->toCentavos($amount),
                "{$plan->name} plan ({$cycle})",
                [
                    'payment_uuid' => $payment->uuid,
                    'user_id' => (string) $user->id,
                    'plan_slug' => $plan->slug,
                    'addons' => implode(',', $addonIds),
                ]
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
    private function expiryFor(array $code): \Illuminate\Support\Carbon
    {
        $expiresAt = $code['expires_at'] ?? null;

        if (is_string($expiresAt)) {
            try {
                return \Illuminate\Support\Carbon::parse($expiresAt);
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
     */
    public function markPaid(Payment $payment, ?string $paymongoPaymentId = null): void
    {
        if ($payment->status === Payment::STATUS_PAID) {
            return;
        }

        DB::transaction(function () use ($payment, $paymongoPaymentId) {
            $starts = now();
            $ends = $payment->billing_cycle === Payment::CYCLE_ANNUAL
                ? $starts->copy()->addYear()
                : $starts->copy()->addMonth();

            // A new paid plan supersedes whatever the user was on, including pending_payment.
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
            ]);
        });
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
     * The price is read from the plan row and config. Nothing the client sends influences it.
     *
     * @throws ValidationException
     */
    private function priceFor(Plan $plan, string $cycle, array $addonIds = []): string
    {
        $price = $cycle === Payment::CYCLE_ANNUAL ? $plan->annual_price : $plan->monthly_price;

        if ($price === null) {
            throw ValidationException::withMessages([
                'plan_slug' => 'That plan is quote-only. Please contact sales.',
            ]);
        }

        if ((float) $price <= 0) {
            throw ValidationException::withMessages([
                'plan_slug' => 'That plan cannot be purchased online.',
            ]);
        }
        
        $total = (float) $price;
        $addonPrices = config('addons.prices', []);

        foreach ($addonIds as $addonId) {
            if (isset($addonPrices[$addonId])) {
                $addonPrice = $addonPrices[$addonId]['price'];
                $addonPeriod = $addonPrices[$addonId]['period'];
                
                if ($cycle === Payment::CYCLE_ANNUAL && $addonPeriod === 'month') {
                    $total += (float) $addonPrice * 12;
                } else {
                    $total += (float) $addonPrice;
                }
            }
        }

        return (string) $total;
    }

    private function toCentavos(string $amount): int
    {
        return (int) round(((float) $amount) * 100);
    }
}

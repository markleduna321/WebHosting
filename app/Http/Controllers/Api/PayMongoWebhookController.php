<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\WebhookEvent;
use App\Services\CheckoutService;
use App\Services\PayMongoService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Throwable;

/**
 * Receives PayMongo events. The signature is the only authentication, so this
 * route is intentionally unauthenticated and CSRF-exempt.
 */
class PayMongoWebhookController extends Controller
{
    private const HANDLED = ['payment.paid', 'payment.failed'];

    public function __construct(
        private readonly PayMongoService $paymongo,
        private readonly CheckoutService $checkout,
    ) {}

    public function handle(Request $request): JsonResponse
    {
        // Must run against the raw body: re-encoding parsed JSON breaks the HMAC.
        $raw = $request->getContent();

        if (! $this->paymongo->verifySignature($raw, $request->header('Paymongo-Signature'))) {
            Log::warning('Rejected a PayMongo webhook with an invalid signature.');

            return response()->json(['message' => 'Invalid signature.'], 401);
        }

        $payload = json_decode($raw, true);
        $eventId = $payload['data']['id'] ?? null;
        $type = $payload['data']['attributes']['type'] ?? null;

        if ($eventId === null || $type === null) {
            return $this->acknowledge();
        }

        // Anything below this point returns 200: a non-2xx would make PayMongo retry forever.
        if ($this->wrongMode($payload)) {
            return $this->acknowledge('livemode_mismatch');
        }

        if (! in_array($type, self::HANDLED, true)) {
            return $this->acknowledge('ignored');
        }

        // Unique key on event_id is what makes retried deliveries safe.
        $event = WebhookEvent::firstOrCreate(
            ['event_id' => $eventId],
            ['type' => $type]
        );

        if (! $event->wasRecentlyCreated) {
            return $this->acknowledge('duplicate');
        }

        try {
            $this->process($type, $payload);
            $event->update(['processed_at' => now()]);
        } catch (Throwable $e) {
            // Freeing the key lets PayMongo's retry genuinely reprocess this event.
            $event->delete();

            Log::error('PayMongo webhook processing failed.', [
                'event_id' => $eventId,
                'type' => $type,
                'exception' => $e->getMessage(),
            ]);

            return response()->json(['message' => 'Processing failed.'], 500);
        }

        return $this->acknowledge();
    }

    /**
     * @param  array<string, mixed>  $payload
     */
    private function process(string $type, array $payload): void
    {
        $data = $payload['data']['attributes']['data'] ?? [];
        $attributes = $data['attributes'] ?? [];

        $payment = $this->resolvePayment($attributes);

        if ($payment === null) {
            Log::warning('PayMongo webhook had no matching local payment.', ['type' => $type]);

            return;
        }

        if ($type === 'payment.paid') {
            $this->checkout->markPaid($payment, $data['id'] ?? null);

            return;
        }

        $this->checkout->markFailed(
            $payment,
            $attributes['last_payment_error'] ?? 'The payment did not go through.'
        );
    }

    /**
     * @param  array<string, mixed>  $attributes
     */
    private function resolvePayment(array $attributes): ?Payment
    {
        $uuid = $attributes['metadata']['payment_uuid'] ?? null;

        if ($uuid !== null) {
            $payment = Payment::where('uuid', $uuid)->first();

            if ($payment !== null) {
                return $payment;
            }
        }

        $intentId = $attributes['payment_intent_id'] ?? null;

        return $intentId !== null
            ? Payment::where('paymongo_payment_intent_id', $intentId)->first()
            : null;
    }

    /**
     * @param  array<string, mixed>  $payload
     */
    private function wrongMode(array $payload): bool
    {
        $livemode = $payload['data']['attributes']['livemode'] ?? null;

        return $livemode !== null && $livemode !== (bool) config('services.paymongo.livemode');
    }

    private function acknowledge(string $result = 'ok'): JsonResponse
    {
        return response()->json(['received' => true, 'result' => $result]);
    }
}

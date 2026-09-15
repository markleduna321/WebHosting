<?php

namespace App\Services;

use App\Exceptions\PaymentException;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Thin client over the PayMongo v1 API.
 *
 * Every call runs server-side with the secret key. PayMongo's QR Ph guide shows
 * steps 2 and 3 happening in the browser with the public key; doing them here
 * instead means no key and no client_key ever reach the page.
 */
class PayMongoService
{
    public function createPaymentIntent(int $amountCentavos, string $description, array $metadata = []): array
    {
        return $this->post('/payment_intents', [
            'data' => [
                'attributes' => [
                    'amount' => $amountCentavos,
                    'currency' => 'PHP',
                    'payment_method_allowed' => ['qrph'],
                    'description' => $description,
                    'metadata' => $metadata,
                ],
            ],
        ]);
    }

    public function createQrPaymentMethod(): array
    {
        return $this->post('/payment_methods', [
            'data' => [
                'attributes' => [
                    'type' => 'qrph',
                    'expiry_seconds' => (int) config('services.paymongo.qr_expiry_seconds'),
                ],
            ],
        ]);
    }

    public function attach(string $intentId, string $paymentMethodId, string $clientKey): array
    {
        return $this->post("/payment_intents/{$intentId}/attach", [
            'data' => [
                'attributes' => [
                    'payment_method' => $paymentMethodId,
                    'client_key' => $clientKey,
                ],
            ],
        ]);
    }

    public function retrievePaymentIntent(string $intentId): array
    {
        $response = $this->request()->get($this->url("/payment_intents/{$intentId}"));

        return $this->handle($response, "GET /payment_intents/{$intentId}");
    }

    /**
     * Verifies the Paymongo-Signature header against the raw request body.
     *
     * The body must not have been parsed first: re-encoding changes the bytes
     * and the HMAC will never match.
     */
    public function verifySignature(string $rawPayload, ?string $header): bool
    {
        $secret = (string) config('services.paymongo.webhook_secret');

        if ($secret === '' || $header === null || $header === '') {
            return false;
        }

        $parts = [];

        foreach (explode(',', $header) as $segment) {
            $pair = explode('=', trim($segment), 2);

            if (count($pair) === 2) {
                $parts[$pair[0]] = $pair[1];
            }
        }

        $timestamp = $parts['t'] ?? null;
        $signature = config('services.paymongo.livemode') ? ($parts['li'] ?? null) : ($parts['te'] ?? null);

        if ($timestamp === null || $signature === null) {
            return false;
        }

        // Rejects a captured payload being replayed later.
        $tolerance = (int) config('services.paymongo.signature_tolerance');

        if (abs(time() - (int) $timestamp) > $tolerance) {
            return false;
        }

        $expected = hash_hmac('sha256', $timestamp.'.'.$rawPayload, $secret);

        return hash_equals($expected, $signature);
    }

    /**
     * @param  array<string, mixed>  $payload
     * @return array<string, mixed>
     */
    private function post(string $path, array $payload): array
    {
        $response = $this->request()->post($this->url($path), $payload);

        return $this->handle($response, "POST {$path}");
    }

    private function request(): \Illuminate\Http\Client\PendingRequest
    {
        $secret = (string) config('services.paymongo.secret_key');

        if ($secret === '') {
            throw new PaymentException('Payments are not configured yet.');
        }

        // PayMongo uses HTTP Basic with the secret key as the username and no password.
        return Http::withBasicAuth($secret, '')
            ->acceptJson()
            ->asJson()
            ->timeout(30);
    }

    private function url(string $path): string
    {
        return rtrim((string) config('services.paymongo.base_url'), '/').$path;
    }

    /**
     * @return array<string, mixed>
     */
    private function handle(Response $response, string $context): array
    {
        if ($response->successful()) {
            return $response->json();
        }

        // The body can echo request details, so it is logged, never returned.
        Log::error('PayMongo request failed.', [
            'context' => $context,
            'status' => $response->status(),
            'body' => $response->json() ?? $response->body(),
        ]);

        throw new PaymentException();
    }
}

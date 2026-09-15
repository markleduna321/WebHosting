<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PaymentResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'uuid' => $this->uuid,
            'status' => $this->status,
            'amount' => (float) $this->amount,
            'currency' => $this->currency,
            'billing_cycle' => $this->billing_cycle,
            'qr_image_url' => $this->qr_image_url,
            // Withheld in live mode so a stale test row can never expose a bypass.
            'test_url' => $this->when(
                ! config('services.paymongo.livemode'),
                fn () => $this->paymongo_test_url
            ),
            'expires_at' => $this->expires_at?->toIso8601String(),
            'paid_at' => $this->paid_at?->toIso8601String(),
            'failure_reason' => $this->failure_reason,
            'plan' => $this->whenLoaded('plan', fn () => [
                'slug' => $this->plan->slug,
                'name' => $this->plan->name,
            ]),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}

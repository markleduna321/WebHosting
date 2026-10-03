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
        $isInvoiced = $this->status === \App\Models\Payment::STATUS_PAID && $this->invoice_number !== null;
        // PayMongo's fee columns are merchant-only records and deliberately never serialised here.
        $invoice = $isInvoiced ? app(\App\Services\InvoiceService::class)->build($this->resource) : null;

        return [
            'uuid' => $this->uuid,
            'invoice_number' => $this->invoice_number,
            'invoice' => $this->when($isInvoiced, fn () => [
                'items' => $invoice['items'],
                'subtotal' => $invoice['subtotal'],
                'tax' => $invoice['tax'],
                'total' => $invoice['total'],
                'payment_method' => $invoice['payment_method'],
                'issued_at' => $invoice['issued_at']?->toIso8601String(),
                'download_url' => route('invoices.download', $this->uuid),
            ]),
            'status' => $this->status,
            'amount' => (float) $this->amount,
            'currency' => $this->currency,
            'billing_cycle' => $this->billing_cycle,
            'payment_method' => $this->payment_method,
            'checkout_url' => $this->when(
                $this->status === \App\Models\Payment::STATUS_AWAITING_PAYMENT,
                fn () => $this->checkout_url
            ),
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
                'features' => $this->plan->features,
            ]),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}

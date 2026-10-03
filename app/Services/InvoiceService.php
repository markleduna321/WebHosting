<?php

namespace App\Services;

use App\Models\Payment;
use Barryvdh\DomPDF\Facade\Pdf;
use Barryvdh\DomPDF\PDF as DomPdf;

class InvoiceService
{
    public function __construct(private readonly PaymentMethodRegistry $methods) {}

    /**
     * Must run inside the transaction that marks the payment paid, so numbers stay gap-free.
     */
    public function assignNumber(Payment $payment): void
    {
        if ($payment->invoice_number !== null) {
            return;
        }

        $prefix = config('invoice.number_prefix').'-'.now()->format('Y').'-';

        // Row lock on the latest number serialises concurrent webhooks; the unique index is the backstop.
        $last = Payment::where('invoice_number', 'like', $prefix.'%')
            ->orderByDesc('invoice_number')
            ->lockForUpdate()
            ->value('invoice_number');

        $next = $last === null ? 1 : ((int) substr($last, strlen($prefix))) + 1;

        $payment->forceFill([
            'invoice_number' => $prefix.str_pad((string) $next, 6, '0', STR_PAD_LEFT),
            'invoice_issued_at' => now(),
        ])->save();
    }

    /**
     * @return array<string, mixed>
     */
    public function build(Payment $payment): array
    {
        $payment->loadMissing(['plan', 'user']);

        $totalCentavos = (int) round(((float) $payment->amount) * 100);
        $items = $this->lineItems($payment, $totalCentavos);

        return [
            'number' => $payment->invoice_number,
            'issued_at' => $payment->invoice_issued_at ?? $payment->paid_at,
            'paid_at' => $payment->paid_at,
            'currency' => $payment->currency ?? 'PHP',
            'payment_method' => $this->methods->label($payment->payment_method ?? PaymentMethodRegistry::QRPH),
            'seller' => [
                'name' => config('invoice.seller.name'),
                'address' => config('invoice.seller.address'),
                'phone' => config('invoice.seller.phone'),
                'email' => config('invoice.seller.email'),
                'tin' => config('invoice.seller.tin'),
            ],
            'buyer' => [
                'name' => $payment->user?->name,
                'email' => $payment->user?->email,
            ],
            'items' => array_map(fn (array $item) => [
                'description' => $item['description'],
                'detail' => $item['detail'] ?? null,
                'quantity' => (int) $item['quantity'],
                'unit_amount' => $item['unit_amount'] / 100,
                'amount' => $item['amount'] / 100,
            ], $items),
            'subtotal' => $totalCentavos / 100,
            'tax' => $this->tax($totalCentavos),
            'total' => $totalCentavos / 100,
        ];
    }

    public function pdf(Payment $payment): DomPdf
    {
        return Pdf::setOption([
            'isRemoteEnabled' => false,
            'isPhpEnabled' => false,
            // Embeds only the glyphs used; otherwise the full DejaVu font bloats every PDF.
            'isFontSubsettingEnabled' => true,
            'defaultFont' => 'DejaVu Sans',
        ])->loadView('invoices.pdf', [
            'invoice' => $this->build($payment),
            'logo' => $this->logoDataUri(),
        ])->setPaper('a4');
    }

    /**
     * Uses a small prebuilt asset: the 5000px source logos exhaust PHP memory when decoded.
     */
    private function logoDataUri(): ?string
    {
        $path = config('invoice.seller.logo_path');

        if (! is_string($path) || ! is_file($path) || filesize($path) > 512 * 1024) {
            return null;
        }

        return 'data:image/png;base64,'.base64_encode((string) file_get_contents($path));
    }

    public function filename(Payment $payment): string
    {
        return 'Invoice-'.preg_replace('/[^A-Za-z0-9\-]/', '', (string) $payment->invoice_number).'.pdf';
    }

    /**
     * VAT is inclusive: the customer total never changes, only how it is broken down.
     *
     * @return array<string, mixed>
     */
    private function tax(int $totalCentavos): array
    {
        if (! config('invoice.vat_registered')) {
            return [
                'mode' => 'non_vat',
                'note' => 'Non-VAT Registered Seller. This document is not valid for claim of input tax.',
            ];
        }

        $rate = (float) config('invoice.vat_rate');
        $vatable = (int) round($totalCentavos / (1 + $rate));

        return [
            'mode' => 'vat',
            'rate' => $rate,
            'vatable_sales' => $vatable / 100,
            // Derived by subtraction so vatable + vat always equals the total exactly.
            'vat_amount' => ($totalCentavos - $vatable) / 100,
        ];
    }

    /**
     * @return array<int, array{description: string, detail: string|null, quantity: int, unit_amount: int, amount: int}>
     */
    private function lineItems(Payment $payment, int $totalCentavos): array
    {
        $items = $payment->line_items;

        if (is_array($items) && $items !== [] && array_sum(array_column($items, 'amount')) === $totalCentavos) {
            return $items;
        }

        // Payments made before line items were snapshotted fall back to one summary line.
        $planName = $payment->plan?->name ?? 'Hosting';

        return [[
            'description' => "{$planName} plan",
            'detail' => self::cycleLabel($payment->billing_cycle),
            'quantity' => 1,
            'unit_amount' => $totalCentavos,
            'amount' => $totalCentavos,
        ]];
    }

    public static function cycleLabel(?string $cycle): string
    {
        $months = Payment::cycleToMonths((string) $cycle);

        return $months === 1 ? 'Monthly' : "{$months} months";
    }
}

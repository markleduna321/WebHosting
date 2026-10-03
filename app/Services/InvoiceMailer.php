<?php

namespace App\Services;

use App\Models\Payment;
use RuntimeException;

class InvoiceMailer
{
    public function __construct(private readonly InvoiceService $invoices) {}

    public function send(Payment $payment): void
    {
        $this->transport($this->payload($payment));
    }

    /**
     * @return array<string, mixed>
     */
    public function payload(Payment $payment): array
    {
        $payment->loadMissing(['plan', 'user']);
        $invoice = $this->invoices->build($payment);

        $html = view('emails.invoice-paid', [
            'invoice' => $invoice,
            'planName' => $payment->plan?->name ?? 'Hosting',
            'dashboardUrl' => url('/dashboard'),
            'billingUrl' => route('account-billing', ['tab' => 'subscription']),
        ])->render();

        return [
            'from' => $this->from(),
            'to' => [$payment->user->email],
            'subject' => "Payment received — Invoice {$invoice['number']}",
            'html' => $html,
            'attachments' => [[
                'filename' => $this->invoices->filename($payment),
                'content' => base64_encode($this->invoices->pdf($payment)->output()),
            ]],
        ];
    }

    /**
     * @param  array<string, mixed>  $payload
     */
    protected function transport(array $payload): void
    {
        $apiKey = config('services.resend.key');

        if (empty($apiKey)) {
            throw new RuntimeException('RESEND_API_KEY is not configured.');
        }

        \Resend::client($apiKey)->emails->send($payload);
    }

    private function from(): string
    {
        $address = config('services.resend.from') ?: config('mail.from.address');
        $name = config('mail.from.name') ?: config('invoice.seller.name');

        return $name ? "{$name} <{$address}>" : (string) $address;
    }
}

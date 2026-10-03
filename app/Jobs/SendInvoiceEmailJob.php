<?php

namespace App\Jobs;

use App\Models\Payment;
use App\Services\InvoiceMailer;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Throwable;

class SendInvoiceEmailJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    /** @var array<int, int> */
    public array $backoff = [60, 300, 900];

    public function __construct(public readonly int $paymentId) {}

    public function handle(InvoiceMailer $mailer): void
    {
        $payment = Payment::find($this->paymentId);

        if (! $payment || $payment->status !== Payment::STATUS_PAID || ! $payment->invoice_number) {
            return;
        }

        // Atomic claim: duplicate jobs (webhook retries, two PayMongo events) can't both send.
        $claimed = Payment::whereKey($payment->id)
            ->whereNull('invoice_emailed_at')
            ->update(['invoice_emailed_at' => now()]);

        if ($claimed === 0) {
            return;
        }

        try {
            $mailer->send($payment);
        } catch (Throwable $e) {
            // Release the claim so the next retry can send.
            Payment::whereKey($payment->id)->update(['invoice_emailed_at' => null]);

            Log::error('Invoice email failed.', [
                'payment_id' => $payment->id,
                'invoice_number' => $payment->invoice_number,
                'attempt' => $this->attempts(),
                'error' => $e->getMessage(),
            ]);

            throw $e;
        }
    }
}

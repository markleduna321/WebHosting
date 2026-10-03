<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Services\InvoiceService;
use Symfony\Component\HttpFoundation\Response;

class InvoiceDownloadController extends Controller
{
    public function __construct(private readonly InvoiceService $invoices) {}

    public function show(Payment $payment): Response
    {
        $this->authorize('view', $payment);

        // An invoice exists only once a payment is settled and numbered.
        abort_unless($payment->status === Payment::STATUS_PAID && $payment->invoice_number, 404);

        return $this->invoices->pdf($payment)->download($this->invoices->filename($payment));
    }
}

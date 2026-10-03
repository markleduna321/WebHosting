<?php

namespace App\Http\Controllers;

use App\Http\Resources\PaymentResource;
use App\Models\Payment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Landing page after PayMongo's hosted checkout. Display only: the webhook is
 * what marks a payment paid, so visiting the success URL grants nothing.
 */
class CheckoutReturnController extends Controller
{
    public function show(Request $request, Payment $payment): Response
    {
        $this->authorize('view', $payment);

        return Inertia::render('checkout/return/page', [
            'payment' => (new PaymentResource($payment->load('plan')))->resolve(),
            'outcome' => $request->query('status') === 'cancel' ? 'cancel' : 'success',
        ]);
    }
}

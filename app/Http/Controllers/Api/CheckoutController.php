<?php

namespace App\Http\Controllers\Api;

use App\Exceptions\PaymentException;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCheckoutRequest;
use App\Http\Resources\PaymentResource;
use App\Models\Payment;
use App\Models\Plan;
use App\Services\CheckoutService;
use Illuminate\Http\JsonResponse;

class CheckoutController extends Controller
{
    public function __construct(private readonly CheckoutService $checkout) {}

    public function store(StoreCheckoutRequest $request): JsonResponse
    {
        $plan = Plan::where('slug', $request->validated('plan_slug'))->firstOrFail();

        try {
            $payment = $this->checkout->start(
                $request->user(),
                $plan,
                $request->validated('billing_cycle')
            );
        } catch (PaymentException $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'code' => 'payment_failed',
            ], 502);
        }

        return (new PaymentResource($payment->load('plan')))->response()->setStatusCode(201);
    }

    public function show(Payment $payment): JsonResponse
    {
        $this->authorize('view', $payment);

        // The webhook is authoritative; this only reflects what it already wrote.
        if ($payment->isExpired()) {
            $payment->update(['status' => Payment::STATUS_EXPIRED]);
        }

        return (new PaymentResource($payment->load('plan')))->response();
    }
}

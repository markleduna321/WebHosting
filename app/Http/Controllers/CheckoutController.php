<?php

namespace App\Http\Controllers;

use App\Http\Resources\PlanResource;
use App\Models\Payment;
use App\Models\Plan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    public function show(Request $request, Plan $plan): Response|\Illuminate\Http\RedirectResponse
    {
        if (! $plan->is_active || $plan->monthly_price === null) {
            return redirect()->route('hosting');
        }

        $cycle = $request->query('cycle') === Payment::CYCLE_ANNUAL
            ? Payment::CYCLE_ANNUAL
            : Payment::CYCLE_MONTHLY;

        return Inertia::render('checkout/page', [
            'plan' => (new PlanResource($plan))->resolve(),
            'cycle' => $cycle,
        ]);
    }
}

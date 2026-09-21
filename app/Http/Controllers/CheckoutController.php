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

        // Pull addons from pending subscription if it exists for this plan
        $pendingSub = $request->user()?->subscriptions()
            ->where('status', \App\Models\Subscription::STATUS_PENDING_PAYMENT)
            ->where('plan_id', $plan->id)
            ->first();

        if ($pendingSub && is_array($pendingSub->addons)) {
            $addons = $pendingSub->addons;
            // Also override cycle if it was set during registration
            $cycle = $pendingSub->billing_cycle;
        } else {
            $addons = $request->query('addons', []);
            if (!is_array($addons)) {
                $addons = [];
            }
        }

        $availableAddons = \App\Models\Addon::where('is_active', true)->get();

        return Inertia::render('checkout/page', [
            'plan' => (new PlanResource($plan))->resolve(),
            'cycle' => $cycle,
            'initialAddons' => $addons,
            'availableAddons' => \App\Http\Resources\AddonResource::collection($availableAddons)->resolve(),
        ]);
    }
}

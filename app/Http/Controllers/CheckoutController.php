<?php

namespace App\Http\Controllers;

use App\Http\Resources\AddonResource;
use App\Http\Resources\PlanResource;
use App\Models\Addon;
use App\Models\Payment;
use App\Models\Plan;
use App\Models\Subscription;
use App\Services\PaymentMethodRegistry;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    public function show(Request $request, Plan $plan): Response|RedirectResponse
    {
        if (! $plan->is_active || $plan->monthly_price === null) {
            return redirect()->route('hosting');
        }

        $requestedCycle = $request->query('cycle', Payment::CYCLE_MONTHLY);
        $requestedCycle = is_string($requestedCycle)
            ? $requestedCycle
            : Payment::CYCLE_MONTHLY;
        $cycle = match ($requestedCycle) {
            Payment::CYCLE_ANNUAL => '12',
            Payment::CYCLE_MONTHLY => '1',
            default => Payment::isValidCycle($requestedCycle)
                ? $requestedCycle
                : '1',
        };

        // Pull addons from pending subscription if it exists for this plan
        $pendingSub = $request->user()?->subscriptions()
            ->where('status', Subscription::STATUS_PENDING_PAYMENT)
            ->where('plan_id', $plan->id)
            ->first();

        if ($pendingSub && is_array($pendingSub->addons)) {
            $addons = $pendingSub->addons;
            // Also override cycle if it was set during registration
            $cycle = match ($pendingSub->billing_cycle) {
                Payment::CYCLE_ANNUAL => '12',
                Payment::CYCLE_MONTHLY => '1',
                default => Payment::isValidCycle($pendingSub->billing_cycle)
                    ? $pendingSub->billing_cycle
                    : '1',
            };
        } else {
            $addons = $request->query('addons', []);
            if (! is_array($addons)) {
                $addons = [];
            }
        }

        if (! $plan->supportsBillingPeriod(Payment::cycleToMonths($cycle))) {
            $cycle = '1';
        }

        $availableAddons = Addon::where('is_active', true)->get();

        return Inertia::render('checkout/page', [
            'plan' => (new PlanResource($plan))->resolve(),
            'cycle' => $cycle,
            'initialAddons' => $addons,
            'availableAddons' => AddonResource::collection($availableAddons)->resolve(),
            'paymentMethods' => app(PaymentMethodRegistry::class)->all(),
        ]);
    }
}

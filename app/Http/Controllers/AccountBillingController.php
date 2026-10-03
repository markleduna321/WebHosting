<?php

namespace App\Http\Controllers;

use App\Http\Resources\PaymentResource;
use App\Models\Payment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AccountBillingController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $user->loadMissing('activeSubscription.plan');

        $subscription = $user->activeSubscription;

        // Get payment history (invoices) – paid + failed payments
        $payments = Payment::where('user_id', $user->id)
            ->whereIn('status', [Payment::STATUS_PAID, Payment::STATUS_FAILED])
            ->with('plan')
            ->orderByDesc('created_at')
            ->get()
            // Every row belongs to this user; reuse the model instead of querying it per invoice.
            ->each->setRelation('user', $user);

        return Inertia::render('account-billing/page', [
            'tab' => $request->query('tab'),
            'subscription' => $subscription ? [
                'uuid' => $subscription->uuid,
                'status' => $subscription->status,
                'billing_cycle' => $subscription->billing_cycle,
                'starts_at' => $subscription->starts_at?->toIso8601String(),
                'ends_at' => $subscription->ends_at?->toIso8601String(),
                'plan' => $subscription->plan ? [
                    'slug' => $subscription->plan->slug,
                    'name' => $subscription->plan->name,
                    'monthly_price' => (float) $subscription->plan->monthly_price,
                    'currency' => $subscription->plan->currency ?? 'PHP',
                    'prices' => $subscription->plan->prices,
                ] : null,
            ] : null,
            'invoices' => PaymentResource::collection($payments)->resolve(),
            'profile' => [
                'name' => $user->name,
                'email' => $user->email,
                'email_verified_at' => $user->email_verified_at?->toIso8601String(),
            ],
            'twoFactor' => [
                'enabled' => (bool) $user->two_factor_enabled,
                'verified_at' => $user->two_factor_verified_at?->toIso8601String(),
            ],
        ]);
    }
}

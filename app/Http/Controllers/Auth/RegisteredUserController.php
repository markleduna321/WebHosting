<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(Request $request): Response
    {
        $plans = \App\Models\Plan::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        $addons = \App\Models\Addon::where('is_active', true)->get();

        return Inertia::render('Auth/register/page', [
            'plan' => $request->query('plan'),
            'plans' => \App\Http\Resources\PlanResource::collection($plans)->resolve(),
            'availableAddons' => \App\Http\Resources\AddonResource::collection($addons)->resolve(),
        ]);
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws ValidationException
     */
    public function store(RegisterRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        $user->assignRole('student');

        if (!empty($validated['plan_slug'])) {
            $plan = \App\Models\Plan::where('slug', $validated['plan_slug'])->first();
            if ($plan) {
                $user->subscriptions()->create([
                    'plan_id' => $plan->id,
                    'status' => \App\Models\Subscription::STATUS_PENDING_PAYMENT,
                    'billing_cycle' => $validated['billing_cycle'] ?? 'monthly',
                    'addons' => $validated['addons'] ?? [],
                ]);
            }
        }

        event(new Registered($user));

        Auth::login($user);

        if (!empty($validated['plan_slug']) && isset($plan)) {
            return redirect(route('checkout', [
                'plan' => $plan->slug,
                'cycle' => $validated['billing_cycle'] ?? 'monthly',
                'addons' => $validated['addons'] ?? [],
            ]));
        }

        return redirect(route('dashboard', absolute: false));
    }
}

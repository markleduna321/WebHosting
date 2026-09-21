<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        $user?->loadMissing('activeSubscription.plan', 'pendingSubscription.plan', 'githubConnection');
        $plan = $user?->activeSubscription?->plan;
        $pending = $user?->pendingSubscription;
        $github = $user?->githubConnection;

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'email_verified_at' => $user->email_verified_at,
                    'has_verified_email' => $user->hasVerifiedEmail(),
                    'roles' => $user->getRoleNames(),
                    'permissions' => $user->getAllPermissions()->pluck('name'),
                    'plan' => $plan ? [
                        'slug' => $plan->slug,
                        'name' => $plan->name,
                    ] : null,
                    'pending_subscription' => $pending ? [
                        'status' => $pending->status,
                        'billing_cycle' => $pending->billing_cycle,
                        'plan' => $pending->plan ? [
                            'slug' => $pending->plan->slug,
                            'name' => $pending->plan->name,
                        ] : null,
                    ] : null,
                    // Tokens are deliberately excluded.
                    'github' => $github ? [
                        'username' => $github->github_username,
                        'avatar_url' => $github->avatar_url,
                    ] : null,
                ] : null,
            ],
            'flash' => [
                'github_error' => fn () => $request->session()->get('github_error'),
            ],
        ];
    }
}

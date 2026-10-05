<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminUserResource extends JsonResource
{
    /**
     * Admin directory view of a user. Credentials, 2FA codes and tokens are never included.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $subscription = $this->activeSubscription ?? $this->pendingSubscription;

        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'roles' => $this->roles->pluck('name')->values(),
            'email_verified' => $this->email_verified_at !== null,
            'email_verified_at' => $this->email_verified_at?->toIso8601String(),
            'two_factor_enabled' => (bool) $this->two_factor_enabled,
            'plan' => $subscription?->plan ? [
                'name' => $subscription->plan->name,
                'slug' => $subscription->plan->slug,
                'status' => $subscription->status,
            ] : null,
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}

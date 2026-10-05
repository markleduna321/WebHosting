<?php

namespace App\Services;

use App\Models\Plan;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class PlanService
{
    public function create(array $data): Plan
    {
        $data['slug'] = $data['slug'] ?? Str::slug($data['name']);

        return Plan::create($data);
    }

    public function update(Plan $plan, array $data): Plan
    {
        if (isset($data['name']) && !isset($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        $plan->update($data);

        return $plan->fresh();
    }

    public function delete(Plan $plan): void
    {
        if ($plan->subscriptions()->exists()) {
            throw ValidationException::withMessages([
                'plan' => 'This plan has active subscriptions and cannot be deleted. Deactivate it instead.',
            ]);
        }

        $plan->delete();
    }
}

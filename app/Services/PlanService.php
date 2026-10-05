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

        return Plan::create($this->normalizePricing($data));
    }

    public function update(Plan $plan, array $data): Plan
    {
        // The slug is the public checkout key, so a rename alone must not change it.
        $plan->update($this->normalizePricing($data));

        return $plan->fresh();
    }

    /**
     * Saves month maps as JSON objects ({"12": 2200}); an empty PHP array would encode as a list ([]).
     */
    private function normalizePricing(array $data): array
    {
        foreach (['prices', 'period_discounts'] as $field) {
            if (! array_key_exists($field, $data)) {
                continue;
            }

            $map = [];
            foreach ($data[$field] ?? [] as $months => $amount) {
                $map[(int) $months] = $amount + 0;
            }
            ksort($map);

            $data[$field] = $map === [] ? new \stdClass : $map;
        }

        return $data;
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

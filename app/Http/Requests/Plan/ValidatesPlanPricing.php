<?php

namespace App\Http\Requests\Plan;

use Illuminate\Validation\Validator;

/**
 * Plan pricing JSON must be keyed by month count; a list such as [249, 2200]
 * would otherwise be read as months 0 and 1 by checkout.
 */
trait ValidatesPlanPricing
{
    /**
     * @return array<string, mixed>
     */
    protected function pricingRules(): array
    {
        return [
            'prices' => ['nullable', 'array'],
            'prices.*' => ['required', 'numeric', 'min:0'],
            'period_discounts' => ['nullable', 'array'],
            'period_discounts.*' => ['required', 'numeric', 'min:0', 'max:100'],
            'features' => ['nullable', 'array', 'list'],
            'features.*' => ['required', 'string', 'max:255'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            $this->validateMonthKeys($validator, 'prices', 1);
            $this->validateMonthKeys($validator, 'period_discounts', 2);
        });
    }

    private function validateMonthKeys(Validator $validator, string $field, int $minMonths): void
    {
        $value = $this->input($field);

        if (! is_array($value)) {
            return;
        }

        foreach (array_keys($value) as $key) {
            $months = filter_var($key, FILTER_VALIDATE_INT);

            if ($months === false || $months < $minMonths || $months > 120) {
                $validator->errors()->add(
                    $field,
                    "Use month counts from {$minMonths} to 120 as keys, e.g. {\"12\": 2200}. Invalid key: \"{$key}\"."
                );

                return;
            }
        }
    }
}

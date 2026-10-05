<?php

namespace App\Http\Requests\Plan;

use Illuminate\Foundation\Http\FormRequest;

class StorePlanRequest extends FormRequest
{
    use ValidatesPlanPricing;

    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:125', 'unique:plans,name'],
            'slug' => ['sometimes', 'string', 'max:125', 'alpha_dash', 'unique:plans,slug'],
            'subtitle' => ['nullable', 'string', 'max:255'],
            'monthly_price' => ['nullable', 'numeric', 'min:0'],
            'currency' => ['sometimes', 'string', 'size:3'],
            ...$this->pricingRules(),
            'is_popular' => ['sometimes', 'boolean'],
            'is_active' => ['sometimes', 'boolean'],
            'sort_order' => ['sometimes', 'integer', 'min:0'],
            'max_websites' => ['sometimes', 'integer', 'min:0'],
            'max_databases' => ['sometimes', 'integer', 'min:0'],
            'disk_space_mb' => ['sometimes', 'integer', 'min:0'],
            'db_size_mb' => ['sometimes', 'integer', 'min:0'],
        ];
    }
}

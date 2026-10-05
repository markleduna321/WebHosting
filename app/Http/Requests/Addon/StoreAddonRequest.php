<?php

namespace App\Http\Requests\Addon;

use Illuminate\Foundation\Http\FormRequest;

class StoreAddonRequest extends FormRequest
{
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
            'name' => ['required', 'string', 'max:125', 'unique:addons,name'],
            'slug' => ['sometimes', 'string', 'max:125', 'unique:addons,slug'],
            'price' => ['required', 'integer', 'min:0'],
            'billing_period' => ['sometimes', 'string', 'in:month,year,one-time'],
            'description' => ['nullable', 'array'],
            'description.*' => ['string', 'max:255'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}

<?php

namespace App\Http\Requests\Addon;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateAddonRequest extends FormRequest
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
        $addon = $this->route('addon');

        return [
            'name' => [
                'required',
                'string',
                'max:125',
                Rule::unique('addons', 'name')->ignore($addon),
            ],
            'slug' => [
                'sometimes',
                'string',
                'max:125',
                Rule::unique('addons', 'slug')->ignore($addon),
            ],
            'price' => ['required', 'integer', 'min:0'],
            'billing_period' => ['sometimes', 'string', 'in:month,year,one-time'],
            'description' => ['nullable', 'array'],
            'description.*' => ['string', 'max:255'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}

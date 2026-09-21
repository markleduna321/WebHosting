<?php

namespace App\Http\Requests;

use App\Models\Payment;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCheckoutRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', Payment::class);
    }

    /**
     * Only identifies the plan and cycle. The amount is never accepted from
     * the client; it is read from the plan row in CheckoutService.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'plan_slug' => ['required', 'string', Rule::exists('plans', 'slug')->where('is_active', true)],
            'billing_cycle' => ['required', Rule::in([Payment::CYCLE_MONTHLY, Payment::CYCLE_ANNUAL])],
            'addons' => ['nullable', 'array'],
            'addons.*' => ['string'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'plan_slug.exists' => 'That plan is not available.',
        ];
    }
}

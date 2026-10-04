<?php

namespace App\Http\Requests\Auth;

use App\Models\Payment;
use App\Models\Plan;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class RegisterRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:'.User::class],
            'password' => [
                'required',
                'confirmed',
                Password::min(8)->mixedCase()->letters()->numbers()->symbols(),
            ],
            'school' => ['nullable', 'string', 'max:255'],
            'agree_terms' => ['accepted'],
            'plan_slug' => ['nullable', 'string', 'exists:plans,slug'],
            'billing_cycle' => [
                'nullable',
                'string',
                function (string $attribute, mixed $value, \Closure $fail): void {
                    if (! is_string($value) || ! Payment::isValidCycle($value)) {
                        $fail('Select a valid billing period.');

                        return;
                    }

                    $planSlug = $this->input('plan_slug');
                    if (! is_string($planSlug) || $planSlug === '') {
                        return;
                    }

                    $plan = Plan::query()->where('slug', $planSlug)->first();
                    if (! $plan?->supportsBillingPeriod(Payment::cycleToMonths($value))) {
                        $fail('The selected billing period is not available for this plan.');
                    }
                },
            ],
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
            'password.min' => 'Password must be at least 8 characters and include uppercase, lowercase, a number, and a special character.',
            'password.mixed' => 'Password must be at least 8 characters and include uppercase, lowercase, a number, and a special character.',
            'password.letters' => 'Password must be at least 8 characters and include uppercase, lowercase, a number, and a special character.',
            'password.numbers' => 'Password must be at least 8 characters and include uppercase, lowercase, a number, and a special character.',
            'password.symbols' => 'Password must be at least 8 characters and include uppercase, lowercase, a number, and a special character.',
            'agree_terms.accepted' => 'You must agree to the Terms of Service and Privacy Policy.',
        ];
    }
}

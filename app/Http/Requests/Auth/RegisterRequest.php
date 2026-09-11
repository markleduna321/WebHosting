<?php

namespace App\Http\Requests\Auth;

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

<?php

namespace App\Http\Requests;

use App\Models\StudentDatabase;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;

class StoreStudentDatabaseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', StudentDatabase::class);
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('name')) {
            // Nudge "My Portfolio" into "my_portfolio" rather than rejecting it outright.
            $this->merge([
                'name' => Str::of((string) $this->input('name'))
                    ->trim()
                    ->lower()
                    ->replaceMatches('/[^a-z0-9]+/', '_')
                    ->trim('_')
                    ->value(),
            ]);
        }
    }

    /**
     * The name is only the suffix: the server still prepends an owner-scoped
     * prefix, so reserved schemas are unreachable by construction.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'min:3',
                'max:32',
                'regex:/^[a-z][a-z0-9_]*$/',
            ],
            'password' => [
                'required',
                'string',
                'max:64',
                'confirmed',
                'regex:'.StudentDatabase::PASSWORD_PATTERN,
                Password::min(8)->mixedCase()->numbers()->symbols(),
            ],
            'password_confirmation' => ['required', 'string'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.regex' => 'Start with a letter, then use lowercase letters, numbers and underscores.',
            'password.regex' => 'Avoid quotes, backticks and backslashes. Allowed symbols: ! # $ % & ( ) * + , - . : ; < = > ? @ [ ] ^ _ { | } ~',
        ];
    }
}

<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class DeleteAccountRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        $user = $this->user();

        return [
            'name' => ['required', 'string', Rule::in([$user->name])],
            'confirmation' => ['required', 'string', Rule::in(['delete my account'])],
        ];
    }

    public function messages(): array
    {
        return [
            'name.in' => 'The typed name does not match your account name.',
            'confirmation.in' => 'You must type "delete my account" exactly to confirm.',
        ];
    }
}

<?php

namespace App\Http\Requests\Support;

use Illuminate\Foundation\Http\FormRequest;

class HandoffSupportRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'email' => [
                $this->user() ? 'nullable' : 'required',
                'email',
                'max:255',
            ],
        ];
    }
}

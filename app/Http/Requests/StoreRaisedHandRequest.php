<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreRaisedHandRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'student_id' => ['required', 'string', 'max:255'],
            'student_name' => ['nullable', 'string', 'max:255'],
        ];
    }
}
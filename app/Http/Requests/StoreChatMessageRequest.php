<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreChatMessageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'sender_id' => ['required', 'string', 'max:255'],
            'sender_name' => ['required', 'string', 'max:255'],
            'is_teacher' => ['required', 'boolean'],
            'body' => ['required', 'string', 'max:2000'],
        ];
    }
}
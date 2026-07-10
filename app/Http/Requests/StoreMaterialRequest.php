<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMaterialRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'id' => ['required', 'string', 'max:36', 'unique:materials,id'],
            'file' => ['required', 'file'],
            'original_name' => ['required', 'string', 'max:255'],
            'mime_type' => ['required', 'string', 'max:100'],
            'size_bytes' => ['required', 'integer', 'min:1'],
        ];
    }
}
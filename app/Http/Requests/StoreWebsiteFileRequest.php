<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreWebsiteFileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('website'));
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $maxKilobytes = (int) ceil(config('hosting.files.max_upload_bytes') / 1024);

        return [
            'name' => [
                'required',
                'string',
                'max:255',
                'regex:/^[^\/\\\\]+$/',
                function ($attribute, $value, $fail) {
                    if ($value === '.' || $value === '..') {
                        $fail('That is not a valid file name.');
                    }
                },
            ],
            'path' => ['nullable', 'string', 'max:1024'],
            'content' => ['nullable', 'string', 'max:'.config('hosting.files.max_upload_bytes')],
            'upload' => ['nullable', 'file', 'max:'.$maxKilobytes],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.regex' => 'File names cannot contain slashes.',
        ];
    }
}

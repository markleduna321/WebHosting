<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreWebsiteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', \App\Models\Website::class);
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('subdomain')) {
            $this->merge(['subdomain' => strtolower(trim((string) $this->input('subdomain')))]);
        }
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'subdomain' => [
                'required',
                'string',
                'max:63',
                // DNS label: lowercase alphanumeric groups separated by single hyphens.
                'regex:/^[a-z0-9]+(-[a-z0-9]+)*$/',
                Rule::unique('websites', 'subdomain'),
            ],
            'repository_full_name' => [
                'required',
                'string',
                'max:255',
                'regex:/^[A-Za-z0-9._-]+\/[A-Za-z0-9._-]+$/',
            ],
            'repository_default_branch' => ['required', 'string', 'max:255'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'subdomain.regex' => 'Use lowercase letters, numbers and single hyphens only.',
            'subdomain.unique' => 'That subdomain is already taken.',
            'repository_full_name.regex' => 'Repository must be in the form owner/repository.',
        ];
    }
}

<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreQuizSubmissionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'student_id' => ['required', 'string', 'max:255'],
            'student_name' => ['required', 'string', 'max:255'],
            'quiz_id' => ['required', 'string', 'max:36'],
            'quiz_title' => ['required', 'string', 'max:255'],
            'answers' => ['required', 'array', 'min:1'],
            'answers.*.question_id' => ['required', 'string', 'max:255'],
            'answers.*.answer' => ['nullable'],
            'score' => ['nullable', 'integer', 'min:0'],
            'total' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
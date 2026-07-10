<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class QuizSubmissionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'session_id' => $this->session_id,
            'student_id' => $this->student_id,
            'student_name' => $this->student_name,
            'quiz_id' => $this->quiz_id,
            'quiz_title' => $this->quiz_title,
            'score' => $this->score,
            'total' => $this->total,
            'answers' => $this->answers_json,
            'submitted_at' => $this->submitted_at,
        ];
    }
}
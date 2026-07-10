<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SessionParticipantResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'session_id' => $this->session_id,
            'user_id' => $this->user_id,
            'student_id' => $this->student_id,
            'student_name' => $this->student_name,
            'joined_at' => $this->joined_at,
            'left_at' => $this->left_at,
        ];
    }
}
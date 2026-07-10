<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class HandQueueResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'session_id' => $this->session_id,
            'student_id' => $this->student_id,
            'student_name' => $this->student_name,
            'raised_at' => $this->raised_at,
            'answered_at' => $this->answered_at,
        ];
    }
}
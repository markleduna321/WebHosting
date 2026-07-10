<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ChatMessageResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'session_id' => $this->session_id,
            'sender_id' => $this->sender_id,
            'sender_name' => $this->sender_name,
            'is_teacher' => $this->is_teacher,
            'body' => $this->body,
            'sent_at' => $this->sent_at,
        ];
    }
}
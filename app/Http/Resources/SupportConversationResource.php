<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SupportConversationResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->uuid,
            'status' => $this->status,
            'reference' => $this->when(isset($this->reference), $this->reference),
            'requires_email_for_handoff' => $this->user_id === null && $this->guest_email === null,
            'created_at' => $this->created_at?->toIso8601String(),
            'messages' => $this->whenLoaded('messages', fn () => $this->messages->map(fn ($message) => [
                'id' => $message->id,
                'role' => $message->role,
                'content' => $message->content,
                'created_at' => $message->created_at?->toIso8601String(),
            ])->values()),
        ];
    }
}

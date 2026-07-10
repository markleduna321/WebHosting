<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SessionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'classroom_id' => $this->classroom_id,
            'owner_id' => $this->owner_id,
            'channel' => $this->channel,
            'presence_channel' => $this->channel,
            'ws_url' => $this->ws_url,
            'status' => $this->status,
            'started_at' => $this->started_at,
            'ended_at' => $this->ended_at,
            'participant_count' => $this->when(isset($this->participants_count), $this->participants_count),
            'hand_queue' => HandQueueResource::collection($this->whenLoaded('handQueue')),
        ];
    }
}
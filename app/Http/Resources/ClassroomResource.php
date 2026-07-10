<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClassroomResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'owner_id' => $this->owner_id,
            'owner_name' => $this->whenLoaded('owner', fn () => $this->owner?->name),
            'name' => $this->name,
            'description' => $this->description,
            'schedule' => $this->schedule,
            'material_count' => $this->when(isset($this->materials_count), $this->materials_count),
            'materials' => MaterialResource::collection($this->whenLoaded('materials')),
            'active_session' => new SessionResource($this->whenLoaded('activeSession')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
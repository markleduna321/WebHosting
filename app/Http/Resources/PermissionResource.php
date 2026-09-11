<?php

namespace App\Http\Resources;

use App\Services\PermissionService;
use Illuminate\Http\Resources\Json\JsonResource;

class PermissionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'roles_count' => $this->whenCounted('roles'),
            'is_protected' => PermissionService::isProtected($this->resource),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}

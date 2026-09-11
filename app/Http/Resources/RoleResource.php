<?php

namespace App\Http\Resources;

use App\Services\RoleService;
use Illuminate\Http\Resources\Json\JsonResource;

class RoleResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'permissions' => $this->whenLoaded(
                'permissions',
                fn () => $this->permissions->pluck('name'),
            ),
            'users_count' => $this->whenCounted('users'),
            'is_protected' => RoleService::isProtected($this->resource),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}

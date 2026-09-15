<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WebsiteResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'uuid' => $this->uuid,
            'name' => $this->name,
            'subdomain' => $this->subdomain,
            'full_domain' => $this->full_domain,
            'repository_full_name' => $this->repository_full_name,
            'repository_default_branch' => $this->repository_default_branch,
            'repository_private' => $this->repository_private,
            'status' => $this->status,
            'size_bytes' => $this->size_bytes,
            'file_count' => $this->file_count,
            'failure_reason' => $this->failure_reason,
            'last_deployed_at' => $this->last_deployed_at?->toIso8601String(),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}

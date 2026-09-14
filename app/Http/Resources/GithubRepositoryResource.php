<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GithubRepositoryResource extends JsonResource
{
    /**
     * Backed by a GitHub API array rather than an Eloquent model.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->resource['id'],
            'name' => $this->resource['name'],
            'full_name' => $this->resource['full_name'],
            'private' => (bool) ($this->resource['private'] ?? false),
            'default_branch' => $this->resource['default_branch'] ?? 'main',
            'clone_url' => $this->resource['clone_url'] ?? null,
            'html_url' => $this->resource['html_url'] ?? null,
            'updated_at' => $this->resource['updated_at'] ?? null,
        ];
    }
}

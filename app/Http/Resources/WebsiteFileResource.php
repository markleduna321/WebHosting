<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WebsiteFileResource extends JsonResource
{
    /**
     * Backed by an array from WebsiteFileService, not an Eloquent model.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'name' => $this->resource['name'],
            'path' => $this->resource['path'],
            'type' => $this->resource['type'],
            'size_bytes' => $this->resource['size_bytes'],
            'item_count' => $this->resource['item_count'],
            'updated_at' => $this->resource['updated_at'],
        ];
    }
}

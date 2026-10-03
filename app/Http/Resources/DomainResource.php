<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DomainResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'domain' => $this->domain_name,
            'primary' => $this->is_primary,
            'ssl' => $this->ssl_status, // pending, active, none
            'status' => $this->verification_status, // pending, verified, failed
            'site' => $this->website ? $this->website->name : null,
            'created_at' => $this->created_at,
        ];
    }
}

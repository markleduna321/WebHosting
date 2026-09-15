<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StudentDatabaseResource extends JsonResource
{
    /**
     * The password is deliberately absent. It is only ever served by the
     * dedicated, throttled credentials endpoint.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'uuid' => $this->uuid,
            'label' => $this->label,
            'db_name' => $this->db_name,
            'db_user' => $this->db_user,
            'host' => $this->host,
            'port' => $this->port,
            'engine' => 'MySQL',
            'status' => $this->status,
            'size_bytes' => $this->size_bytes,
            'quota_mb' => $this->quota_mb,
            'failure_reason' => $this->failure_reason,
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}

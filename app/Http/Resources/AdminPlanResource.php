<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminPlanResource extends JsonResource
{
    /**
     * Admin-facing resource that exposes all plan fields including the database ID.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'name' => $this->name,
            'subtitle' => $this->subtitle,
            'monthly_price' => $this->monthly_price !== null ? (float) $this->monthly_price : null,
            'currency' => $this->currency,
            'prices' => $this->prices ?? [],
            'period_discounts' => $this->period_discounts ?? [],
            'features' => $this->features ?? [],
            'is_popular' => $this->is_popular,
            'is_active' => $this->is_active,
            'sort_order' => $this->sort_order,
            'max_websites' => $this->max_websites,
            'max_databases' => $this->max_databases,
            'disk_space_mb' => $this->disk_space_mb,
            'db_size_mb' => $this->db_size_mb,
            'subscriptions_count' => $this->whenCounted('subscriptions'),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}

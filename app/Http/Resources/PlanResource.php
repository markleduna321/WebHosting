<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PlanResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'slug' => $this->slug,
            'name' => $this->name,
            'subtitle' => $this->subtitle,
            // Null price means quote-only; the UI renders "Custom" for it.
            'monthly_price' => $this->monthly_price !== null ? (float) $this->monthly_price : null,
            'annual_price' => $this->annual_price !== null ? (float) $this->annual_price : null,
            'currency' => $this->currency,
            'features' => $this->features ?? [],
            'is_popular' => $this->is_popular,
        ];
    }
}

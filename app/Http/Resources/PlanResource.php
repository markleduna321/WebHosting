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
        $annualPrice = $this->resource->priceForPeriod(12);

        return [
            'slug' => $this->slug,
            'name' => $this->name,
            'subtitle' => $this->subtitle,
            // Map these to exactly what the frontend React components expect
            'monthlyPrice' => $this->monthly_price !== null ? (float) $this->monthly_price : null,
            // Objects, never lists: the frontend reads each key as a month count.
            'prices' => (object) $this->resource->pricesByPeriod(),
            'periodDiscounts' => (object) $this->resource->discountsByPeriod(),
            'price' => $this->monthly_price !== null ? '₱'.number_format($this->monthly_price, 0) : 'Custom',
            'currency' => $this->currency,
            'features' => $this->features ?? [],
            'popular' => $this->is_popular,
            'billingNote' => $this->monthly_price !== null ? '/month' : '',
            'annualNote' => $annualPrice !== null ? 'or ₱'.number_format($annualPrice, 0).' billed annually' : ($this->monthly_price === null ? 'Contact for pricing' : ''),
            'cta' => 'Get Started',
        ];
    }
}

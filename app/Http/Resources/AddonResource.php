<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AddonResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->slug,
            'label' => $this->name,
            'price' => $this->price / 100, // Convert centavos to pesos for frontend
            'period' => $this->billing_period,
            'description' => $this->description,
        ];
    }
}

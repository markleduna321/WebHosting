<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Plan extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug',
        'name',
        'subtitle',
        'monthly_price',
        'currency',
        'prices',
        'period_discounts',
        'features',
        'is_popular',
        'is_active',
        'sort_order',
        'max_websites',
        'max_databases',
        'disk_space_mb',
        'db_size_mb',
    ];

    protected function casts(): array
    {
        return [
            'features' => 'array',
            'prices' => 'array',
            'period_discounts' => 'array',
            'monthly_price' => 'decimal:2',
            'is_popular' => 'boolean',
            'is_active' => 'boolean',
            'max_websites' => 'integer',
            'max_databases' => 'integer',
            'disk_space_mb' => 'integer',
            'db_size_mb' => 'integer',
        ];
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function priceForPeriod(int $months): ?float
    {
        if ($this->monthly_price === null) {
            return null;
        }

        if ($months === 1) {
            return (float) $this->monthly_price;
        }

        $discounts = $this->period_discounts ?? [];
        if (array_key_exists($months, $discounts)) {
            $discount = $discounts[$months];
            if (! is_numeric($discount) || $discount < 0 || $discount > 100) {
                return null;
            }

            return round(
                (float) $this->monthly_price * $months * (100 - (float) $discount) / 100,
                2
            );
        }

        $prices = $this->prices ?? [];
        if (array_key_exists($months, $prices)) {
            return $prices[$months] !== null ? (float) $prices[$months] : null;
        }

        return round((float) $this->monthly_price * $months, 2);
    }

    public function subscriptions(): HasMany
    {
        return $this->hasMany(Subscription::class);
    }
}

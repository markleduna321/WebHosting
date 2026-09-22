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

    public function subscriptions(): HasMany
    {
        return $this->hasMany(Subscription::class);
    }
}

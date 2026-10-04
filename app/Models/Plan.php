<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Log;

class Plan extends Model
{
    use HasFactory;

    /** @var array<string, bool> */
    private array $reportedMalformedColumns = [];

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

    /**
     * @return array<int, int>
     */
    public function billingPeriods(): array
    {
        if ($this->monthly_price === null) {
            return [];
        }

        $periods = [1];
        foreach (array_merge(
            array_keys($this->pricesByPeriod()),
            array_keys($this->discountsByPeriod())
        ) as $period) {
            if ($period >= 2) {
                $periods[] = $period;
            }
        }

        $periods = array_values(array_unique($periods));
        sort($periods);

        return array_values(array_filter(
            $periods,
            fn (int $months): bool => ($this->priceForPeriod($months) ?? 0) > 0
        ));
    }

    public function supportsBillingPeriod(int $months): bool
    {
        return in_array($months, $this->billingPeriods(), true);
    }

    public function priceForPeriod(int $months): ?float
    {
        if ($months < 1 || $this->monthly_price === null) {
            return null;
        }

        if ($months === 1) {
            return (float) $this->monthly_price;
        }

        $discounts = $this->discountsByPeriod();
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

        $prices = $this->pricesByPeriod();
        if (array_key_exists($months, $prices)) {
            return is_numeric($prices[$months]) ? (float) $prices[$months] : null;
        }

        return null;
    }

    /**
     * Saved period totals keyed by month count.
     *
     * @return array<int, mixed>
     */
    public function pricesByPeriod(): array
    {
        return $this->periodMap('prices');
    }

    /**
     * Saved period discount percentages keyed by month count.
     *
     * @return array<int, mixed>
     */
    public function discountsByPeriod(): array
    {
        return $this->periodMap('period_discounts');
    }

    /**
     * Only month-keyed maps are valid. A JSON list (e.g. [249, 2200]) would
     * otherwise turn its array indexes into billing periods, so it is ignored.
     *
     * @return array<int, mixed>
     */
    private function periodMap(string $column): array
    {
        $value = $this->{$column};

        if (! is_array($value) || $value === []) {
            return [];
        }

        if (array_is_list($value)) {
            if (! isset($this->reportedMalformedColumns[$column])) {
                $this->reportedMalformedColumns[$column] = true;
                Log::warning('Plan period map is a list instead of a month-keyed object; ignoring it.', [
                    'plan' => $this->slug,
                    'column' => $column,
                ]);
            }

            return [];
        }

        $map = [];
        foreach ($value as $months => $amount) {
            $months = filter_var($months, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);
            if ($months !== false) {
                $map[$months] = $amount;
            }
        }
        ksort($map);

        return $map;
    }

    public function subscriptions(): HasMany
    {
        return $this->hasMany(Subscription::class);
    }
}

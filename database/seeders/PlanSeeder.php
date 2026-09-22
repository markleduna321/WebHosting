<?php

namespace Database\Seeders;

use App\Models\Plan;
use Illuminate\Database\Seeder;

class PlanSeeder extends Seeder
{
    /**
     * Mirrors resources/js/data/hostingPlans.js until the static file is retired.
     */
    public function run(): void
    {
        $plans = [
            [
                'slug' => 'student',
                'name' => 'Student',
                'subtitle' => 'For your very first site',
                'monthly_price' => 129,
                'prices' => [
                    1 => 129,
                    12 => 1000,
                    24 => 1800,
                    48 => 3000,
                ],
                'features' => [
                    '1 Site',
                    '1 Free Subdomain',
                    '50MB NVMe Storage',
                    '1 MySQL Database (50MB)',
                    'Automated Git Push Sync',
                    'Free SSL',
                ],
                'max_websites' => 1,
                'max_databases' => 1,
                'disk_space_mb' => 50,
                'db_size_mb' => 50,
                'is_popular' => false,
                'sort_order' => 1,
            ],
            [
                'slug' => 'pro',
                'name' => 'Pro',
                'subtitle' => 'For growing student projects',
                'monthly_price' => 249,
                'prices' => [
                    1 => 249,
                    12 => 2200,
                    24 => 4000,
                    48 => 7000,
                ],
                'features' => [
                    '3 Sites',
                    '1 Free Subdomain',
                    '200MB NVMe Storage',
                    '1 MySQL Database (100MB)',
                    'Automated Git Push Sync',
                    'VS Code AI Extension (BYOK)',
                    'Free SSL',
                ],
                'max_websites' => 3,
                'max_databases' => 1,
                'disk_space_mb' => 200,
                'db_size_mb' => 100,
                'is_popular' => true,
                'sort_order' => 2,
            ],
            [
                'slug' => 'enterprise',
                'name' => 'Enterprise',
                'subtitle' => 'For organizations and capstone teams',
                'monthly_price' => null,
                'prices' => [],
                'features' => [
                    'Free Domain (1 Year)',
                    'Automated Git + Priority Sync',
                ],
                'max_websites' => 100,
                'max_databases' => 100,
                'disk_space_mb' => 10000,
                'db_size_mb' => 1000,
                'is_popular' => false,
                'sort_order' => 3,
            ],
        ];

        foreach ($plans as $plan) {
            Plan::updateOrCreate(
                ['slug' => $plan['slug']],
                [
                    'name' => $plan['name'],
                    'subtitle' => $plan['subtitle'],
                    'monthly_price' => $plan['monthly_price'],
                    'prices' => $plan['prices'],
                    'currency' => 'PHP',
                    'features' => $plan['features'],
                    'max_websites' => $plan['max_websites'],
                    'max_databases' => $plan['max_databases'],
                    'disk_space_mb' => $plan['disk_space_mb'],
                    'db_size_mb' => $plan['db_size_mb'],
                    'is_popular' => $plan['is_popular'],
                    'is_active' => true,
                    'sort_order' => $plan['sort_order'],
                ]
            );
        }
    }
}

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
                'annual_price' => 1000,
                'features' => [
                    '1 Site',
                    '1 Free Subdomain',
                    '50MB NVMe Storage',
                    '1 MySQL Database (50MB)',
                    'Automated Git Push Sync',
                    'Free SSL',
                ],
                'is_popular' => false,
                'sort_order' => 1,
            ],
            [
                'slug' => 'pro',
                'name' => 'Pro',
                'subtitle' => 'For growing student projects',
                'monthly_price' => 249,
                'annual_price' => 2200,
                'features' => [
                    '3 Sites',
                    '1 Free Subdomain',
                    '200MB NVMe Storage',
                    '1 MySQL Database (100MB)',
                    'Automated Git Push Sync',
                    'VS Code AI Extension (BYOK)',
                    'Free SSL',
                ],
                'is_popular' => true,
                'sort_order' => 2,
            ],
            [
                'slug' => 'enterprise',
                'name' => 'Enterprise',
                'subtitle' => 'For organizations and capstone teams',
                'monthly_price' => null,
                'annual_price' => null,
                'features' => [
                    'Free Domain (1 Year)',
                    'Automated Git + Priority Sync',
                ],
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
                    'annual_price' => $plan['annual_price'],
                    'currency' => 'PHP',
                    'features' => $plan['features'],
                    'is_popular' => $plan['is_popular'],
                    'is_active' => true,
                    'sort_order' => $plan['sort_order'],
                ]
            );
        }
    }
}

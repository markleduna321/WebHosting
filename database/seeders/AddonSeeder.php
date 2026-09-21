<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AddonSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\Addon::updateOrCreate(
            ['slug' => 'extra-storage'],
            [
                'name' => 'Extra 10 GB Storage',
                'price' => 5000, // 50 PHP = 5000 centavos
                'billing_period' => 'month',
                'description' => [
                    "Room for bigger media libraries, datasets, or multiple projects.",
                    "Upgrade anytime without migrating your existing site.",
                ],
                'is_active' => true,
            ]
        );

        \App\Models\Addon::updateOrCreate(
            ['slug' => 'website-security'],
            [
                'name' => 'Website Security',
                'price' => 19900, // 199 PHP = 19900 centavos
                'billing_period' => 'month',
                'description' => [
                    "Web Application Firewall (WAF) blocks common attacks.",
                    "Malware scanning and alerts with cleanup support.",
                ],
                'is_active' => true,
            ]
        );
    }
}

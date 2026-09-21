<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Add-ons Pricing
    |--------------------------------------------------------------------------
    |
    | This acts as the single source of truth for add-on pricing on the backend.
    | It should match the prices defined in the frontend hostingPlans.js.
    |
    */
    'prices' => [
        'professional-email' => [
            'price' => 49,
            'period' => 'month',
        ],
        'extra-storage' => [
            'price' => 50,
            'period' => 'month',
        ],
        'daily-backup' => [
            'price' => 149,
            'period' => 'month',
        ],
        'website-maintenance' => [
            'price' => 499,
            'period' => 'month',
        ],
        'website-security' => [
            'price' => 199,
            'period' => 'month',
        ],
        'premium-ssl' => [
            'price' => 999,
            'period' => 'year',
        ],
    ],
];

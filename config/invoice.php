<?php

return [

    'seller' => [
        'name' => env('INVOICE_SELLER_NAME', 'CALEHO Solutions'),
        'address' => env('INVOICE_SELLER_ADDRESS', 'Lot 39, Garnet St. South Villa 3, Palampas, San Carlos City, Negros Occidental'),
        'phone' => env('INVOICE_SELLER_PHONE', '+63 906-683-0934'),
        'email' => env('INVOICE_SELLER_EMAIL', 'calehosolutions.com'),
        'tin' => env('INVOICE_SELLER_TIN'),
        // Small prebuilt copy of logo 3.png; the originals are too large for dompdf to decode.
        'logo_path' => public_path('images/invoice-logo.png'),
    ],

    // Flip to true only once BIR VAT registration is approved.
    'vat_registered' => filter_var(env('INVOICE_VAT_REGISTERED', false), FILTER_VALIDATE_BOOLEAN),
    'vat_rate' => (float) env('INVOICE_VAT_RATE', 0.12),

    'number_prefix' => env('INVOICE_NUMBER_PREFIX', 'CAL'),

];

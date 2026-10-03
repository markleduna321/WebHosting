<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'github' => [
        'client_id' => env('GITHUB_CLIENT_ID'),
        'client_secret' => env('GITHUB_CLIENT_SECRET'),
        'redirect' => env('GITHUB_REDIRECT_URI', '/auth/github/callback'),
    ],

    'openai' => [
        'key' => env('OPENAI_API_KEY'),
        'model' => env('OPENAI_MODEL', 'gpt-4o-mini'),
        'scope_model' => env('OPENAI_SCOPE_MODEL', env('OPENAI_MODEL', 'gpt-4o-mini')),
    ],

    'support' => [
        'team_email' => env('SUPPORT_TEAM_EMAIL'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
        // Must be an address on a domain verified in Resend.
        'from' => env('RESEND_FROM_ADDRESS', env('MAIL_FROM_ADDRESS')),
    ],

    'paymongo' => [
        'secret_key' => env('PAYMONGO_SECRET_KEY'),
        // Shown once when the endpoint is created in the dashboard. NOT the secret API key.
        'webhook_secret' => env('PAYMONGO_WEBHOOK_SECRET'),
        'base_url' => env('PAYMONGO_BASE_URL', 'https://api.paymongo.com/v1'),
        'livemode' => filter_var(env('PAYMONGO_LIVEMODE', false), FILTER_VALIDATE_BOOLEAN),
        // QR Ph accepts 60-9000; PayMongo defaults to 1800.
        'qr_expiry_seconds' => (int) env('PAYMONGO_QR_EXPIRY_SECONDS', 1800),
        'signature_tolerance' => (int) env('PAYMONGO_SIGNATURE_TOLERANCE', 300),
        // Flip on only after PayMongo activates the method on the account. QR Ph is always on.
        'methods' => [
            'card' => filter_var(env('PAYMONGO_METHOD_CARD', false), FILTER_VALIDATE_BOOLEAN),
            'gcash' => filter_var(env('PAYMONGO_METHOD_GCASH', false), FILTER_VALIDATE_BOOLEAN),
            'maya' => filter_var(env('PAYMONGO_METHOD_MAYA', false), FILTER_VALIDATE_BOOLEAN),
            'grabpay' => filter_var(env('PAYMONGO_METHOD_GRABPAY', false), FILTER_VALIDATE_BOOLEAN),
        ],
    ],

];

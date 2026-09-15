<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Repository Clone Limits
    |--------------------------------------------------------------------------
    |
    | Guard rails applied while extracting an untrusted repository archive.
    | They protect against zip bombs and disk exhaustion, so raise them
    | deliberately rather than removing them.
    |
    */

    'clone' => [
        'max_files' => (int) env('CLONE_MAX_FILES', 50_000),
        'max_file_bytes' => (int) env('CLONE_MAX_FILE_MB', 100) * 1024 * 1024,
        'max_total_bytes' => (int) env('CLONE_MAX_TOTAL_MB', 500) * 1024 * 1024,
    ],

    /*
    |--------------------------------------------------------------------------
    | Student Database Provisioning
    |--------------------------------------------------------------------------
    |
    | Settings for schemas provisioned on behalf of students. The connection
    | named here must be privileged enough to run CREATE DATABASE / CREATE USER
    | and is never used for ordinary application queries.
    |
    */

    'databases' => [
        'connection' => env('STUDENT_DB_CONNECTION', 'mysql_admin'),

        // Advertised to students in their connection string.
        'host' => env('STUDENT_DB_HOST', '127.0.0.1'),
        'port' => (int) env('STUDENT_DB_PORT', 3306),

        // Prefix applied to every generated schema and account name.
        'prefix' => env('STUDENT_DB_PREFIX', 'stu'),

        // Host portion of the GRANT. Keep this local so credentials cannot be used remotely.
        'grant_host' => env('STUDENT_DB_GRANT_HOST', 'localhost'),

        'charset' => env('STUDENT_DB_CHARSET', 'utf8mb4'),
        'collation' => env('STUDENT_DB_COLLATION', 'utf8mb4_unicode_ci'),

        'max_per_user' => (int) env('STUDENT_DB_MAX_PER_USER', 3),
        'quota_mb' => (int) env('STUDENT_DB_QUOTA_MB', 256),

        'phpmyadmin_url' => env('STUDENT_DB_PHPMYADMIN_URL', 'http://localhost/phpmyadmin'),
    ],

];

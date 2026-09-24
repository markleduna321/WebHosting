<?php

require 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\Process;

$output = Process::env(['DB_DATABASE' => false])->run('php -r "var_dump(getenv(\'DB_DATABASE\'));"')->output();
echo "With false: " . $output . "\n";

$output = Process::env(['DB_DATABASE' => null])->run('php -r "var_dump(getenv(\'DB_DATABASE\'));"')->output();
echo "With null: " . $output . "\n";


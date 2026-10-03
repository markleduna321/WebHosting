<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$dotenv = \Dotenv\Dotenv::createArrayBacked(base_path())->load();
$keys = array_keys($dotenv);
var_dump(array_slice($keys, 0, 5));

<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

try {
    $email = 'test_' . Str::random(5) . '@example.com';
    $user = User::create([
        'name' => 'Test User',
        'email' => $email,
        'password' => Hash::make('password123'),
    ]);

    echo "User created successfully.\n";

    $user->assignRole('student');
    echo "Role assigned successfully.\n";

    event(new Registered($user));
    echo "Registered event fired successfully.\n";

    Auth::login($user);
    echo "Auth login successfully.\n";

    $route = route('dashboard', absolute: false);
    echo "Route generated: " . $route . "\n";

} catch (\Throwable $e) {
    echo "ERROR: " . get_class($e) . "\n";
    echo $e->getMessage() . "\n";
    echo $e->getTraceAsString() . "\n";
}

<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$user = App\Models\User::first();
if (!$user) { echo "No user found\n"; exit; }

$studentPlan = App\Models\Plan::where('slug', 'student')->first();
if (!$user->activeSubscription) {
    $user->subscriptions()->create([
        'plan_id' => $studentPlan->id,
        'status' => 'active',
        'billing_cycle' => 'monthly',
        'starts_at' => now(),
        'ends_at' => now()->addMonth(),
    ]);
}
$sub = $user->activeSubscription;
$sub->update(['plan_id' => $studentPlan->id]);

echo "User is on Student plan. DB limit: " . $sub->plan->max_databases . PHP_EOL;

$service = app(App\Services\StudentDatabaseService::class);
try {
    $db1 = $service->createForUser($user, ['name' => 'test1', 'password' => 'Pass123!']);
    echo "Created db1\n";
} catch (\Exception $e) {
    echo "Error creating db1: " . $e->getMessage() . PHP_EOL;
}
try {
    $db2 = $service->createForUser($user, ['name' => 'test2', 'password' => 'Pass123!']);
    echo "Created db2\n";
} catch (\Exception $e) {
    echo "Error creating db2: " . $e->getMessage() . PHP_EOL;
}

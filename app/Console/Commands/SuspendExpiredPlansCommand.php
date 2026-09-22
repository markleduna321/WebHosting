<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class SuspendExpiredPlansCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:suspend-expired-plans-command';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle(\App\Services\StudentDatabaseService $databaseService)
    {
        // 1. Mark subscriptions as expired if ends_at is in the past and they are live.
        $expiredCount = \App\Models\Subscription::live()
            ->whereNotNull('ends_at')
            ->where('ends_at', '<', now())
            ->update(['status' => \App\Models\Subscription::STATUS_EXPIRED]);

        $this->info("Marked {$expiredCount} subscriptions as expired.");

        // 2. Suspend websites and databases for users without a live subscription.
        $usersWithoutPlan = \App\Models\User::whereDoesntHave('subscriptions', function ($query) {
            $query->live();
        })->get();

        $websiteCount = 0;
        $dbCount = 0;

        foreach ($usersWithoutPlan as $user) {
            // Suspend websites
            $websites = $user->websites()->where('status', '!=', \App\Models\Website::STATUS_STOPPED)->get();
            foreach ($websites as $website) {
                $publicPath = $website->storage_path . '/public';
                if (is_link($publicPath)) {
                    @unlink($publicPath);
                }
                
                $website->update(['status' => \App\Models\Website::STATUS_STOPPED]);
                $websiteCount++;
            }

            // Suspend databases (Lock accounts)
            $databases = $user->studentDatabases;
            foreach ($databases as $database) {
                try {
                    $databaseService->lockAccount($database);
                    $dbCount++;
                } catch (\Throwable $e) {
                    \Illuminate\Support\Facades\Log::error("Failed to lock database account for user {$user->id}: {$e->getMessage()}");
                }
            }
        }

        $this->info("Suspended {$websiteCount} websites and {$dbCount} databases.");
    }
}

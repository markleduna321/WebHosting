<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        RateLimiter::for('support', function (Request $request) {
            $ip = 'support-ip:'.$request->ip();
            $user = $request->user();

            if ($user) {
                return [
                    Limit::perMinute(10)->by('support-user:'.$user->id),
                    Limit::perMinute(20)->by($ip),
                    Limit::perDay(100)->by('support-user:'.$user->id),
                ];
            }

            return [
                Limit::perMinute(10)->by($ip),
                Limit::perDay(60)->by($ip),
            ];
        });

        RateLimiter::for('support-handoff', function (Request $request) {
            $key = $request->user()
                ? 'support-handoff-user:'.$request->user()->id
                : 'support-handoff-ip:'.$request->ip();

            return Limit::perHour(3)->by($key);
        });

        // Older MySQL/MariaDB (utf8mb4, no innodb_large_prefix) caps index keys at 767 bytes.
        Schema::defaultStringLength(191);
    }
}

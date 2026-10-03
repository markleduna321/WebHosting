<?php

namespace App\Jobs;

use App\Models\Website;
use App\Services\GithubService;
use App\Services\RepositoryArchiveExtractor;
use App\Services\StudentDatabaseService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Process;
use Throwable;

class CloneRepositoryJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public int $timeout = 600;
    public array $backoff = [10, 60];

    public function __construct(public readonly Website $website) {}

    public function handle(
        GithubService $github, 
        RepositoryArchiveExtractor $extractor,
        StudentDatabaseService $dbService
    ): void {
        $website = $this->website->fresh();
        if (! $website) return;

        $connection = $website->user->githubConnection;
        if (! $connection) {
            $this->markFailed($website, 'GitHub is no longer connected.');
            return;
        }

        if (! $website->user->activeSubscription) {
            $this->markFailed($website, 'You do not have an active subscription plan.');
            return;
        }

        $website->update(['status' => Website::STATUS_BUILDING]);

        $domainName = strtolower($website->subdomain) . '.caleho.cloud';
        $destination = "/home/caleho/htdocs/{$domainName}";
        $archivePath = null;

        try {
            $archivePath = $github->downloadZipball(
                $connection,
                $website->repository_full_name,
                $website->repository_default_branch,
            );

            // Clear old directory state
            if (File::exists($destination)) {
                File::deleteDirectory($destination);
            }

            // Extract zipball contents
            $diskSpaceLimitMb = $website->user->activeSubscription?->plan?->disk_space_mb ?? 50;
            $extractor->setMaxTotalBytes($diskSpaceLimitMb * 1024 * 1024);
            $stats = $extractor->extract($archivePath, $destination);

            // Set ownership to the site user early
            Process::run("chown -R caleho:caleho {$destination}");
            Process::run("chmod -R 755 {$destination}");

            // =========================================================
            // 1. PHP / LARAVEL BUILD & MYSQL MIGRATIONS STEP
            // =========================================================
            $isLaravel = File::exists("{$destination}/artisan");

            if (File::exists("{$destination}/composer.json")) {
                $this->runAsSiteUser("cd {$destination} && composer install --no-dev --optimize-autoloader");

                // Environment file setup
                if (File::exists("{$destination}/.env.example") && ! File::exists("{$destination}/.env")) {
                    File::copy("{$destination}/.env.example", "{$destination}/.env");
                    $this->runAsSiteUser("cd {$destination} && php artisan key:generate --force");
                }

                // Provision MySQL Database and Inject Credentials
                if ($isLaravel) {
                    $user = $website->user;
                    $studentDb = $user->studentDatabases()->where('label', $website->subdomain)->first();
                    
                    if (! $studentDb) {
                        try {
                            $studentDb = $dbService->createForUser($user, [
                                'name' => $website->subdomain,
                                'password' => \Illuminate\Support\Str::password(16),
                            ]);
                        } catch (Throwable $dbErr) {
                            Log::warning("MySQL provisioning failed for {$website->subdomain}: " . $dbErr->getMessage());
                        }
                    }

                    if ($studentDb && File::exists("{$destination}/.env")) {
                        $envContent = File::get("{$destination}/.env");
                        $replacements = [
                            '/DB_CONNECTION=.*/' => 'DB_CONNECTION=mysql',
                            '/DB_HOST=.*/' => 'DB_HOST=127.0.0.1',
                            '/DB_PORT=.*/' => 'DB_PORT=' . $studentDb->port,
                            '/DB_DATABASE=.*/' => 'DB_DATABASE=' . $studentDb->db_name,
                            '/DB_USERNAME=.*/' => 'DB_USERNAME=' . $studentDb->db_user,
                            '/DB_PASSWORD=.*/' => 'DB_PASSWORD="' . addslashes($studentDb->db_password) . '"',
                        ];
                        foreach ($replacements as $pattern => $replacement) {
                            $envContent = preg_replace($pattern, $replacement, $envContent);
                        }
                        File::put("{$destination}/.env", $envContent);
                    }

                    $this->runAsSiteUser("cd {$destination} && php artisan migrate --force");
                    $this->runAsSiteUser("cd {$destination} && chmod -R 775 storage bootstrap/cache");
                }
            }

            // =========================================================
            // 2. NODE / JAVASCRIPT BUILD STEP
            // =========================================================
            if (File::exists("{$destination}/package.json")) {
                $this->runAsSiteUser("cd {$destination} && npm install");
                $this->runAsSiteUser("cd {$destination} && npm run build");

                // Next.js static export detection
                $packageJson = json_decode(File::get("{$destination}/package.json"), true);
                if (isset($packageJson['dependencies']['next']) || isset($packageJson['devDependencies']['next'])) {
                    $this->runAsSiteUser("cd {$destination} && npm run export || npx next export");
                    $nextExportPath = "{$destination}/out";
                    if (File::exists("{$nextExportPath}/index.html")) {
                        $buildOutput = $nextExportPath;
                    }
                }

                if (! $isLaravel) {
                    if (!isset($buildOutput) || $buildOutput === null) {
                        $buildOutput = match (true) {
                            File::exists("{$destination}/dist/index.html") => "{$destination}/dist",
                            File::exists("{$destination}/.output/public/index.html") => "{$destination}/.output/public",
                            File::exists("{$destination}/build/index.html") => "{$destination}/build",
                            File::exists("{$destination}/out/index.html") => "{$destination}/out",
                            File::exists("{$destination}/vite.config.ts") || File::exists("{$destination}/vite.config.js") => $this->runViteFallback($destination),
                            default => null,
                        };
                    }

                    if ($buildOutput && File::exists($buildOutput)) {
                        File::deleteDirectory("{$destination}/public");
                        @symlink($buildOutput, "{$destination}/public");
                    }
                }
            }

            // =========================================================
            // 3. PLAIN STATIC HTML FALLBACK
            // =========================================================
            if (! File::exists("{$destination}/public")) {
                @symlink($destination, "{$destination}/public");
            }

            // Final permissions fix
            Process::run("chown -R caleho:caleho {$destination}");
            Process::run("chmod -R 755 {$destination}");

            // =========================================================
            // 4. VERIFY DEPLOYMENT INTEGRITY
            // =========================================================
            if (! File::exists("{$destination}/public/index.php") && ! File::exists("{$destination}/public/index.html")) {
                if (File::exists("{$destination}/package.json") && !File::exists("{$destination}/composer.json")) {
                    $packageJson = json_decode(File::get("{$destination}/package.json"), true);
                    if (isset($packageJson['dependencies']['next']) || isset($packageJson['devDependencies']['next'])) {
                        throw new \Exception("Next.js applications must be configured for static export. Please add 'output: \"export\"' to your next.config.js or next.config.mjs file.");
                    }
                }
                throw new \Exception("Deployment failed: No index.php or index.html found in the public directory. If using a frontend framework, ensure it is configured to export static files.");
            }

            $website->update([
                'status' => Website::STATUS_LIVE,
                'storage_path' => $destination,
                'file_count' => $stats['file_count'],
                'size_bytes' => $stats['size_bytes'],
                'failure_reason' => null,
                'last_deployed_at' => now(),
            ]);
        } catch (Throwable $e) {
            File::deleteDirectory($destination);
            Log::error('Deployment pipeline failed.', [
                'website_uuid' => $website->uuid,
                'reason' => $e->getMessage(),
            ]);
            $this->markFailed($website, 'Deployment failed: ' . $e->getMessage());
            throw $e;
        } finally {
            if ($archivePath !== null && file_exists($archivePath)) {
                @unlink($archivePath);
            }
        }
    }

    private function runAsSiteUser(string $command): void
    {
        $escapedCommand = addslashes($command);
        $result = Process::run("su - caleho -s /bin/bash -c \"{$escapedCommand}\"");

        if (! $result->successful()) {
            Log::warning("Command failed during execution: {$command}", [
                'error' => $result->errorOutput()
            ]);
        }
    }

    private function runViteFallback(string $destination): ?string
    {
        $this->runAsSiteUser("cd {$destination} && npx vite build");
        if (File::exists("{$destination}/dist/index.html")) {
            return "{$destination}/dist";
        }
        return null;
    }

    private function markFailed(Website $website, string $reason): void
    {
        $website->update([
            'status' => Website::STATUS_FAILED,
            'failure_reason' => $reason,
        ]);
    }
}
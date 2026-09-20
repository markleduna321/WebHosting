<?php

namespace App\Jobs;

use App\Exceptions\GithubAuthorizationException;
use App\Exceptions\RepositoryExtractionException;
use App\Models\Website;
use App\Services\GithubService;
use App\Services\RepositoryArchiveExtractor;
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
    public int $timeout = 600; // Increased to 10m to allow npm builds
    public array $backoff = [10, 60];

    public function __construct(public readonly Website $website) {}

    public function handle(GithubService $github, RepositoryArchiveExtractor $extractor): void
    {
        $website = $this->website->fresh();
        if (! $website) return;

        $connection = $website->user->githubConnection;
        if (! $connection) {
            $this->markFailed($website, 'GitHub is no longer connected.');
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
            $stats = $extractor->extract($archivePath, $destination);

            // Environment path setup for binaries
            $envPath = ['PATH' => '/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin'];

            // =========================================================
            // 1. COMPOSER / LARAVEL BUILD STEP
            // =========================================================
            if (File::exists("{$destination}/composer.json")) {
                Process::path($destination)->env($envPath)->run('composer install --no-dev --optimize-autoloader');
                if (File::exists("{$destination}/.env.example") && ! File::exists("{$destination}/.env")) {
                    File::copy("{$destination}/.env.example", "{$destination}/.env");
                    Process::path($destination)->env($envPath)->run('php artisan key:generate --force');
                }
            }

            // =========================================================
            // 2. NODE / JAVASCRIPT BUILD STEP
            // =========================================================
            if (File::exists("{$destination}/package.json")) {
                Process::path($destination)->env($envPath)->run('npm install');

                // Fallback attempt with npx vite build if standard script fails or outputs no index.html
                Process::path($destination)->env($envPath)->run('npm run build');

                // Determine framework static output target containing index.html
                $buildOutput = match (true) {
                    File::exists("{$destination}/dist/index.html") => "{$destination}/dist",
                    File::exists("{$destination}/.output/public/index.html") => "{$destination}/.output/public",
                    File::exists("{$destination}/build/index.html") => "{$destination}/build",
                    File::exists("{$destination}/out/index.html") => "{$destination}/out",
                    // Fallback check for assets-only output: attempt direct Vite SPA fallback
                    File::exists("{$destination}/vite.config.ts") || File::exists("{$destination}/vite.config.js") => $this->runViteFallback($destination, $envPath),
                    default => null,
                };

                if ($buildOutput && File::exists($buildOutput)) {
                    File::deleteDirectory("{$destination}/public");
                    @symlink($buildOutput, "{$destination}/public");
                }
            }

            // =========================================================
            // 3. PLAIN STATIC HTML FALLBACK
            // =========================================================
            if (! File::exists("{$destination}/public")) {
                @symlink($destination, "{$destination}/public");
            }

            // Grant ownership and directory traversal permissions
            Process::run("chown -R caleho:caleho {$destination}");
            Process::run("chmod -R 755 {$destination}");

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

    private function runViteFallback(string $destination, array $envPath): ?string
    {
        Process::path($destination)->env($envPath)->run('npx vite build');
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
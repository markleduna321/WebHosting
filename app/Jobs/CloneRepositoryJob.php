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

    public int $timeout = 300;

    /** @var array<int, int> */
    public array $backoff = [10, 60];

    public function __construct(public readonly Website $website) {}

    public function handle(GithubService $github, RepositoryArchiveExtractor $extractor): void
    {
        $website = $this->website->fresh();

        if (! $website) {
            return;
        }

        $connection = $website->user->githubConnection;

        if (! $connection) {
            $this->markFailed($website, 'GitHub is no longer connected.');

            return;
        }

        $website->update(['status' => Website::STATUS_BUILDING]);

        $domainName = strtolower($website->subdomain).'.caleho.cloud';
        $destination = "/home/caleho/htdocs/{$domainName}";
        $archivePath = null;

        try {
            $archivePath = $github->downloadZipball(
                $connection,
                $website->repository_full_name,
                $website->repository_default_branch,
            );

            if (File::exists($destination)) {
                File::deleteDirectory($destination);
            }

            $stats = $extractor->extract($archivePath, $destination);

            // =========================================================
            // AUTOMATIC BUILD PIPELINE
            // =========================================================
            $packageJson = "{$destination}/package.json";

            if (File::exists($packageJson)) {
                // 1. Install dependencies & compile frontend
                Process::path($destination)->env(['PATH' => '/usr/bin:' . getenv('PATH')])->run('npm install');
                Process::path($destination)->env(['PATH' => '/usr/bin:' . getenv('PATH')])->run('npm run build');

                // 2. Identify output folder created by the framework build step
                $buildOutput = match (true) {
                    File::exists("{$destination}/.output/public") => "{$destination}/.output/public", // Nitro / TanStack / Nuxt
                    File::exists("{$destination}/dist") => "{$destination}/dist",                      // Vite / Vue / React
                    File::exists("{$destination}/build") => "{$destination}/build",                    // CRA / Svelte
                    File::exists("{$destination}/out") => "{$destination}/out",                        // Next.js static export
                    default => null,
                };

                if ($buildOutput) {
                    File::deleteDirectory("{$destination}/public");
                    @symlink($buildOutput, "{$destination}/public");
                }
            }

            // Fallback for raw static HTML repositories without a public/ folder
            if (! File::exists("{$destination}/public")) {
                @symlink($destination, "{$destination}/public");
            }

            // Grant read/execute permissions to CloudPanel site user
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
        } catch (RepositoryExtractionException $e) {
            File::deleteDirectory($destination);
            $this->markFailed($website, $e->getMessage());
        } catch (GithubAuthorizationException) {
            File::deleteDirectory($destination);
            $this->markFailed($website, 'Your GitHub authorization expired. Reconnect and redeploy.');
        } catch (Throwable $e) {
            File::deleteDirectory($destination);
            Log::error('Repository clone failed.', [
                'website_uuid' => $website->uuid,
                'reason' => $e->getMessage(),
            ]);
            $this->markFailed($website, 'We could not deploy this repository. Please try again.');

            throw $e;
        } finally {
            if ($archivePath !== null && file_exists($archivePath)) {
                @unlink($archivePath);
            }
        }
    }

    public function failed(Throwable $exception): void
    {
        $this->website->fresh()?->update([
            'status' => Website::STATUS_FAILED,
            'failure_reason' => 'Deployment failed after several attempts.',
        ]);
    }

    private function markFailed(Website $website, string $reason): void
    {
        $website->update([
            'status' => Website::STATUS_FAILED,
            'failure_reason' => $reason,
        ]);
    }
}
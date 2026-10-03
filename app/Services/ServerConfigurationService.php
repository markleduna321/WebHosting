<?php

namespace App\Services;

use App\Models\Domain;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Process;

class ServerConfigurationService
{
    /**
     * Generate an Nginx configuration, verify it, and apply it.
     */
    public function applyDomainConfig(Domain $domain): bool
    {
        $website = $domain->website;
        $stubPath = resource_path('stubs/nginx.stub');
        
        if (!File::exists($stubPath)) {
            Log::error("Nginx stub not found at {$stubPath}");
            return false;
        }

        $stub = File::get($stubPath);

        // Replace placeholders
        $config = str_replace(
            ['{{ domain }}', '{{ root_path }}'],
            [$domain->domain_name, $website->storage_path],
            $stub
        );

        $availablePath = "/etc/nginx/sites-available/{$domain->domain_name}";
        $enabledPath = "/etc/nginx/sites-enabled/{$domain->domain_name}";

        try {
            // Write to sites-available. In a local dev environment (Windows), 
            // these paths won't exist. We fallback to a local dummy path for testing if needed.
            $this->writeFile($availablePath, $config);
            
            // Create symlink
            $this->createSymlink($availablePath, $enabledPath);

            // Test Nginx config
            if ($this->testNginxConfig()) {
                // Reload Nginx
                $this->reloadNginx();
                return true;
            } else {
                // Rollback symlink
                $this->removeSymlink($enabledPath);
                Log::error("Nginx config test failed for {$domain->domain_name}. Rolled back.");
                return false;
            }
        } catch (\Throwable $e) {
            Log::error("Failed to apply Nginx config for {$domain->domain_name}: " . $e->getMessage());
            $this->removeSymlink($enabledPath);
            return false;
        }
    }

    private function writeFile(string $path, string $content): void
    {
        // For local development on Windows, mock the file creation
        if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
            $localPath = storage_path('app/nginx/' . basename($path));
            File::ensureDirectoryExists(dirname($localPath));
            File::put($localPath, $content);
            return;
        }

        File::put($path, $content);
    }

    private function createSymlink(string $target, string $link): void
    {
        if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') return;
        
        if (!File::exists($link)) {
            Process::run("sudo ln -s {$target} {$link}");
        }
    }

    private function removeSymlink(string $link): void
    {
        if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') return;

        if (File::exists($link)) {
            Process::run("sudo rm {$link}");
        }
    }

    private function testNginxConfig(): bool
    {
        if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') return true;

        $result = Process::run("sudo nginx -t");
        return $result->successful();
    }

    private function reloadNginx(): void
    {
        if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') return;

        Process::run("sudo systemctl reload nginx");
    }
}

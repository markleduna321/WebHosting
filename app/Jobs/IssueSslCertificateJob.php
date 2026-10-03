<?php

namespace App\Jobs;

use App\Models\Domain;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Process;

class IssueSslCertificateJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(public Domain $domain)
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $user = $this->domain->website->user;
        
        if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
            Log::info("Skipping actual Certbot run on Windows for {$this->domain->domain_name}");
            $this->domain->update(['ssl_status' => 'active']);
            return;
        }

        // Run Certbot
        $command = "sudo certbot --nginx -d {$this->domain->domain_name} -n --agree-tos -m {$user->email}";
        
        $result = Process::run($command);

        if ($result->successful()) {
            $this->domain->update(['ssl_status' => 'active']);
            Log::info("Successfully issued SSL for {$this->domain->domain_name}");
        } else {
            $this->domain->update(['ssl_status' => 'failed']);
            Log::error("Certbot failed for {$this->domain->domain_name}: " . $result->errorOutput());
        }
    }
}

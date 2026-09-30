<?php

namespace App\Console\Commands;

use App\Models\Domain;
use App\Services\ServerConfigurationService;
use App\Jobs\IssueSslCertificateJob;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class VerifyPendingDomains extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'domains:verify';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Verify DNS records for pending custom domains';

    /**
     * Execute the console command.
     */
    public function handle(ServerConfigurationService $serverService)
    {
        $serverIp = env('SERVER_IP', '127.0.0.1');
        $domains = Domain::where('verification_status', 'pending')->get();

        foreach ($domains as $domain) {
            $this->info("Checking domain: {$domain->domain_name}");
            
            $records = @dns_get_record($domain->domain_name, DNS_A);
            $pointsToUs = false;

            if ($records) {
                foreach ($records as $record) {
                    if (isset($record['ip']) && $record['ip'] === $serverIp) {
                        $pointsToUs = true;
                        break;
                    }
                }
            }

            // In local development, you might want to force verification for testing.
            if (env('APP_ENV') === 'local') {
                $pointsToUs = true; 
            }

            if ($pointsToUs) {
                $this->info("Verified: {$domain->domain_name}");
                
                // 1. Update Status
                $domain->update(['verification_status' => 'verified']);

                // 2. Configure Nginx safely
                $configured = $serverService->applyDomainConfig($domain);

                // 3. Dispatch SSL Job if configured successfully
                if ($configured) {
                    IssueSslCertificateJob::dispatch($domain);
                } else {
                    Log::error("Domain verified but Nginx config failed for {$domain->domain_name}");
                }
            } else {
                $this->warn("Not yet resolving: {$domain->domain_name}");
            }
        }
    }
}

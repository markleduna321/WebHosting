<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Domain;
use App\Http\Requests\StoreDomainRequest;
use App\Http\Resources\DomainResource;
use Illuminate\Http\Request;

class DomainController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $domains = $request->user()
            ->websites()
            ->with('domains')
            ->get()
            ->pluck('domains')
            ->flatten();

        return DomainResource::collection($domains);
    }

    public function store(StoreDomainRequest $request)
    {
        $website = $request->user()->websites()->where('uuid', $request->website_uuid)->firstOrFail();

        $domain = $website->domains()->create([
            'domain_name' => $request->domain_name,
            'is_primary' => false,
            'ssl_status' => 'pending',
            'verification_status' => 'pending',
        ]);

        return new DomainResource($domain);
    }

    public function destroy(Request $request, Domain $domain)
    {
        // Ensure the user owns the domain
        if ($domain->website->user_id !== $request->user()->id) {
            abort(403);
        }

        $domain->delete();

        return response()->noContent();
    }

    public function verify(Request $request, Domain $domain, \App\Services\ServerConfigurationService $serverService)
    {
        if ($domain->website->user_id !== $request->user()->id) {
            abort(403);
        }

        if ($domain->verification_status === 'verified') {
            return response()->json(['message' => 'Already verified']);
        }

        $serverIp = env('SERVER_IP', '127.0.0.1');
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

        if (env('APP_ENV') === 'local') {
            $pointsToUs = true;
        }

        if ($pointsToUs) {
            $domain->update(['verification_status' => 'verified']);
            $configured = $serverService->applyDomainConfig($domain);

            if ($configured) {
                \App\Jobs\IssueSslCertificateJob::dispatch($domain);
            } else {
                \Illuminate\Support\Facades\Log::error("Domain verified but Nginx config failed for {$domain->domain_name}");
            }

            return new DomainResource($domain);
        }

        return response()->json([
            'message' => 'Domain not yet pointing to our server. Please wait for propagation.'
        ], 422);
    }
}

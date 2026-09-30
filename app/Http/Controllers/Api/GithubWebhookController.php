<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Jobs\CloneRepositoryJob;
use App\Models\Website;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class GithubWebhookController extends Controller
{
    public function handle(Request $request)
    {
        // 1. Verify GitHub Signature (if secret is configured)
        $secret = env('GITHUB_WEBHOOK_SECRET');
        if ($secret) {
            $signature = $request->header('X-Hub-Signature-256');
            if (!$signature) {
                return response()->json(['error' => 'Missing signature'], 401);
            }
            $hash = 'sha256=' . hash_hmac('sha256', $request->getContent(), $secret);
            if (!hash_equals($hash, $signature)) {
                return response()->json(['error' => 'Invalid signature'], 401);
            }
        }

        // 2. Only process push events
        $event = $request->header('X-GitHub-Event');
        if ($event === 'ping') {
            return response()->json(['message' => 'Ping received successfully'], 200);
        }
        if ($event !== 'push') {
            return response()->json(['message' => 'Ignored event type'], 200);
        }

        // 3. Extract repository and branch info
        $repoFullName = $request->input('repository.full_name');
        $ref = $request->input('ref'); // format: refs/heads/main
        
        if (!$repoFullName || !$ref) {
            return response()->json(['error' => 'Invalid payload format'], 400);
        }

        $branch = str_replace('refs/heads/', '', $ref);

        // 4. Find websites listening to this repo/branch with auto_pull_enabled
        $websites = Website::where('repository_full_name', $repoFullName)
            ->where('repository_default_branch', $branch)
            ->where('auto_pull_enabled', true)
            ->with('user.activeSubscription.plan')
            ->get();

        $dispatchedCount = 0;

        foreach ($websites as $website) {
            // 5. Verify the user is still on the Pro plan
            $planSlug = $website->user->activeSubscription?->plan?->slug ?? 'student';
            
            if ($planSlug === 'pro') {
                $website->update([
                    'status' => Website::STATUS_QUEUED,
                    'failure_reason' => null,
                ]);
                CloneRepositoryJob::dispatch($website);
                $dispatchedCount++;
            } else {
                // If they downgraded, automatically disable the feature
                $website->update(['auto_pull_enabled' => false]);
                Log::info("Auto Pull disabled for website {$website->uuid} because user is no longer on Pro plan.");
            }
        }

        return response()->json([
            'message' => 'Processed',
            'dispatched_deployments' => $dispatchedCount
        ]);
    }
}

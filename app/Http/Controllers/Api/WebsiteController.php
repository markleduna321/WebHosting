<?php

namespace App\Http\Controllers\Api;

use App\Exceptions\GithubAuthorizationException;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreWebsiteRequest;
use App\Http\Resources\WebsiteResource;
use App\Jobs\CloneRepositoryJob;
use App\Models\Website;
use App\Services\WebsiteService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Process;

class WebsiteController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Website::class);

        // Scoped to the relation, so ownership is never inferred from client input.
        $websites = $request->user()
            ->websites()
            ->latest()
            ->get();

        return WebsiteResource::collection($websites)->response();
    }

    public function store(StoreWebsiteRequest $request, WebsiteService $websites): JsonResponse
    {
        try {
            $website = $websites->createForUser($request->user(), $request->validated());
        } catch (GithubAuthorizationException) {
            return response()->json([
                'message' => 'Your GitHub authorization has expired. Please reconnect.',
                'code' => 'github_reauth_required',
            ], 403);
        }

        return (new WebsiteResource($website))->response()->setStatusCode(201);
    }

    public function redeploy(Website $website): JsonResponse
    {
        $this->authorize('update', $website);

        $website->update([
            'status' => Website::STATUS_QUEUED,
            'failure_reason' => null,
        ]);

        CloneRepositoryJob::dispatch($website);

        return (new WebsiteResource($website->fresh()))->response();
    }

    public function destroy(Website $website): JsonResponse
    {
        $this->authorize('delete', $website);

        // Model event removes the cloned files from disk.
        $website->delete();

        return response()->json(null, 204);
    }

    public function cli(Request $request, Website $website): JsonResponse
    {
        $this->authorize('update', $website);

        $request->validate([
            'command' => 'required|string|max:255',
        ]);

        $command = $request->command;

        // Prevent command injection characters
        if (preg_match('/[&|;`$><\n\r]/', $command)) {
            return response()->json(['output' => "Error: Invalid characters in command.\n"], 403);
        }

        // Whitelist prefixes
        $allowedPrefixes = ['php artisan', 'composer', 'npm', 'npx', 'node'];
        $isAllowed = false;
        foreach ($allowedPrefixes as $prefix) {
            if (str_starts_with($command, $prefix)) {
                $isAllowed = true;
                break;
            }
        }

        if (!$isAllowed) {
            return response()->json(['output' => "Error: Command must start with one of: " . implode(', ', $allowedPrefixes) . "\n"], 403);
        }

        if (!$website->storage_path || !file_exists($website->storage_path)) {
            return response()->json(['output' => "Error: Website storage path not found. Please deploy the website first.\n"], 404);
        }

        $envPath = ['PATH' => '/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin'];

        // Run the command
        $process = Process::path($website->storage_path)
            ->env($envPath)
            ->timeout(60)
            ->run($command);

        return response()->json([
            'output' => $process->output() . $process->errorOutput(),
            'successful' => $process->successful(),
            'exit_code' => $process->exitCode()
        ]);
    }
}

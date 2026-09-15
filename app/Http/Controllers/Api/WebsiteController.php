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
}

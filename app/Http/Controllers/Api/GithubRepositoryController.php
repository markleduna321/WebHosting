<?php

namespace App\Http\Controllers\Api;

use App\Exceptions\GithubAuthorizationException;
use App\Http\Controllers\Controller;
use App\Http\Resources\GithubRepositoryResource;
use App\Services\GithubService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GithubRepositoryController extends Controller
{
    public function index(Request $request, GithubService $github): JsonResponse
    {
        // Resolved from the session user only — never from a client-supplied id.
        $connection = $request->user()->githubConnection;

        if (! $connection) {
            return response()->json([
                'message' => 'GitHub is not connected.',
                'code' => 'github_not_connected',
            ], 403);
        }

        $this->authorize('view', $connection);

        try {
            $repositories = $github->listRepositories($connection);
        } catch (GithubAuthorizationException) {
            return response()->json([
                'message' => 'Your GitHub authorization has expired. Please reconnect.',
                'code' => 'github_reauth_required',
            ], 403);
        }

        return GithubRepositoryResource::collection($repositories)->response();
    }
}

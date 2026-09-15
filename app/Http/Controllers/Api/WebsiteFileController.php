<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\WebsiteFileResource;
use App\Models\Website;
use App\Services\WebsiteFileService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use RuntimeException;

class WebsiteFileController extends Controller
{
    public function index(Request $request, Website $website, WebsiteFileService $files): JsonResponse
    {
        $this->authorize('view', $website);

        $validated = $request->validate([
            'path' => ['nullable', 'string', 'max:1024'],
        ]);

        if ($website->status !== Website::STATUS_LIVE) {
            return response()->json([
                'message' => 'This site has not finished deploying yet.',
                'code' => 'website_not_ready',
            ], 409);
        }

        try {
            $entries = $files->listDirectory($website, $validated['path'] ?? '');
        } catch (RuntimeException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }

        return WebsiteFileResource::collection($entries)->response();
    }
}

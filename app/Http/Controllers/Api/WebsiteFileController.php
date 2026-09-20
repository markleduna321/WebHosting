<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreWebsiteFileRequest;
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

    public function show(Request $request, Website $website, WebsiteFileService $files): JsonResponse
    {
        $this->authorize('view', $website);

        $validated = $request->validate([
            'path' => ['required', 'string', 'max:1024'],
        ]);

        if ($website->status !== Website::STATUS_LIVE) {
            return response()->json([
                'message' => 'This site has not finished deploying yet.',
                'code' => 'website_not_ready',
            ], 409);
        }

        try {
            $content = $files->readFile($website, $validated['path']);
        } catch (RuntimeException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }

        return response()->json(['content' => $content]);
    }

    public function update(Request $request, Website $website, WebsiteFileService $files): JsonResponse
    {
        $this->authorize('update', $website);

        $validated = $request->validate([
            'path'    => ['required', 'string', 'max:1024'],
            'content' => ['required', 'string', 'max:' . config('hosting.files.max_upload_bytes')],
        ]);

        if ($website->status !== Website::STATUS_LIVE) {
            return response()->json([
                'message' => 'This site has not finished deploying yet.',
                'code'    => 'website_not_ready',
            ], 409);
        }

        try {
            $files->updateFile($website, $validated['path'], $validated['content']);
        } catch (RuntimeException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }

        return response()->json(['message' => 'File saved.']);
    }

    public function store(StoreWebsiteFileRequest $request, Website $website, WebsiteFileService $files): JsonResponse
    {
        $validated = $request->validated();

        if ($website->status !== Website::STATUS_LIVE) {
            return response()->json([
                'message' => 'This site has not finished deploying yet.',
                'code' => 'website_not_ready',
            ], 409);
        }

        $content = $request->file('upload')
            ? file_get_contents($request->file('upload')->getRealPath())
            : ($validated['content'] ?? '');

        try {
            $entry = $files->createFile($website, $validated['path'] ?? '', $validated['name'], $content);
        } catch (RuntimeException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }

        return (new WebsiteFileResource($entry))->response()->setStatusCode(201);
    }
}

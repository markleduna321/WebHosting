<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Addon\StoreAddonRequest;
use App\Http\Requests\Addon\UpdateAddonRequest;
use App\Http\Resources\AdminAddonResource;
use App\Models\Addon;
use App\Services\AddonService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class AdminAddonController extends Controller
{
    public function __construct(protected AddonService $addonService)
    {
    }

    public function index(Request $request): AnonymousResourceCollection
    {
        $this->authorize('viewAny', Addon::class);

        $addons = Addon::query()
            ->when($request->query('search'), fn ($query, $search) => $query->where('name', 'like', "%{$search}%"))
            ->orderBy('name')
            ->paginate(10);

        return AdminAddonResource::collection($addons);
    }

    public function store(StoreAddonRequest $request): JsonResponse
    {
        $this->authorize('create', Addon::class);

        $addon = $this->addonService->create($request->validated());

        return (new AdminAddonResource($addon))->response()->setStatusCode(201);
    }

    public function show(Addon $addon): AdminAddonResource
    {
        $this->authorize('view', $addon);

        return new AdminAddonResource($addon);
    }

    public function update(UpdateAddonRequest $request, Addon $addon): AdminAddonResource
    {
        $this->authorize('update', $addon);

        $updated = $this->addonService->update($addon, $request->validated());

        return new AdminAddonResource($updated);
    }

    public function destroy(Addon $addon): JsonResponse
    {
        $this->authorize('delete', $addon);

        $this->addonService->delete($addon);

        return response()->json(null, 204);
    }
}

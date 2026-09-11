<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Permission\StorePermissionRequest;
use App\Http\Requests\Permission\UpdatePermissionRequest;
use App\Http\Resources\PermissionResource;
use App\Services\PermissionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Spatie\Permission\Models\Permission;

class PermissionController extends Controller
{
    public function __construct(protected PermissionService $permissionService)
    {
    }

    public function index(Request $request): AnonymousResourceCollection
    {
        $this->authorize('viewAny', Permission::class);

        $perPage = min(max((int) $request->query('per_page', 10), 1), 100);

        $permissions = Permission::query()
            ->withCount('roles')
            ->when($request->query('search'), fn ($query, $search) => $query->where('name', 'like', "%{$search}%"))
            ->orderBy('name')
            ->paginate($perPage);

        return PermissionResource::collection($permissions);
    }

    public function store(StorePermissionRequest $request): JsonResponse
    {
        $this->authorize('create', Permission::class);

        $permission = $this->permissionService->create($request->validated());

        return (new PermissionResource($permission))->response()->setStatusCode(201);
    }

    public function show(Permission $permission): PermissionResource
    {
        $this->authorize('view', $permission);

        return new PermissionResource($permission->loadCount('roles'));
    }

    public function update(UpdatePermissionRequest $request, Permission $permission): PermissionResource
    {
        $this->authorize('update', $permission);

        return new PermissionResource($this->permissionService->update($permission, $request->validated()));
    }

    public function destroy(Permission $permission): JsonResponse
    {
        $this->authorize('delete', $permission);

        $this->permissionService->delete($permission);

        return response()->json(null, 204);
    }
}

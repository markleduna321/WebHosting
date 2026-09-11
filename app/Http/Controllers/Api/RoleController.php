<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Role\StoreRoleRequest;
use App\Http\Requests\Role\UpdateRoleRequest;
use App\Http\Resources\RoleResource;
use App\Models\Role;
use App\Services\RoleService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class RoleController extends Controller
{
    public function __construct(protected RoleService $roleService)
    {
    }

    public function index(Request $request): AnonymousResourceCollection
    {
        $this->authorize('viewAny', Role::class);

        $roles = Role::query()
            ->with('permissions')
            ->withCount('users')
            ->when($request->query('search'), fn ($query, $search) => $query->where('name', 'like', "%{$search}%"))
            ->orderBy('name')
            ->paginate(10);

        return RoleResource::collection($roles);
    }

    public function store(StoreRoleRequest $request): JsonResponse
    {
        $this->authorize('create', Role::class);

        $role = $this->roleService->create($request->validated());

        return (new RoleResource($role))->response()->setStatusCode(201);
    }

    public function show(Role $role): RoleResource
    {
        $this->authorize('view', $role);

        return new RoleResource($role->load('permissions')->loadCount('users'));
    }

    public function update(UpdateRoleRequest $request, Role $role): RoleResource
    {
        $this->authorize('update', $role);

        return new RoleResource($this->roleService->update($role, $request->validated()));
    }

    public function destroy(Role $role): JsonResponse
    {
        $this->authorize('delete', $role);

        $this->roleService->delete($role);

        return response()->json(null, 204);
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Plan\StorePlanRequest;
use App\Http\Requests\Plan\UpdatePlanRequest;
use App\Http\Resources\AdminPlanResource;
use App\Models\Plan;
use App\Services\PlanService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class AdminPlanController extends Controller
{
    public function __construct(protected PlanService $planService)
    {
    }

    public function index(Request $request): AnonymousResourceCollection
    {
        $this->authorize('viewAny', Plan::class);

        $plans = Plan::query()
            ->withCount('subscriptions')
            ->when($request->query('search'), fn ($query, $search) => $query->where('name', 'like', "%{$search}%"))
            ->orderBy('sort_order')
            ->paginate(10);

        return AdminPlanResource::collection($plans);
    }

    public function store(StorePlanRequest $request): JsonResponse
    {
        $this->authorize('create', Plan::class);

        $plan = $this->planService->create($request->validated());

        return (new AdminPlanResource($plan->loadCount('subscriptions')))->response()->setStatusCode(201);
    }

    public function show(Plan $plan): AdminPlanResource
    {
        $this->authorize('view', $plan);

        return new AdminPlanResource($plan->loadCount('subscriptions'));
    }

    public function update(UpdatePlanRequest $request, Plan $plan): AdminPlanResource
    {
        $this->authorize('update', $plan);

        $updated = $this->planService->update($plan, $request->validated());

        return new AdminPlanResource($updated->loadCount('subscriptions'));
    }

    public function destroy(Plan $plan): JsonResponse
    {
        $this->authorize('delete', $plan);

        $this->planService->delete($plan);

        return response()->json(null, 204);
    }
}

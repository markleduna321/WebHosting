<?php

namespace App\Http\Controllers;

use App\Http\Resources\PlanResource;
use App\Models\Plan;
use Inertia\Inertia;
use Inertia\Response;

class HostingPlanController extends Controller
{
    public function index(): Response
    {
        $plans = Plan::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        return Inertia::render('hosting-plan/page', [
            // resolve() strips the "data" wrapper so the prop is a plain array.
            'plans' => PlanResource::collection($plans)->resolve(),
        ]);
    }
}

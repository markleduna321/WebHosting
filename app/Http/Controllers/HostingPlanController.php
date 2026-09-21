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

        $addons = \App\Models\Addon::query()
            ->where('is_active', true)
            ->get();

        return Inertia::render('hosting-plan/page', [
            // resolve() strips the "data" wrapper so the prop is a plain array.
            'plans' => PlanResource::collection($plans)->resolve(),
            'addons' => \App\Http\Resources\AddonResource::collection($addons)->resolve(),
        ]);
    }
}

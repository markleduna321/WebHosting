<?php

namespace App\Http\Controllers;

use App\Http\Resources\AddonResource;
use App\Http\Resources\PlanResource;
use App\Models\Addon;
use App\Models\Plan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HostingPlanController extends Controller
{
    public function index(Request $request): Response
    {
        // Admins manage every plan (including inactive ones) through the admin plans API instead.
        if ($request->user()?->hasRole('admin')) {
            return Inertia::render('hosting-plan/page');
        }

        $plans = Plan::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        $addons = Addon::query()
            ->where('is_active', true)
            ->get();

        return Inertia::render('hosting-plan/page', [
            // resolve() strips the "data" wrapper so the prop is a plain array.
            'plans' => PlanResource::collection($plans)->resolve(),
            'addons' => AddonResource::collection($addons)->resolve(),
        ]);
    }
}

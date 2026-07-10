<?php

namespace App\Http\Controllers;

use App\Http\Resources\ClassroomResource;
use App\Http\Resources\MaterialResource;
use App\Http\Resources\SessionResource;
use App\Models\Classroom;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PublicClassroomController extends Controller
{
    public function index(Request $request)
    {
        $classrooms = Classroom::query()
            ->with('owner')
            ->withCount('materials')
            ->when(
                $request->filled('search'),
                function ($query) use ($request) {
                    $search = $request->string('search')->value();

                    $query->where(function ($innerQuery) use ($search) {
                        $innerQuery
                            ->where('name', 'like', "%{$search}%")
                            ->orWhere('description', 'like', "%{$search}%")
                            ->orWhere('schedule', 'like', "%{$search}%");
                    });
                }
            )
            ->latest()
            ->paginate(9)
            ->withQueryString();

        return ClassroomResource::collection($classrooms);
    }

    public function show(Classroom $classroom): JsonResponse
    {
        $classroom->load('owner', 'activeSession')->loadCount('materials');

        return response()->json(new ClassroomResource($classroom));
    }

    public function materials(Classroom $classroom): JsonResponse
    {
        $materials = $classroom->materials()->latest()->get();

        return response()->json([
            'data' => MaterialResource::collection($materials),
        ]);
    }

    public function activeSession(Classroom $classroom): JsonResponse
    {
        $session = $classroom->activeSession()->first();

        if (! $session) {
            return response()->json([
                'message' => 'No active session found for this classroom.',
            ], 404);
        }

        return response()->json(new SessionResource($session));
    }
}
<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreClassroomRequest;
use App\Http\Requests\UpdateClassroomRequest;
use App\Http\Resources\ClassroomResource;
use App\Models\Classroom;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ClassroomController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('viewAny', Classroom::class);

        $classrooms = Classroom::query()
            ->where('owner_id', $request->user()->id)
            ->with('owner', 'materials', 'activeSession')
            ->withCount('materials')
            ->latest()
            ->paginate(10);

        return ClassroomResource::collection($classrooms);
    }

    public function store(StoreClassroomRequest $request): JsonResponse
    {
        $this->authorize('create', Classroom::class);

        $classroom = Classroom::create([
            ...$request->validated(),
            'owner_id' => $request->user()->id,
        ]);

        $classroom->load('owner', 'materials', 'activeSession')->loadCount('materials');

        return response()->json(new ClassroomResource($classroom), 201);
    }

    public function update(UpdateClassroomRequest $request, Classroom $classroom): JsonResponse
    {
        $this->authorize('update', $classroom);

        $classroom->update($request->validated());
        $classroom->load('owner', 'materials', 'activeSession')->loadCount('materials');

        return response()->json(new ClassroomResource($classroom));
    }

    public function destroy(Classroom $classroom): JsonResponse
    {
        $this->authorize('delete', $classroom);

        DB::transaction(function () use ($classroom) {
            $classroom->load('materials');

            foreach ($classroom->materials as $material) {
                Storage::disk('public')->delete("materials/{$classroom->id}/{$material->filename}");
            }

            $classroom->delete();
        });

        return response()->json(null, 204);
    }
}
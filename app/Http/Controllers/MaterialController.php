<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMaterialRequest;
use App\Http\Resources\MaterialResource;
use App\Models\Classroom;
use App\Models\Material;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class MaterialController extends Controller
{
    public function store(StoreMaterialRequest $request, Classroom $classroom): JsonResponse
    {
        $this->authorize('update', $classroom);

        $file = $request->file('file');
        $extension = $file->getClientOriginalExtension() ?: $file->extension();
        $filename = $extension ? "{$request->string('id')->value()}.{$extension}" : $request->string('id')->value();

        Storage::disk('public')->putFileAs("materials/{$classroom->id}", $file, $filename);

        $material = $classroom->materials()->create([
            'id' => $request->string('id')->value(),
            'original_name' => $request->string('original_name')->value(),
            'filename' => $filename,
            'mime_type' => $request->string('mime_type')->value(),
            'size_bytes' => $request->integer('size_bytes'),
            'file_url' => rtrim((string) config('filesystems.disks.public.url'), '/')."/materials/{$classroom->id}/{$filename}",
        ]);

        return response()->json(new MaterialResource($material), 201);
    }

    public function destroy(Classroom $classroom, Material $material): JsonResponse
    {
        $this->authorize('update', $classroom);

        abort_if($material->classroom_id !== $classroom->id, 404);

        Storage::disk('public')->delete("materials/{$classroom->id}/{$material->filename}");
        $material->delete();

        return response()->json(null, 204);
    }
}
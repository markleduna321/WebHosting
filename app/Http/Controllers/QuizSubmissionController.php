<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreQuizSubmissionRequest;
use App\Http\Resources\QuizSubmissionResource;
use App\Models\Session;
use App\Models\QuizSubmission;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

class QuizSubmissionController extends Controller
{
    public function store(StoreQuizSubmissionRequest $request, Session $session): JsonResponse
    {
        if ($session->status !== 'active') {
            return response()->json([
                'message' => 'Only active sessions can accept quiz submissions.',
            ], 409);
        }

        $validated = $request->validated();
        $total = $validated['total'] ?? count($validated['answers']);
        $score = $validated['score'] ?? 0;

        $submission = QuizSubmission::create([
            'id' => (string) Str::uuid(),
            'session_id' => $session->id,
            'student_id' => $validated['student_id'],
            'student_name' => $validated['student_name'],
            'quiz_id' => $validated['quiz_id'],
            'quiz_title' => $validated['quiz_title'],
            'score' => $score,
            'total' => $total,
            'answers_json' => $validated['answers'],
            'submitted_at' => Carbon::now(),
        ]);

        return response()->json([
            'status' => 'received',
            'score' => $submission->score,
            'total' => $submission->total,
            'submission' => new QuizSubmissionResource($submission),
        ]);
    }

    public function results(Session $session): JsonResponse
    {
        $this->authorize('update', $session->classroom);

        return response()->json([
            'data' => QuizSubmissionResource::collection(
                $session->quizSubmissions()->latest('submitted_at')->get()
            ),
        ]);
    }
}
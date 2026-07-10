<?php

namespace App\Http\Controllers;

use App\Events\SessionEvent;
use App\Http\Requests\StoreRaisedHandRequest;
use App\Models\HandQueue;
use App\Models\Session;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Carbon;

class HandController extends Controller
{
    public function raise(StoreRaisedHandRequest $request, Session $session): JsonResponse
    {
        if ($session->status !== 'active') {
            return response()->json([
                'message' => 'Only active sessions can accept raised hands.',
            ], 409);
        }

        HandQueue::updateOrCreate(
            [
                'session_id' => $session->id,
                'student_id' => $request->string('student_id')->value(),
            ],
            [
                'student_name' => $request->string('student_name')->value() ?: ($request->user()?->name ?? 'Student'),
                'raised_at' => Carbon::now(),
                'answered_at' => null,
            ]
        );

        event(new SessionEvent($session->channel, 'HAND_UPDATE', [
            'queue' => $this->queuePayload($session),
        ]));

        return response()->json(null, 204);
    }

    public function lower(StoreRaisedHandRequest $request, Session $session): JsonResponse
    {
        if ($session->status !== 'active') {
            return response()->json([
                'message' => 'Only active sessions can update raised hands.',
            ], 409);
        }

        $session->handQueue()
            ->where('student_id', $request->string('student_id')->value())
            ->delete();

        event(new SessionEvent($session->channel, 'HAND_UPDATE', [
            'queue' => $this->queuePayload($session),
        ]));

        return response()->json(null, 204);
    }

    public function call(StoreRaisedHandRequest $request, Session $session): JsonResponse
    {
        $this->authorize('update', $session->classroom);

        if ($session->status !== 'active') {
            return response()->json([
                'message' => 'Only active sessions can call on participants.',
            ], 409);
        }

        $entry = $session->handQueue()
            ->where('student_id', $request->string('student_id')->value())
            ->first();

        if ($entry) {
            $entry->update(['answered_at' => Carbon::now()]);
            $entry->delete();
        }

        event(new SessionEvent($session->channel, 'CALLED_ON', [
            'target' => $request->string('student_id')->value(),
        ]));

        event(new SessionEvent($session->channel, 'HAND_UPDATE', [
            'queue' => $this->queuePayload($session),
        ]));

        return response()->json(null, 204);
    }

    private function queuePayload(Session $session): array
    {
        return $session->handQueue()
            ->orderBy('raised_at')
            ->get()
            ->map(fn (HandQueue $entry) => [
                'id' => $entry->student_id,
                'name' => $entry->student_name,
            ])
            ->values()
            ->all();
    }
}
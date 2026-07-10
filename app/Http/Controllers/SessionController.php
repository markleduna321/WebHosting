<?php

namespace App\Http\Controllers;

use App\Events\SessionEvent;
use App\Http\Requests\BroadcastSessionEventRequest;
use App\Http\Requests\StoreSessionRequest;
use App\Http\Resources\SessionParticipantResource;
use App\Http\Resources\SessionResource;
use App\Models\Classroom;
use App\Models\Session;
use App\Models\SessionParticipant;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

class SessionController extends Controller
{
    public function store(StoreSessionRequest $request): JsonResponse
    {
        $classroom = Classroom::query()->findOrFail($request->string('classroom_id')->value());

        $this->authorize('update', $classroom);

        $existingSession = $classroom->activeSession()->first();

        if ($existingSession) {
            return response()->json([
                'message' => 'An active session already exists for this classroom.',
            ], 409);
        }

        $sessionId = (string) Str::uuid();
        $startedAt = Carbon::now();

        $session = Session::create([
            'id' => $sessionId,
            'classroom_id' => $classroom->id,
            'owner_id' => $request->user()->id,
            'channel' => "session.{$sessionId}",
            'ws_url' => $this->buildWsUrl(),
            'status' => 'active',
            'started_at' => $startedAt,
        ]);

        $session->loadCount('participants');

        return response()->json(new SessionResource($session), 201);
    }

    public function show(Session $session): JsonResponse
    {
        $this->authorize('update', $session->classroom);

        $session->loadCount('participants')->load('handQueue');

        return response()->json(new SessionResource($session));
    }

    public function end(Session $session): JsonResponse
    {
        $this->authorize('update', $session->classroom);

        if ($session->status === 'ended') {
            return response()->json(null, 204);
        }

        $session->update([
            'status' => 'ended',
            'ended_at' => Carbon::now(),
        ]);

        event(new SessionEvent($session->channel, 'PRESENTATION_ENDED', []));

        return response()->json(null, 204);
    }

    public function participants(Session $session): JsonResponse
    {
        $this->authorize('update', $session->classroom);

        return response()->json([
            'data' => SessionParticipantResource::collection(
                $session->participants()->orderBy('joined_at')->get()
            ),
        ]);
    }

    public function broadcast(BroadcastSessionEventRequest $request, Session $session): JsonResponse
    {
        $eventName = $request->string('event')->value();

        if ($eventName !== 'WEBRTC_JOIN') {
            $this->authorize('update', $session->classroom);
        }

        if ($session->status !== 'active') {
            return response()->json([
                'message' => 'Only active sessions can broadcast events.',
            ], 409);
        }

        if ($eventName === 'WEBRTC_JOIN' && $request->user()) {
            SessionParticipant::updateOrCreate(
                [
                    'session_id' => $session->id,
                    'student_id' => (string) $request->user()->id,
                ],
                [
                    'student_name' => $request->user()->name,
                    'joined_at' => Carbon::now(),
                ]
            );
        }

        event(new SessionEvent(
            $session->channel,
            $eventName,
            $request->input('data', [])
        ));

        return response()->json(null, 204);
    }

    private function buildWsUrl(): string
    {
        $httpScheme = (string) env('REVERB_SCHEME', 'http');
        $scheme = (string) env('VITE_REVERB_SCHEME', $httpScheme === 'https' ? 'wss' : 'ws');
        $host = (string) env('VITE_REVERB_HOST', env('REVERB_HOST', '127.0.0.1'));
        $port = (string) env('VITE_REVERB_PORT', env('REVERB_PORT', '8080'));

        return sprintf('%s://%s:%s', $scheme, $host, $port);
    }
}
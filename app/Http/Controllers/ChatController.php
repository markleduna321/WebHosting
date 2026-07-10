<?php

namespace App\Http\Controllers;

use App\Events\SessionEvent;
use App\Http\Requests\StoreChatMessageRequest;
use App\Http\Resources\ChatMessageResource;
use App\Models\ChatMessage;
use App\Models\Session;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Carbon;

class ChatController extends Controller
{
    public function index(Session $session): JsonResponse
    {
        $messages = $session->chatMessages()
            ->orderByDesc('sent_at')
            ->limit(100)
            ->get()
            ->sortBy('sent_at')
            ->values();

        return response()->json([
            'data' => ChatMessageResource::collection($messages),
        ]);
    }

    public function store(StoreChatMessageRequest $request, Session $session): JsonResponse
    {
        if ($session->status !== 'active') {
            return response()->json([
                'message' => 'Only active sessions can accept chat messages.',
            ], 409);
        }

        $message = ChatMessage::create([
            'session_id' => $session->id,
            'sender_id' => $request->string('sender_id')->value(),
            'sender_name' => $request->string('sender_name')->value(),
            'is_teacher' => $request->boolean('is_teacher'),
            'body' => $request->string('body')->value(),
            'sent_at' => Carbon::now(),
        ]);

        event(new SessionEvent($session->channel, 'CHAT_MESSAGE', [
            'sender_id' => $message->sender_id,
            'sender_name' => $message->sender_name,
            'is_teacher' => $message->is_teacher,
            'body' => $message->body,
            'sent_at' => $message->sent_at?->toISOString(),
        ]));

        return response()->json(new ChatMessageResource($message), 201);
    }
}
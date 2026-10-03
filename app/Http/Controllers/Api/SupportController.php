<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Support\CreateSupportConversationRequest;
use App\Http\Requests\Support\HandoffSupportRequest;
use App\Http\Requests\Support\StoreSupportMessageRequest;
use App\Http\Resources\SupportConversationResource;
use App\Http\Resources\SupportMessageResource;
use App\Jobs\NotifySupportRequestJob;
use App\Models\SupportConversation;
use App\Models\SupportMessage;
use App\Services\SupportAccessService;
use App\Services\SupportChatService;
use App\Services\SupportScopeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Throwable;

class SupportController extends Controller
{
    private const OUT_OF_SCOPE_REPLY = "I can only help with Caleho Host products and your Caleho account. I can’t write, debug, or fix code. Ask me about plans, billing, deployments, databases, domains, files, or account security.";

    public function __construct(
        private readonly SupportAccessService $access,
        private readonly SupportScopeService $scope,
        private readonly SupportChatService $chat,
    ) {}

    public function store(CreateSupportConversationRequest $request): JsonResponse
    {
        [$conversation, $guestToken] = $this->access->create($request->user());
        $response = (new SupportConversationResource($conversation))
            ->response()
            ->setStatusCode(201)
            ->header('Cache-Control', 'no-store');

        if ($guestToken !== null) {
            $response->headers->setCookie(cookie(
                SupportAccessService::GUEST_COOKIE,
                $guestToken,
                60 * 24 * 30,
                '/',
                null,
                (bool) (config('session.secure') ?? $request->isSecure()),
                true,
                false,
                'lax',
            ));
        }

        return $response;
    }

    public function show(Request $request, SupportConversation $conversation): SupportConversationResource
    {
        $this->access->authorize($request, $conversation);

        $conversation->setRelation(
            'messages',
            $conversation->messages()->orderBy('id')->limit(80)->get(),
        );

        return new SupportConversationResource($conversation);
    }

    public function message(StoreSupportMessageRequest $request, SupportConversation $conversation): JsonResponse
    {
        $this->access->authorize($request, $conversation);

        if ($conversation->status !== SupportConversation::STATUS_OPEN) {
            return response()->json(['message' => 'This conversation has been handed to support.'], 409);
        }

        $content = trim($request->validated('content'));
        $history = $conversation->messages()
            ->latest('id')
            ->limit(12)
            ->get(['role', 'content'])
            ->reverse()
            ->map(fn (SupportMessage $message) => [
                'role' => $message->role,
                'content' => $message->content,
            ])
            ->values()
            ->all();

        $scope = $this->scope->classify($content, $history);

        if ($scope === SupportScopeService::UNAVAILABLE) {
            return response()->json([
                'message' => 'Support is temporarily unavailable. Please try again or contact support.',
            ], 503);
        }

        if ($scope === SupportScopeService::OUT_OF_SCOPE) {
            return $this->storeExchange($conversation, $content, self::OUT_OF_SCOPE_REPLY, true);
        }

        try {
            $reply = $this->chat->reply([
                ...$history,
                ['role' => 'user', 'content' => $content],
            ], $request->user());
        } catch (Throwable) {
            return response()->json([
                'message' => 'Support is temporarily unavailable. Please try again or contact support.',
            ], 503);
        }

        return $this->storeExchange($conversation, $content, $reply, false);
    }

    public function handoff(HandoffSupportRequest $request, SupportConversation $conversation): JsonResponse
    {
        $this->access->authorize($request, $conversation);

        if (! config('services.support.team_email') || ! config('services.resend.key')) {
            return response()->json([
                'message' => 'Human support handoff is not configured yet. Please try again later.',
            ], 503);
        }

        if ($conversation->status === SupportConversation::STATUS_CLOSED) {
            return response()->json(['message' => 'This conversation is closed.'], 409);
        }

        $email = $request->user()?->email ?? $request->validated('email');
        $conversation->forceFill([
            'guest_email' => $conversation->user_id === null ? $email : null,
            'status' => SupportConversation::STATUS_HANDOFF_REQUESTED,
        ])->save();

        $queued = SupportConversation::whereKey($conversation->id)
            ->whereNull('handoff_queued_at')
            ->update(['handoff_queued_at' => now()]);

        if ($queued > 0) {
            try {
                NotifySupportRequestJob::dispatch($conversation->id);
            } catch (Throwable $e) {
                SupportConversation::whereKey($conversation->id)->update(['handoff_queued_at' => null]);
                report($e);

                return response()->json([
                    'message' => 'Your request was saved, but we could not notify the team yet. Please try again shortly.',
                ], 503);
            }
        }

        $conversation->setAttribute(
            'reference',
            Str::upper(Str::substr(str_replace('-', '', $conversation->uuid), 0, 10)),
        );

        return (new SupportConversationResource($conversation))
            ->response()
            ->setStatusCode(202);
    }

    private function storeExchange(
        SupportConversation $conversation,
        string $content,
        string $reply,
        bool $outOfScope,
    ): JsonResponse {
        $assistant = DB::transaction(function () use ($conversation, $content, $reply) {
            $conversation->messages()->create([
                'role' => SupportMessage::ROLE_USER,
                'content' => $content,
            ]);
            $assistant = $conversation->messages()->create([
                'role' => SupportMessage::ROLE_ASSISTANT,
                'content' => $reply,
            ]);
            $conversation->forceFill(['last_message_at' => now()])->save();

            return $assistant;
        });

        $assistant->setAttribute('conversation_status', $conversation->status);
        $assistant->setAttribute('scope_rejected', $outOfScope);

        return (new SupportMessageResource($assistant))->response();
    }
}

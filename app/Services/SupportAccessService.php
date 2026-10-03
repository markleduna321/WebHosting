<?php

namespace App\Services;

use App\Models\SupportConversation;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SupportAccessService
{
    public const GUEST_COOKIE = 'caleho_support_access';

    /**
     * @return array{0: SupportConversation, 1: string|null}
     */
    public function create(?User $user): array
    {
        $token = $user ? null : Str::random(64);
        $conversation = SupportConversation::create([
            'user_id' => $user?->id,
            'guest_token_hash' => $token ? hash('sha256', $token) : null,
            'status' => SupportConversation::STATUS_OPEN,
        ]);

        return [$conversation, $token];
    }

    public function authorize(Request $request, SupportConversation $conversation): void
    {
        if ($conversation->user_id !== null) {
            abort_unless($request->user()?->id === $conversation->user_id, 404);

            return;
        }

        $token = $request->cookie(self::GUEST_COOKIE);
        abort_unless(
            is_string($token)
                && $conversation->guest_token_hash !== null
                && hash_equals($conversation->guest_token_hash, hash('sha256', $token)),
            404,
        );
    }
}

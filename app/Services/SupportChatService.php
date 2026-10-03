<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use RuntimeException;

class SupportChatService
{
    public function __construct(private readonly SupportKnowledgeService $knowledge) {}

    /**
     * @param  array<int, array{role: string, content: string}>  $history
     */
    public function reply(array $history, ?User $user): string
    {
        $key = (string) config('services.openai.key');

        if ($key === '') {
            throw new RuntimeException('AI support is not configured.');
        }

        $response = Http::withToken($key)
            ->acceptJson()
            ->asJson()
            ->timeout(25)
            ->post('https://api.openai.com/v1/chat/completions', [
                'model' => config('services.openai.model', 'gpt-4o-mini'),
                'messages' => [
                    ['role' => 'system', 'content' => $this->knowledge->systemPrompt($user)],
                    ...array_slice($history, -12),
                ],
                'temperature' => 0.2,
                'max_tokens' => 450,
            ]);

        if (! $response->successful()) {
            Log::warning('Support AI request failed.', ['status' => $response->status()]);

            throw new RuntimeException('AI support is temporarily unavailable.');
        }

        $reply = $response->json('choices.0.message.content');

        if (! is_string($reply) || trim($reply) === '') {
            throw new RuntimeException('AI support returned an empty response.');
        }

        return trim($reply);
    }
}

<?php

namespace App\Jobs;

use App\Models\SupportConversation;
use App\Services\SupportHandoffMailer;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Throwable;

class NotifySupportRequestJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    /** @var array<int, int> */
    public array $backoff = [60, 300, 900];

    public function __construct(public readonly int $conversationId) {}

    public function handle(SupportHandoffMailer $mailer): void
    {
        $conversation = SupportConversation::with('user')->find($this->conversationId);

        if (! $conversation || $conversation->status !== SupportConversation::STATUS_HANDOFF_REQUESTED) {
            return;
        }

        $conversation->setRelation(
            'messages',
            $conversation->messages()->latest('id')->limit(80)->get()->reverse()->values(),
        );

        if (! $conversation->handoff_notified_at) {
            $mailer->send($mailer->teamPayload($conversation));
            $conversation->forceFill(['handoff_notified_at' => now()])->save();
        }

        $email = $conversation->user?->email ?? $conversation->guest_email;
        if ($email && ! $conversation->customer_notified_at) {
            $mailer->send($mailer->customerPayload($conversation));
            $conversation->forceFill(['customer_notified_at' => now()])->save();
        }

        $conversation->forceFill(['handoff_queued_at' => null])->save();
    }

    public function failed(Throwable $exception): void
    {
        SupportConversation::whereKey($this->conversationId)->update(['handoff_queued_at' => null]);

        Log::error('Support handoff notification failed after retries.', [
            'conversation_id' => $this->conversationId,
            'exception' => $exception::class,
        ]);
    }
}

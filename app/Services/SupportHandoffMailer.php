<?php

namespace App\Services;

use App\Models\SupportConversation;
use Illuminate\Support\Facades\Log;
use RuntimeException;

class SupportHandoffMailer
{
    /** @return array<string, mixed> */
    public function teamPayload(SupportConversation $conversation): array
    {
        $teamEmail = config('services.support.team_email');
        $key = config('services.resend.key');
        $from = config('services.resend.from') ?: config('mail.from.address');

        if (! $teamEmail || ! $key || ! $from) {
            throw new RuntimeException('Support email is not configured.');
        }

        $replyTo = $conversation->user?->email ?? $conversation->guest_email;

        return [
            'from' => $this->fromAddress($from),
            'to' => [$teamEmail],
            ...($replyTo ? ['reply_to' => $replyTo] : []),
            'subject' => 'Caleho support request '.$this->reference($conversation),
            'html' => view('emails.support-request', [
                'conversation' => $conversation,
                'reference' => $this->reference($conversation),
                'messages' => $conversation->messages,
            ])->render(),
        ];
    }

    /** @return array<string, mixed> */
    public function customerPayload(SupportConversation $conversation): array
    {
        $email = $conversation->user?->email ?? $conversation->guest_email;
        $key = config('services.resend.key');
        $from = config('services.resend.from') ?: config('mail.from.address');

        if (! $email || ! $key || ! $from) {
            throw new RuntimeException('Support acknowledgement email is not configured.');
        }

        return [
            'from' => $this->fromAddress($from),
            'to' => [$email],
            'subject' => 'We received your Caleho support request',
            'html' => view('emails.support-request-received', [
                'reference' => $this->reference($conversation),
                'name' => $conversation->user?->name,
            ])->render(),
        ];
    }

    public function send(array $payload): void
    {
        \Resend::client(config('services.resend.key'))->emails->send($payload);
    }

    public function reference(SupportConversation $conversation): string
    {
        return strtoupper(substr(str_replace('-', '', $conversation->uuid), 0, 10));
    }

    private function fromAddress(string $address): string
    {
        $name = config('mail.from.name', config('app.name'));

        return $name ? "{$name} <{$address}>" : $address;
    }
}

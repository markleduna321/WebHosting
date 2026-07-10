<?php

namespace App\Events;

use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class SessionEvent implements ShouldBroadcastNow
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public string $channel,
        public string $eventName,
        public array $data = [],
    ) {
    }

    public function broadcastOn(): PresenceChannel
    {
        return new PresenceChannel($this->channel);
    }

    public function broadcastAs(): string
    {
        return $this->eventName;
    }

    public function broadcastWith(): array
    {
        return array_merge($this->data, [
            'event' => $this->eventName,
            'channel' => $this->channel,
            'emitted_at' => now()->toIso8601String(),
        ]);
    }
}
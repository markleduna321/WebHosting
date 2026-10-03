<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class SupportConversation extends Model
{
    use HasFactory;

    public const STATUS_OPEN = 'open';
    public const STATUS_HANDOFF_REQUESTED = 'handoff_requested';
    public const STATUS_CLOSED = 'closed';

    protected $fillable = [
        'uuid',
        'user_id',
        'guest_token_hash',
        'guest_email',
        'status',
        'last_message_at',
        'handoff_queued_at',
        'handoff_notified_at',
        'customer_notified_at',
    ];

    protected function casts(): array
    {
        return [
            'last_message_at' => 'datetime',
            'handoff_queued_at' => 'datetime',
            'handoff_notified_at' => 'datetime',
            'customer_notified_at' => 'datetime',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (self $conversation) {
            $conversation->uuid ??= (string) Str::uuid();
        });
    }

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function messages(): HasMany
    {
        return $this->hasMany(SupportMessage::class);
    }
}

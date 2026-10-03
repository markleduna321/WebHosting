<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SupportMessage extends Model
{
    use HasFactory;

    public const ROLE_USER = 'user';
    public const ROLE_ASSISTANT = 'assistant';

    protected $fillable = [
        'support_conversation_id',
        'role',
        'content',
    ];

    public function conversation(): BelongsTo
    {
        return $this->belongsTo(SupportConversation::class, 'support_conversation_id');
    }
}

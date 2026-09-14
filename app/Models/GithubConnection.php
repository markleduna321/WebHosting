<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GithubConnection extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'github_user_id',
        'github_username',
        'avatar_url',
        'access_token',
        'refresh_token',
        'token_expires_at',
        'scopes',
    ];

    /** Tokens must never reach a response, a log, or an Inertia prop. */
    protected $hidden = [
        'access_token',
        'refresh_token',
    ];

    protected function casts(): array
    {
        return [
            'access_token' => 'encrypted',
            'refresh_token' => 'encrypted',
            'token_expires_at' => 'datetime',
            'scopes' => 'array',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class StudentDatabase extends Model
{
    use HasFactory;

    public const STATUS_PROVISIONING = 'provisioning';
    public const STATUS_ACTIVE = 'active';
    public const STATUS_FAILED = 'failed';

    /** Both identifiers are interpolated into DDL, so they must match this exactly. */
    public const IDENTIFIER_PATTERN = '/^[a-z][a-z0-9_]{2,62}$/';

    /**
     * Passwords are interpolated into a single-quoted SQL literal, so every
     * character that could terminate or escape that literal is excluded:
     * no quote, no double quote, no backtick, no backslash.
     */
    public const PASSWORD_PATTERN = '/^[A-Za-z0-9!#$%&()*+,\-.:;<=>?@\[\]^_{|}~]{8,64}$/';

    protected $fillable = [
        'uuid',
        'user_id',
        'label',
        'db_name',
        'db_user',
        'db_password',
        'host',
        'port',
        'quota_mb',
        'size_bytes',
        'status',
        'failure_reason',
    ];

    /** The password must never reach a response, a log, or an Inertia prop by accident. */
    protected $hidden = [
        'db_password',
    ];

    protected function casts(): array
    {
        return [
            'db_password' => 'encrypted',
            'port' => 'integer',
            'quota_mb' => 'integer',
            'size_bytes' => 'integer',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (self $database) {
            $database->uuid ??= (string) Str::uuid();
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
}

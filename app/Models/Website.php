<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class Website extends Model
{
    use HasFactory;

    public const STATUS_QUEUED = 'queued';

    public const STATUS_BUILDING = 'building';

    public const STATUS_LIVE = 'live';

    public const STATUS_STOPPED = 'stopped';

    public const STATUS_FAILED = 'failed';

    public const HOST_SUFFIX = 'caleho.cloud';

    protected $fillable = [
        'uuid',
        'user_id',
        'name',
        'subdomain',
        'repository_full_name',
        'repository_default_branch',
        'repository_private',
        'status',
        'storage_path',
        'size_bytes',
        'file_count',
        'failure_reason',
        'last_deployed_at',
    ];

    protected function casts(): array
    {
        return [
            'repository_private' => 'boolean',
            'size_bytes' => 'integer',
            'file_count' => 'integer',
            'last_deployed_at' => 'datetime',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (self $website) {
            $website->uuid ??= (string) Str::uuid();
        });

        // Path is derived from the uuid only, never from user input.
        static::deleting(function (self $website) {
            File::deleteDirectory(storage_path('app/websites/'.$website->uuid));
        });
    }

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }

    public function getFullDomainAttribute(): string
    {
        return $this->subdomain.'.'.self::HOST_SUFFIX;
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

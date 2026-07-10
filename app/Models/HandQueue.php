<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HandQueue extends Model
{
    use HasFactory;

    protected $table = 'hand_queue';

    protected $fillable = [
        'session_id',
        'student_id',
        'student_name',
        'raised_at',
        'answered_at',
    ];

    protected function casts(): array
    {
        return [
            'raised_at' => 'datetime',
            'answered_at' => 'datetime',
        ];
    }

    public function session(): BelongsTo
    {
        return $this->belongsTo(Session::class);
    }
}
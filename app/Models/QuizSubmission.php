<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QuizSubmission extends Model
{
    use HasFactory;

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'session_id',
        'student_id',
        'student_name',
        'quiz_id',
        'quiz_title',
        'score',
        'total',
        'answers_json',
        'submitted_at',
    ];

    protected function casts(): array
    {
        return [
            'answers_json' => 'array',
            'submitted_at' => 'datetime',
        ];
    }

    public function session(): BelongsTo
    {
        return $this->belongsTo(Session::class);
    }
}
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Domain extends Model
{
    use HasFactory;

    protected $fillable = [
        'website_id',
        'domain_name',
        'is_primary',
        'ssl_status',
        'verification_status',
    ];

    protected function casts(): array
    {
        return [
            'is_primary' => 'boolean',
        ];
    }

    public function website(): BelongsTo
    {
        return $this->belongsTo(Website::class);
    }
}

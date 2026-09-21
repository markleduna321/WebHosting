<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasFactory, Notifiable, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function subscriptions(): HasMany
    {
        return $this->hasMany(Subscription::class);
    }

    public function activeSubscription(): HasOne
    {
        return $this->hasOne(Subscription::class)
            ->whereIn('status', Subscription::LIVE_STATUSES)
            ->latestOfMany();
    }

    public function pendingSubscription(): HasOne
    {
        return $this->hasOne(Subscription::class)
            ->where('status', Subscription::STATUS_PENDING_PAYMENT)
            ->latestOfMany();
    }

    public function githubConnection(): HasOne
    {
        return $this->hasOne(GithubConnection::class);
    }

    public function websites(): HasMany
    {
        return $this->hasMany(Website::class);
    }

    public function studentDatabases(): HasMany
    {
        return $this->hasMany(StudentDatabase::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }
}

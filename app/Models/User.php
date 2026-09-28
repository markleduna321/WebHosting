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

    /**
     * Send the email verification notification using Resend.
     *
     * @return void
     */
    public function sendEmailVerificationNotification()
    {
        $url = \Illuminate\Support\Facades\URL::temporarySignedRoute(
            'verification.verify',
            \Illuminate\Support\Carbon::now()->addMinutes(\Illuminate\Support\Facades\Config::get('auth.verification.expire', 60)),
            [
                'id' => $this->getKey(),
                'hash' => sha1($this->getEmailForVerification()),
            ]
        );

        try {
            $resend = \Resend::client(env('RESEND_API_KEY'));
            
            $resend->emails->send([
                'from' => env('MAIL_FROM_ADDRESS', 'onboarding@resend.dev'),
                'to' => [$this->email],
                'subject' => 'Verify Your Email Address',
                'html' => "
                    <div style=\"font-family: sans-serif; max-width: 600px; margin: 0 auto;\">
                        <h2 style=\"color: #1e293b;\">Welcome to our platform!</h2>
                        <p style=\"color: #475569; font-size: 16px; line-height: 1.5;\">
                            Thanks for signing up! Before getting started, could you verify your email address by clicking on the link we just emailed to you?
                        </p>
                        <div style=\"margin: 30px 0;\">
                            <a href=\"{$url}\" style=\"display: inline-block; padding: 12px 24px; background-color: #2563eb; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold;\">
                                Verify Email Address
                            </a>
                        </div>
                        <p style=\"color: #64748b; font-size: 14px;\">
                            If you did not create an account, no further action is required.
                        </p>
                    </div>
                ",
            ]);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Resend Email Verification Failed: ' . $e->getMessage());
        }
    }
}

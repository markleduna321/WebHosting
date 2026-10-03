<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use RuntimeException;

class TwoFactorService
{
    public const CODE_TTL_MINUTES = 10;

    /**
     * Generate a fresh code, store only its hash, and email the plaintext.
     */
    public function issueCode(User $user): void
    {
        $code = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        $user->forceFill([
            'two_factor_code' => Hash::make($code),
            'two_factor_expires_at' => Carbon::now()->addMinutes(self::CODE_TTL_MINUTES),
        ])->save();

        $this->sendCode($user, $code);
    }

    /**
     * @return string|null Error message, or null when the code is valid.
     */
    public function checkCode(User $user, string $code): ?string
    {
        if (! $user->two_factor_code) {
            return 'No pending verification code. Please request a new one.';
        }

        if ($user->two_factor_expires_at && $user->two_factor_expires_at->isPast()) {
            return 'The verification code has expired. Please request a new one.';
        }

        if (! Hash::check($code, $user->two_factor_code)) {
            return 'The verification code is incorrect.';
        }

        return null;
    }

    public function clearCode(User $user): void
    {
        $user->forceFill([
            'two_factor_code' => null,
            'two_factor_expires_at' => null,
        ])->save();
    }

    public static function maskEmail(string $email): string
    {
        [$local, $domain] = array_pad(explode('@', $email, 2), 2, '');
        $visible = mb_substr($local, 0, min(2, mb_strlen($local)));

        return $visible.str_repeat('*', max(mb_strlen($local) - mb_strlen($visible), 3)).'@'.$domain;
    }

    private function sendCode(User $user, string $code): void
    {
        $apiKey = config('services.resend.key');

        if (empty($apiKey)) {
            Log::error('Resend 2FA Code Failed: RESEND_API_KEY is not configured.');
            throw new RuntimeException('Email delivery is not configured.');
        }

        try {
            \Resend::client($apiKey)->emails->send([
                'from' => config('mail.from.address', 'onboarding@resend.dev'),
                'to' => [$user->email],
                'subject' => 'Your Two-Factor Authentication Code',
                'html' => $this->emailHtml($code),
            ]);
        } catch (\Throwable $e) {
            Log::error('Resend 2FA Code Failed: '.$e->getMessage());
            throw $e;
        }
    }

    private function emailHtml(string $code): string
    {
        $ttl = self::CODE_TTL_MINUTES;

        return "
            <div style=\"font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc; padding: 40px 20px;\">
                <div style=\"background-color: #ffffff; border-radius: 12px; padding: 40px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);\">
                    <div style=\"text-align: center; margin-bottom: 32px;\">
                        <h2 style=\"color: #1e293b; margin: 0 0 8px 0; font-size: 22px;\">Two-Factor Authentication</h2>
                        <p style=\"color: #64748b; margin: 0; font-size: 14px;\">Enter this code to verify your identity</p>
                    </div>
                    <div style=\"text-align: center; margin: 32px 0;\">
                        <div style=\"display: inline-block; background: linear-gradient(135deg, #2563eb, #7c3aed); padding: 3px; border-radius: 12px;\">
                            <div style=\"background-color: #ffffff; border-radius: 10px; padding: 16px 40px;\">
                                <span style=\"font-size: 36px; font-weight: 700; letter-spacing: 12px; color: #1e293b; font-family: monospace;\">{$code}</span>
                            </div>
                        </div>
                    </div>
                    <p style=\"color: #64748b; font-size: 13px; text-align: center; margin: 24px 0 0 0;\">
                        This code will expire in <strong style=\"color: #1e293b;\">{$ttl} minutes</strong>.<br>
                        If you didn't request this code, you can safely ignore this email.
                    </p>
                </div>
            </div>
        ";
    }
}

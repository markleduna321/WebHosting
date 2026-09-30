<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;

class TwoFactorController extends Controller
{
    /**
     * Enable 2FA and send the first OTP code via Resend.
     */
    public function enable(Request $request): JsonResponse
    {
        $user = $request->user();

        $code = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        $user->two_factor_code = $code;
        $user->two_factor_expires_at = Carbon::now()->addMinutes(10);
        $user->save();

        $this->sendCode($user, $code);

        return response()->json([
            'message' => 'A verification code has been sent to your email.',
        ]);
    }

    /**
     * Verify the OTP code and fully enable 2FA.
     */
    public function verify(Request $request): JsonResponse
    {
        $request->validate([
            'code' => ['required', 'string', 'size:6'],
        ]);

        $user = $request->user();

        if (! $user->two_factor_code) {
            return response()->json(['message' => 'No pending verification code. Please request a new one.'], 422);
        }

        if ($user->two_factor_expires_at && Carbon::parse($user->two_factor_expires_at)->isPast()) {
            return response()->json(['message' => 'The verification code has expired. Please request a new one.'], 422);
        }

        if ($user->two_factor_code !== $request->input('code')) {
            return response()->json(['message' => 'The verification code is incorrect.'], 422);
        }

        $user->two_factor_enabled = true;
        $user->two_factor_verified_at = now();
        $user->two_factor_code = null;
        $user->two_factor_expires_at = null;
        $user->save();

        return response()->json([
            'message' => 'Two-factor authentication has been enabled.',
            'enabled' => true,
            'verified_at' => $user->two_factor_verified_at->toIso8601String(),
        ]);
    }

    /**
     * Disable 2FA.
     */
    public function disable(Request $request): JsonResponse
    {
        $user = $request->user();

        $user->two_factor_enabled = false;
        $user->two_factor_code = null;
        $user->two_factor_expires_at = null;
        $user->two_factor_verified_at = null;
        $user->save();

        return response()->json([
            'message' => 'Two-factor authentication has been disabled.',
            'enabled' => false,
        ]);
    }

    /**
     * Resend a fresh OTP code.
     */
    public function resend(Request $request): JsonResponse
    {
        $user = $request->user();

        $code = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        $user->two_factor_code = $code;
        $user->two_factor_expires_at = Carbon::now()->addMinutes(10);
        $user->save();

        $this->sendCode($user, $code);

        return response()->json([
            'message' => 'A new verification code has been sent to your email.',
        ]);
    }

    /**
     * Send the 6-digit code via Resend.
     */
    private function sendCode($user, string $code): void
    {
        try {
            $apiKey = env('RESEND_API_KEY', '');

            if (empty($apiKey)) {
                throw new \Exception('RESEND_API_KEY is not set in the environment variables.');
            }

            $resend = \Resend::client($apiKey);

            $resend->emails->send([
                'from' => env('MAIL_FROM_ADDRESS', 'onboarding@resend.dev'),
                'to' => [$user->email],
                'subject' => 'Your Two-Factor Authentication Code',
                'html' => "
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
                                This code will expire in <strong style=\"color: #1e293b;\">10 minutes</strong>.<br>
                                If you didn't request this code, you can safely ignore this email.
                            </p>
                        </div>
                    </div>
                ",
            ]);
        } catch (\Throwable $e) {
            Log::error('Resend 2FA Code Failed: ' . $e->getMessage());
            throw $e;
        }
    }
}

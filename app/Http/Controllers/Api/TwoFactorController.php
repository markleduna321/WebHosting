<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\TwoFactorService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TwoFactorController extends Controller
{
    public function __construct(protected TwoFactorService $twoFactor)
    {
    }

    /**
     * Enable 2FA and send the first OTP code via Resend.
     */
    public function enable(Request $request): JsonResponse
    {
        $this->twoFactor->issueCode($request->user());

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

        if ($error = $this->twoFactor->checkCode($user, $request->input('code'))) {
            return response()->json(['message' => $error], 422);
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
        $this->twoFactor->issueCode($request->user());

        return response()->json([
            'message' => 'A new verification code has been sent to your email.',
        ]);
    }
}

<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\TwoFactorChallengeRequest;
use App\Models\User;
use App\Services\TwoFactorService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class TwoFactorChallengeController extends Controller
{
    public const SESSION_USER = 'login.2fa.id';
    public const SESSION_REMEMBER = 'login.2fa.remember';
    public const SESSION_STARTED = 'login.2fa.started_at';
    public const SESSION_ATTEMPTS = 'login.2fa.attempts';

    private const MAX_ATTEMPTS = 5;

    public function __construct(protected TwoFactorService $twoFactor)
    {
    }

    public function create(Request $request): Response|RedirectResponse
    {
        $user = $this->pendingUser($request);

        if (! $user) {
            return $this->abandon($request, 'Your verification session expired. Please log in again.');
        }

        return Inertia::render('Auth/two-factor-challenge/page', [
            'email' => TwoFactorService::maskEmail($user->email),
            'status' => session('status'),
        ]);
    }

    public function store(TwoFactorChallengeRequest $request): RedirectResponse
    {
        $user = $this->pendingUser($request);

        if (! $user) {
            return $this->abandon($request, 'Your verification session expired. Please log in again.');
        }

        $error = $this->twoFactor->checkCode($user, $request->validated('code'));

        if ($error) {
            $attempts = (int) $request->session()->get(self::SESSION_ATTEMPTS, 0) + 1;
            $request->session()->put(self::SESSION_ATTEMPTS, $attempts);

            if ($attempts >= self::MAX_ATTEMPTS) {
                $this->twoFactor->clearCode($user);

                return $this->abandon($request, 'Too many incorrect codes. Please log in again.');
            }

            throw ValidationException::withMessages(['code' => $error]);
        }

        $remember = (bool) $request->session()->get(self::SESSION_REMEMBER, false);

        $this->twoFactor->clearCode($user);
        $this->forgetPending($request);

        Auth::guard('web')->login($user, $remember);
        $request->session()->regenerate();

        return redirect()->intended(route('dashboard', absolute: false));
    }

    public function resend(Request $request): RedirectResponse
    {
        $user = $this->pendingUser($request);

        if (! $user) {
            return $this->abandon($request, 'Your verification session expired. Please log in again.');
        }

        $this->twoFactor->issueCode($user);
        $request->session()->put(self::SESSION_ATTEMPTS, 0);
        $request->session()->put(self::SESSION_STARTED, now()->timestamp);

        return back()->with('status', 'A new code has been sent to your email.');
    }

    private function pendingUser(Request $request): ?User
    {
        $id = $request->session()->get(self::SESSION_USER);
        $startedAt = $request->session()->get(self::SESSION_STARTED);

        if (! $id || ! $startedAt || now()->timestamp - $startedAt > TwoFactorService::CODE_TTL_MINUTES * 60) {
            return null;
        }

        $user = User::find($id);

        return $user && $user->two_factor_enabled ? $user : null;
    }

    private function abandon(Request $request, string $message): RedirectResponse
    {
        $this->forgetPending($request);

        return redirect()->route('login')->with('status', $message);
    }

    private function forgetPending(Request $request): void
    {
        $request->session()->forget([
            self::SESSION_USER,
            self::SESSION_REMEMBER,
            self::SESSION_STARTED,
            self::SESSION_ATTEMPTS,
        ]);
    }
}

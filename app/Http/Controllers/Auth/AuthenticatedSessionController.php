<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Services\TwoFactorService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    public function __construct(protected TwoFactorService $twoFactor)
    {
    }

    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/login/page', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $user = Auth::guard('web')->user();

        if ($user->two_factor_enabled) {
            // Password is correct but the session must not be authenticated until the code passes.
            Auth::guard('web')->logout();

            try {
                $this->twoFactor->issueCode($user);
            } catch (\Throwable $e) {
                throw ValidationException::withMessages([
                    'email' => 'We could not send your verification code. Please try again shortly.',
                ]);
            }

            $request->session()->put([
                TwoFactorChallengeController::SESSION_USER => $user->id,
                TwoFactorChallengeController::SESSION_REMEMBER => $request->boolean('remember'),
                TwoFactorChallengeController::SESSION_STARTED => now()->timestamp,
                TwoFactorChallengeController::SESSION_ATTEMPTS => 0,
            ]);

            return redirect()->route('two-factor.challenge');
        }

        $request->session()->regenerate();

        return redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}

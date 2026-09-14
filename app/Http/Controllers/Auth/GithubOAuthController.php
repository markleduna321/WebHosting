<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\GithubConnection;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Laravel\Socialite\Facades\Socialite;
use Symfony\Component\HttpFoundation\RedirectResponse as SymfonyRedirectResponse;
use Throwable;

class GithubOAuthController extends Controller
{
    /** Read-only access to public repositories; never request write scopes. */
    private const SCOPES = ['read:user', 'public_repo'];

    public function redirect(): SymfonyRedirectResponse
    {
        // scopes() lives on the concrete Two\GithubProvider, not the Provider contract.
        /** @var \Laravel\Socialite\Two\GithubProvider $driver */
        $driver = Socialite::driver('github');

        // Stateful (not stateless) so Socialite's session `state` guards the callback against CSRF.
        return $driver->scopes(self::SCOPES)->redirect();
    }

    public function callback(Request $request): RedirectResponse
    {
        try {
            $githubUser = Socialite::driver('github')->user();
        } catch (Throwable $e) {
            Log::warning('GitHub OAuth callback failed.', ['reason' => $e->getMessage()]);

            return redirect()
                ->route('dashboard')
                ->with('github_error', 'We could not connect your GitHub account. Please try again.');
        }

        $owner = GithubConnection::query()
            ->where('github_user_id', (string) $githubUser->getId())
            ->first();

        if ($owner && $owner->user_id !== $request->user()->id) {
            return redirect()
                ->route('dashboard')
                ->with('github_error', 'That GitHub account is already linked to another AsuraHost user.');
        }

        GithubConnection::updateOrCreate(
            ['user_id' => $request->user()->id],
            [
                'github_user_id' => (string) $githubUser->getId(),
                'github_username' => $githubUser->getNickname() ?? $githubUser->getName(),
                'avatar_url' => $githubUser->getAvatar(),
                'access_token' => $githubUser->token,
                'refresh_token' => $githubUser->refreshToken,
                'token_expires_at' => $githubUser->expiresIn
                    ? now()->addSeconds($githubUser->expiresIn)
                    : null,
                'scopes' => self::SCOPES,
            ]
        );

        return redirect()->to(route('dashboard').'?github=connected');
    }

    public function destroy(Request $request): RedirectResponse
    {
        $connection = $request->user()->githubConnection;

        if ($connection) {
            $this->authorize('delete', $connection);
            $connection->delete();
        }

        return redirect()->route('dashboard');
    }
}

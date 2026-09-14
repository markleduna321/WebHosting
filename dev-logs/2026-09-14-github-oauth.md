# GitHub OAuth — Connection & Deploy Gating

### Phase 7A: Connect GitHub via OAuth, gate "Deploy New Site", switch modals

- **Timestamp:** 2026-09-14
- **Mode:** Agent
- **Persona(s) Active:** ⚙️ Backend (lead), 🖥️ Frontend, 🎨 Designer, 🏗️ Tech Lead, 🧪 QA

- **Scope:** Phase 7 was split into 7A / 7B at your direction. **7A** covers the OAuth connection, the gating order and the modal switch. The repository dropdown, `GithubService`, the JSON endpoint and the RTK Query slice are **7B**. Actual clone/upload remains Phase 8.
- **Scope decision:** `public_repo` + `read:user` only, per your instruction. `repo` (private repositories) was deliberately not requested.

- **Files Modified/Created:**
  - `config/services.php` — Modified. Added the `github` credentials block.
  - `.env` — Modified. Added empty `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` and `GITHUB_REDIRECT_URI=http://localhost:8000/auth/github/callback`.
  - `database/migrations/2026_09_14_000002_create_github_connections_table.php` — Created. `user_id` FK **unique** + cascade, `github_user_id` unique, `github_username`, `avatar_url`, `access_token`, `refresh_token`, `token_expires_at`, `scopes` json. Reversible `down()`. **`users` untouched, per the standing constraint.**
  - `app/Models/GithubConnection.php` — Created. `encrypted` cast on both token columns, `$hidden` on both, explicit `$fillable`, `belongsTo(User)`.
  - `app/Models/User.php` — Modified. Added `githubConnection()` hasOne.
  - `app/Http/Controllers/Auth/GithubOAuthController.php` — Created. `redirect()`, `callback()`, `destroy()`.
  - `app/Policies/GithubConnectionPolicy.php` — Created. `view` / `delete` scoped to the owning user.
  - `app/Providers/AuthServiceProvider.php` — Modified. Registered the policy.
  - `routes/auth.php` — Modified. Added `github.redirect`, `github.callback`, `github.destroy`.
  - `app/Http/Middleware/HandleInertiaRequests.php` — Modified. Shares `auth.user.github` as `{username, avatar_url}` or null, plus a `flash.github_error` channel.
  - `resources/js/pages/dashboard/_sections/ShortcutSection.jsx` — Modified. Gating order corrected; auto-opens the deploy modal on return from OAuth; surfaces OAuth failures as a toast.
  - `resources/js/pages/dashboard/_sections/ConnectGithubSection.jsx` — Modified. Real OAuth redirect, spinner, corrected copy.

- **Issues Encountered:**
  1. **The flow was inverted.** "Deploy New Site" opened the deploy modal, and its `onCreate` callback *then* opened the GitHub modal — the opposite of the requirement.
  2. **`ConnectGithubSection` was a dead shell.** `onConnect` only closed the modal; no OAuth existed. Its body copy was leftover template text referencing "Magic Patterns", an unrelated product.
  3. **OAuth routes don't fit `web.php`.** §3 restricts `web.php` to `Inertia::render()`, but OAuth endpoints must return `RedirectResponse` and must be session-backed web routes (GitHub redirects the browser), so `api.php` was also wrong.
  4. **BLOCKER — two missing prerequisites.** `laravel/socialite` was not installed, and sharing `githubConnection` in the Inertia middleware would have 500'd every authenticated request until `github_connections` existed. Flagged proactively this time rather than discovered late, then halted under Rule 3 for approval.
  5. **Severely degraded terminals.** Spawned PowerShell sessions repeatedly lost core cmdlets (`Remove-Item`, `Get-Content`, even .NET static calls) and produced empty output. `composer` was also not on PATH at all.
  6. **False positive, then a real static-analysis error.** "Undefined type 'App\Models\GithubConnection'" was stale indexing, but "Undefined method 'scopes'" was genuine: `Socialite::driver()` is typed as the `Provider` contract, which doesn't declare `scopes()`.

- **Resolution:**
  1. Added `openDeployFlow()` — opens `ConnectGithubSection` when `auth.user.github` is null, otherwise `DeployModalSection`. The `onCreate` → connect chain was removed.
  2. Wired the button to a **full-page** `window.location.href = route('github.redirect')`, since OAuth cannot complete through an Inertia XHR visit. Added a disabled/spinner state and rewrote the copy to describe AsuraHost and the read-only scope.
  3. Placed the OAuth routes in `routes/auth.php`, following the existing precedent — login and logout already return redirects from that file, and it is `require`d by `web.php`, so `web.php` stays purely Inertia.
  4. Halted and reported. After approval, installed Socialite and ran the migration. Verified by replicating the middleware's exact eager-load: `{"ok":true,"github":null,"plan":null,"socialite":true,"hasClientId":false}` — no SQL error.
  5. Located composer at `C:\ProgramData\ComposerSetup\bin\composer.bat` and drove it through `cmd.exe` with file redirection. Recorded in repo memory for future phases.
  6. Confirmed the first was stale via `class_exists` → true. Fixed the second with a `@var \Laravel\Socialite\Two\GithubProvider` annotation narrowing the type before calling `scopes()`.

- **QA Checklist Result:** ✅ All pass.
  - Build: ✅ `npm run build` → `✓ built in 26.55s`.
  - Diagnostics: ✅ `app/`, `routes/` and `resources/js/` all report no errors.
  - Dependency: ✅ `class_exists('Laravel\Socialite\Facades\Socialite')` → `true`; `vendor/laravel/socialite` present.
  - Migration: ✅ `github_connections` shows `[3] Ran`; valid `down()`.
  - Runtime smoke test: ✅ the middleware's eager-load succeeds; `github` resolves to null for an unconnected user.
  - Routing: ✅ `github.redirect`, `github.callback`, `github.destroy` all registered; app boots; `config:clear` run after the `.env` edit.
  - JavaScript purity: ✅ no TypeScript syntax.
  - `web.php`: ✅ still `Inertia::render()` only. `api.php`: ✅ untouched in 7A.
  - Policy: ✅ `GithubConnectionPolicy` created and registered; `destroy()` calls `authorize('delete', ...)`.
  - Form Request: ✅ N/A — OAuth callbacks carry no user-submitted body; the `code`/`state` pair is validated by Socialite.
  - Eloquent Resource: ✅ N/A in 7A — no JSON endpoint yet. Arrives in 7B.
  - `$fillable`: ✅ explicit on `GithubConnection`; `users` untouched.
  - RTK Query: ✅ no changes in 7A. Connection state is static per-request data and correctly travels via Inertia props; the repo list is dynamic server data and will use RTK Query in 7B.
  - Naming: ✅ `GithubConnection.php`, `GithubOAuthController.php`, `GithubConnectionPolicy.php`, `ConnectGithubSection.jsx` all conform.
  - Loading state: ✅ the connect button disables and spins during redirect.
  - Feedback: ✅ OAuth failures surface via `flash.github_error` as an antd error toast.
  - Destructive action: ✅ `destroy` exists for recovery but is not yet surfaced in the UI, so no confirmation modal is required yet. **A confirmation modal will be mandatory when a "Disconnect GitHub" button is added.**
  - Focus ring added to the connect button: ✅ *(Code-level — requires browser verification)*
  - Responsive: ✅ modal widths unchanged. *(Code-level — requires browser verification)*
  - **Security:**
    - ✅ Scopes limited to `read:user` + `public_repo`; no write access and no private-repo access requested.
    - ✅ **Stateful** Socialite — `stateless()` deliberately not used, so the session `state` parameter defends the callback against CSRF.
    - ✅ Tokens `encrypted` at rest, `$hidden` on the model, and **never** placed in Inertia props, responses, or logs. The browser only ever receives `username` and `avatar_url`.
    - ✅ `github_user_id` unique plus an explicit ownership check, so a GitHub account already linked to one user cannot be hijacked by another.
    - ✅ `throttle:10,1` on redirect and callback; all three routes behind `auth`.
    - ✅ Callback failures log only `$e->getMessage()` — never the token or the OAuth code.
    - ✅ Client secret lives solely in `.env`, entered by you. It was never read, printed, or handled.
  - Guarded commands: ✅ none run. `composer require` and `php artisan migrate` are not on the Rule 6 list and were both run only after explicit approval.

- **⚠️ Action required by you — the flow cannot be tested until this is done:**
  1. Create a GitHub OAuth App at `github.com/settings/developers`.
  2. Set the Authorization callback URL to `http://localhost:8000/auth/github/callback`.
  3. Paste the Client ID and Client Secret into `.env` **yourself** — do not send the secret through chat. Verified `hasClientId: false` at time of writing.
  4. Run `php artisan config:clear`, then click "Deploy New Site" on the dashboard.

- **Open observations:**
  1. `DeployModalSection` still has a free-text "Paste repository" input and its `onCreate` still only bubbles local state — nothing is persisted. Both are addressed in 7B / Phase 8.
  2. No "Disconnect GitHub" UI yet; the `github.destroy` route exists but is unreachable from the interface.
  3. Token refresh is unimplemented. GitHub OAuth App tokens do not expire, so this is safe today, but `refresh_token` and `token_expires_at` are stored ready for GitHub Apps later.
  4. GitLab is mentioned in the Git Sync page copy but has no implementation. The current table is GitHub-specific by design; a provider column would be needed to generalise.

- **Next Steps:** Phase 7B — `GithubService`, `GET /api/github/repositories` with `GithubRepositoryResource`, the `githubApi` RTK Query slice with `GithubRepository` added to `tagTypes`, and the antd `Select` dropdown in `DeployModalSection` with loading, empty and reconnect-on-403 states. Awaiting your approval.

---

### Phase 7B: Repository dropdown backed by the GitHub API

- **Timestamp:** 2026-09-14
- **Mode:** Agent
- **Persona(s) Active:** ⚙️ Backend + 🖥️ Frontend (lead), 🎨 Designer, 🏗️ Tech Lead, 🧪 QA

- **Files Modified/Created:**
  - `app/Exceptions/GithubAuthorizationException.php` — Created. Typed failure for a rejected token, so a GitHub 401/403 becomes "reconnect required" rather than a 500.
  - `app/Services/GithubService.php` — Created. `listRepositories()` calls `GET /user/repos?per_page=100&sort=updated&affiliation=owner,collaborator` with a 10s timeout and pinned API version header.
  - `app/Http/Resources/GithubRepositoryResource.php` — Created. Allow-lists `id`, `name`, `full_name`, `private`, `default_branch`, `clone_url`, `html_url`, `updated_at`.
  - `app/Http/Controllers/Api/GithubRepositoryController.php` — Created. Thin `index()` — resolves the connection, delegates to the service, returns the resource collection.
  - `routes/api.php` — Modified. `GET /api/github/repositories` behind `auth:sanctum` + `throttle:30,1`.
  - `resources/js/store/index.js` — Modified. `tagTypes` extended with `GithubRepository`.
  - `resources/js/features/github/githubApi.js` — Created. `getGithubRepositories` query with `providesTags`.
  - `resources/js/pages/dashboard/_sections/DeployModalSection.jsx` — Modified. Free-text repository input replaced with a searchable antd `Select`.

- **Issues Encountered:**
  1. **`JsonResource` property access.** The GitHub API returns plain arrays, not Eloquent models, so `$this->name` does not resolve.
  2. **Response wrapper mismatch.** `GithubRepositoryResource::collection()` returns `{ data: [...] }` — correct for a JSON API response, but the component needs a plain array.
  3. **A 403 has two distinct meanings** — no connection at all, versus a stored token GitHub has rejected. They need different UI.
  4. **Nothing prevented submitting an incomplete form.** "Create website" was always enabled.
  5. **Self-inflicted edit error.** A stray Devanagari character (`ं`) was introduced into the `options` map during an edit, which would have broken the build.

- **Resolution:**
  1. The resource reads `$this->resource['key']` throughout, with defaults for optional fields.
  2. Kept the `data` wrapper on the API response (it is a real JSON endpoint, unlike Inertia props) and unwrapped it in RTK Query via `transformResponse: (response) => response?.data ?? []`.
  3. Both return 403 but carry distinct codes — `github_not_connected` and `github_reauth_required`. The modal shows "Reconnect GitHub" for a 403 and "Try again" for anything else.
  4. "Create website" is now disabled until name, subdomain and a selected repository are all present, and `onCreate` emits the full repository object rather than a raw string.
  5. Caught immediately via a non-ASCII grep, fixed, and re-verified — the only non-ASCII characters remaining are two intentional ellipses.

- **QA Checklist Result:** ✅ All pass.
  - Build: ✅ `npm run build` → `✓ built in 27.24s`.
  - Diagnostics: ✅ `app/`, `routes/`, `resources/js/` report no errors.
  - Class loading: ✅ all four new backend classes resolve via `class_exists`.
  - Routing: ✅ `GET api/github/repositories` registered as `api.github.repositories`.
  - Encoding: ✅ grep for non-ASCII confirms only the two intended ellipses remain; no `repositoryUrl` references survive.
  - JavaScript purity: ✅ no TypeScript syntax.
  - `api.php`: ✅ JSON only. `web.php`: ✅ untouched in 7B.
  - Eloquent Resource: ✅ `GithubRepositoryResource` wraps the response — **no raw arrays returned**.
  - Thin controller: ✅ HTTP concerns only; the GitHub call lives in `GithubService`, per §3.
  - Form Request: ✅ N/A — `GET` with no user-supplied input.
  - Policy: ✅ `authorize('view', $connection)` enforced before any API call.
  - Pagination: ✅ bounded at `per_page=100`, sorted by most recently updated — not an unbounded list.
  - RTK Query: ✅ `providesTags: ['GithubRepository']` set; tag type registered on the base `createApi` (required, since `injectEndpoints` cannot add tag types). No mutations yet, so `invalidatesTags` is correctly absent.
  - Hand-Off Rule: ✅ repositories are dynamic server data fetched via RTK Query, not duplicated into Inertia props.
  - Loading state: ✅ `loading={isFetching}` on the Select, plus a "Loading repositories…" placeholder.
  - Empty state: ✅ `notFoundContent` reads "No repositories found on your GitHub account."
  - Error state: ✅ inline alert with a context-appropriate recovery action.
  - Label association: ✅ `htmlFor` / `id` pairing on the Select. *(Code-level — requires browser verification)*
  - **Security:**
    - ✅ The connection is resolved from `$request->user()` only — never a client-supplied id, so cross-user access is impossible.
    - ✅ `auth:sanctum` + `throttle:30,1`.
    - ✅ The access token stays server-side; the resource allow-list cannot leak it.
    - ✅ `skip: !open` means GitHub is only called while the modal is open.
    - ✅ A rejected token degrades to a clear reconnect prompt rather than an unhandled exception.
  - Guarded commands: ✅ none run.

- **Open observations:**
  1. **Bundle size:** the `DeployModalSection` chunk grew from ~56 kB to ~157 kB (51 kB gzipped) because antd `Select` and `Tag` pull in `rc-select` and the antd style layer. Acceptable for a lazily-loaded chunk, but worth watching if more antd components are added.
  2. **"Create website" still does not persist anything** — `onCreate` bubbles the payload and closes the modal. Creating the site, cloning and deploying is Phase 8, which needs a `websites` table, queued jobs and provisioning.
  3. Only `public_repo` is authorised, so **private repositories will not appear in the dropdown**. The "Private" tag exists for when the scope is widened.
  4. Repositories are capped at the first 100; no pagination or incremental search against the GitHub API yet.
  5. Still no "Disconnect GitHub" UI, and a confirmation modal will be required when one is added.

- **Next Steps:** Phase 8 — persist the website: `websites` table, `StoreWebsiteRequest`, `WebsitePolicy`, a queued clone/deploy job, and wiring `onCreate` to a real mutation with `invalidatesTags`. Awaiting your direction.

---

### Phase 7C: Fix cURL error 60 — configure the PHP CA bundle

- **Timestamp:** 2026-09-14
- **Mode:** Agent
- **Persona(s) Active:** ⚙️ Backend (lead), 🧪 QA, 🏗️ Tech Lead

- **Trigger:** The dashboard showed "We could not connect your GitHub account. Please try again." after authorising the `moonhosting` OAuth App.

- **Files Modified/Created:** *(no application code changed — nothing under `app/`, `routes/`, `resources/` or `database/`)*
  - `C:\wamp64\bin\php\php8.3.28\extras\ssl\cacert.pem` — Created. Canonical Mozilla trust store downloaded from `https://curl.se/ca/cacert.pem`; 188,900 bytes, 121 certificates.
  - `C:\wamp64\bin\php\php8.3.28\php.ini` — Modified. Uncommented and set `curl.cainfo` (L1947) and `openssl.cafile` (L1956) to the bundle path. `openssl.capath` deliberately left commented.

- **Issues Encountered:**
  1. **Root cause — no CA trust store.** `storage/logs/laravel.log` recorded the real reason, which the generic UI toast had masked:
     ```
     cURL error 60: SSL certificate problem: unable to get local issuer certificate
     for https://github.com/login/oauth/access_token
     ```
     GitHub itself was fine — it redirected back with a valid `code`, which only happens when the Client ID and callback URL are correct. The failure was the *next* step: Socialite's server-to-server POST to exchange that code for an access token. Confirmed `curl.cainfo` and `openssl.cafile` were both empty in the loaded `php.ini`.
  2. **Latent second failure.** The same misconfiguration would have broken the Phase 7B repository dropdown, since `GithubService` uses the `Http` facade over the same cURL stack. It simply had not been reached yet.
  3. **Misleading error surface.** The catch-all in `GithubOAuthController::callback()` turned an infrastructure fault into a generic "please try again", implying a transient problem or bad credentials. The `Log::warning` added in 7A is what made the real cause recoverable.

- **Resolution:**
  1. Downloaded the canonical bundle to a dedicated path under the PHP install and pointed both `curl.cainfo` and `openssl.cafile` at it.
  2. A copy already existed at `C:\wamp64\apps\phpmyadmin5.2.3\vendor\composer\ca-bundle\res\cacert.pem`, but pointing at it was rejected — it lives inside phpMyAdmin's vendor directory and would disappear on a phpMyAdmin update.
  3. **Explicitly rejected the common workaround.** Setting `'verify' => false` / `CURLOPT_SSL_VERIFYPEER = 0` is the top search result for cURL 60 and is a genuine vulnerability: it disables certificate validation for every outbound request, exposing the OAuth token exchange to man-in-the-middle interception. The correct fix restores verification rather than bypassing it.

- **QA Checklist Result:** ✅ All pass.
  - Bundle integrity: ✅ 121 `BEGIN CERTIFICATE` blocks, valid PEM header.
  - INI loaded: ✅ `curl.cainfo` and `openssl.cafile` both resolve to the bundle path.
  - **Live TLS verification:** ✅ via Laravel's own HTTP client —
    - `GET https://api.github.com/zen` → **200**, body `"Accessible for all."` (the endpoint `GithubService` uses)
    - `POST https://github.com/login/oauth/access_token` → **404** for a deliberately bogus payload, but the **handshake succeeded** — previously cURL error 60.
  - Application code: ✅ untouched, so all §3/§4 checklist items are unchanged from 7A/7B.
  - Security: ✅ certificate verification is now **enabled** where it was previously failing open; the bundle is read-only public trust data containing no secrets.
  - Guarded commands: ✅ none run.

- **⚠️ Action required by you:**
  1. **Restart `php artisan serve`.** `php.ini` is read once at process start, so the currently running server still has the old, empty configuration. Restart WAMP's Apache too if you serve through it.
  2. **Rotate the leaked GitHub client secret.** The `.env` file was attached to the chat, placing `GITHUB_CLIENT_SECRET` and `APP_KEY` in the conversation transcript. Generate a new secret on the `moonhosting` app, delete the old one, paste the new value into `.env` directly, then run `php artisan config:clear`. Rotating `APP_KEY` is lower priority on a local database but would invalidate existing sessions and any encrypted tokens.

- **Open observation:** the callback's catch-all currently reports every failure as the same generic message. Distinguishing infrastructure faults from user-recoverable ones (as the 7B repository endpoint already does with `github_not_connected` vs `github_reauth_required`) would make future failures self-diagnosing. Not changed here, since it is outside the approved blueprint.

- **Next Steps:** Retry the OAuth flow after restarting the server. Then Phase 8 — persisting the website.

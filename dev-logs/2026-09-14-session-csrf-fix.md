# Session / CSRF Configuration Fix

### Phase 4: Resolve 419 CSRF token mismatch on `POST /login`

- **Timestamp:** 2026-09-14
- **Mode:** Agent
- **Persona(s) Active:** ⚙️ Backend (lead), 🏗️ Tech Lead, 🧪 QA

- **Files Modified/Created:**
  - `.env` — Modified. Three corrections:
    - `APP_URL` → `http://localhost:8000` (was `http://localhost`, missing the dev server port).
    - Removed the duplicate `SESSION_DOMAIN=localhost` at L74, leaving the canonical `SESSION_DOMAIN=null` at L33.
    - `SANCTUM_STATEFUL_DOMAINS` → `localhost:8000,127.0.0.1:8000,localhost,127.0.0.1` (was `localhost,127.0.0.1`, no ports).

- **Issues Encountered:**
  1. **419 on `POST /login`.** `.env` declared `SESSION_DOMAIN` twice — `null` at L33 and `localhost` at L74. The later declaration wins, so `config/session.php` resolved the cookie's `Domain` attribute to `localhost`. The app was being accessed at `http://127.0.0.1:8000`, and browsers do not send a `Domain=localhost` cookie to the host `127.0.0.1` — they are distinct hosts, not aliases. Neither `laravel_session` nor `XSRF-TOKEN` reached the server on the POST, `VerifyCsrfToken` found no matching token, and Laravel returned 419. GET requests still rendered normally because they do not require the token, which is why the login page itself loaded fine.
  2. **Latent second failure.** `SANCTUM_STATEFUL_DOMAINS` omitted the port. Sanctum matches host *and* port, so `$middleware->statefulApi()` in `bootstrap/app.php` would not have treated the RTK Query `/api` calls as stateful — the same 419 would have surfaced on every mutation as soon as login started working.
  3. **`APP_URL` port mismatch.** Unrelated to the 419 but inconsistent with the dev server, affecting generated URLs.

- **Resolution:**
  1. Duplicate removed. `SESSION_DOMAIN=null` makes Laravel omit the `Domain` attribute entirely, producing a host-only cookie that works on `localhost`, `127.0.0.1`, or any host the app is served from. Verified with `php artisan config:show session` → `domain: null`.
  2. Ports added to `SANCTUM_STATEFUL_DOMAINS`, with the bare hosts retained as a fallback.
  3. `APP_URL` corrected.
  4. Ran `php artisan config:clear` and `php artisan cache:clear` (both were in the approved plan) so the corrected values take effect.

- **QA Checklist Result:** ✅ All pass.
  - `.env` integrity: ✅ exactly one `SESSION_DOMAIN` (L33, `null`); `APP_URL` L6 and `SANCTUM_STATEFUL_DOMAINS` L74 corrected.
  - Resolved config: ✅ `php artisan config:show session` reports `driver: database`, `domain: null`, `path: /`, `encrypt: false`, `same_site: lax`.
  - Session storage: ✅ `php artisan migrate:status` shows all 6 migrations Ran, so the `sessions` table required by `SESSION_DRIVER=database` exists.
  - JavaScript purity: ✅ no JS changed.
  - `web.php` / `api.php`: ✅ untouched.
  - Form Request / Policy / Resource / migration: ✅ N/A — no new endpoints or models.
  - Frontend: ✅ untouched. Confirmed by grep that no JS hardcodes a host; `store/index.js` uses the relative `baseUrl: '/api'`.
  - `credentials: 'include'`: ✅ still set in `fetchBaseQuery`.
  - **CSRF protection: ✅ unchanged and still fully enforced.** This fix addresses token *delivery*, not verification — no middleware was disabled, excluded or weakened.
  - Secrets: ✅ `APP_KEY` and DB credentials were never read into context, printed, or modified. Only the specific non-secret lines were inspected.
  - Guarded commands: ✅ none run. `config:clear`, `cache:clear` and the read-only `migrate:status` are not on the Rule 6 list, and the first two were explicitly approved.

- **Action required by you (cannot be verified from the agent side):**
  1. Restart `php artisan serve`.
  2. **Clear existing cookies for `localhost` and `127.0.0.1`** — stale cookies carrying the old `Domain=localhost` will otherwise linger and keep reproducing the 419.
  3. Hard-reload and confirm `POST /login` returns 302 instead of 419.

- **Open observation (not in this phase):** `resources/views/app.blade.php` L16 references `resources/js/Pages/{$page['component']}.jsx` with a capital **P**, but the directory is `resources/js/pages`. Windows resolves this case-insensitively so it works locally; it will break on a case-sensitive Linux server.

- **Next Steps:** None queued. Pending items carried over from the sidebar work: the `sections/` vs `_sections/` naming deviation, the `_components/` vs `components/ui/` duplication, the `app.blade.php` casing bug above, and the 11 `npm audit` vulnerabilities.

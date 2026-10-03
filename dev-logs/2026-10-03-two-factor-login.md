# Two-Factor Login Challenge

### Phase 1: Enforce email 2FA challenge on login

- **Timestamp:** 2026-10-03
- **Mode:** Agent
- **Persona(s) Active:** ⚙️ Backend (lead), 🖥️ Frontend + 🎨 Designer, 🧪 QA
- **Root cause:** 2FA was only implemented in the settings flow. `AuthenticatedSessionController::store()` authenticated and redirected without ever checking `two_factor_enabled`, so enabling 2FA had no effect on login.

- **Files Modified/Created:**
  - `app/Services/TwoFactorService.php` — Created. Issues codes stored as a **bcrypt hash**, verifies with `Hash::check` (timing-safe), clears codes, masks emails, and sends via Resend using `config('services.resend.key')` (was `env()`, which returns null once config is cached).
  - `database/migrations/2026_10_03_000000_widen_two_factor_code_on_users_table.php` — Created (**approved amendment, Rule 3**). Widens `two_factor_code` from `string(6)` to `string(255)` so hashes fit. `down()` nulls pending codes first, then reverts to `string(6)`.
  - `app/Http/Controllers/Auth/AuthenticatedSessionController.php` — When 2FA is enabled: logs the user back out, stores the pending login (user id, remember flag, start time, attempt count) in the session, sends a code, and redirects to `/two-factor-challenge`. If sending fails, the user gets an inline error on the login form instead of a 500.
  - `app/Http/Controllers/Auth/TwoFactorChallengeController.php` — Created. `create` renders the page, or sends the user back to login if there's no pending login or it's older than 10 minutes. `store` verifies the code, then logs in with the remember flag and regenerates the session; after 5 wrong codes it discards the pending login. `resend` issues a fresh code and resets the attempt count and the 10-minute window.
  - `app/Http/Requests/Auth/TwoFactorChallengeRequest.php` — Created. `code` → `required|digits:6`.
  - `app/Http/Controllers/Api/TwoFactorController.php` — Refactored onto the service. Response shapes are unchanged, so the existing settings UI and `twoFactorApi.js` work as before.
  - `routes/auth.php` — Guest routes: `GET /two-factor-challenge`, `POST /two-factor-challenge` (`throttle:10,1`), `POST /two-factor-challenge/resend` (`throttle:3,1`).
  - `config/services.php` — Added `resend.key`.
  - `resources/js/pages/Auth/two-factor-challenge/page.jsx` — Created. Split layout matching login; one numeric 6-digit input (`autoComplete="one-time-code"`, autofocus, strips non-digits from pasted text); inline error; spinner on submit; resend button with a 30-second cooldown; status banner; back-to-login `<Link>`.
  - `resources/js/pages/Auth/login/page.jsx` — Now shows the `status` prop, which was passed but never rendered, so expired-session and too-many-attempts messages are visible.

- **Issues Encountered:**
  1. Plan assumed no migration was needed; the 6-char column cannot hold a hash.
  2. I wrote the refactored API controller to a stray `TwoFactorController.php.new` by mistake, and an intermediate edit left a duplicate closing brace plus the old `sendCode()` method.
  3. The editor flagged `Session::increment()` as undefined (it exists on `Store`, not on the contract).
- **Resolution:**
  1. Rule 3 stop, amended plan approved, migration added.
  2. Applied the changes to the real file with targeted edits, removed the leftover tail, and deleted the stray `.new` file. `php -l` clean.
  3. Replaced it with an explicit `get` + `put`.

- **QA Checklist Result:**
  - ✅ JS purity: plain JavaScript only.
  - ✅ `web.php` / `api.php`: unchanged. New routes follow the existing Breeze `auth.php` pattern for auth controllers.
  - ✅ Form Request for the new POST (`TwoFactorChallengeRequest`). The resend POST takes no input.
  - ➖ Policy / Eloquent Resource: N/A. These are guest auth redirects, not resource or JSON endpoints.
  - ✅ Migration reversible.
  - ✅ Service class holds all non-trivial logic.
  - ➖ RTK Query: N/A. A full-page auth transition uses Inertia `useForm` per Section 4.
  - ✅ 422 errors shown inline under the code field; on error the input clears and refocuses.
  - ✅ Internal links use `<Link>`.
  - ✅ Loading states: submit spinner and "Sending..." on resend.
  - ✅ Naming: `TwoFactorService`, `TwoFactorChallengeController`, `TwoFactorChallengeRequest`, kebab-case `two-factor-challenge/` folder.
  - ✅ Keyboard and a11y at code level, needs browser check: labelled input, `aria-invalid` / `aria-describedby`, `role="status"` banners, native buttons.
  - ✅ Responsive at code level, needs browser check: branding panel only at `lg`; form padding set at `sm` and `lg`.
  - ✅ Security: the session is not authenticated until the second factor passes; session regenerated only after success (prevents fixation); codes hashed and compared timing-safely; throttling plus a 5-attempt cap; codes expire after 10 minutes; only the masked email reaches the client.
  - ✅ Guarded commands: none run. `php -l`, `route:list`, `migrate:status` (read-only), and a tinker check of `maskEmail` only.
  - ⚠️ No live end-to-end test: it would send a real email through Resend and change a user's 2FA setting in the database. Needs your browser check.
  - ⚠️ Design note: `premium-ui-design.instructions.md` asks for a dark, animated style, but per the approved plan this page matches the existing light login and register screens so the auth flow looks consistent. Restyling the whole auth flow would be its own phase.

- **User actions required:**
  1. `php artisan migrate`. **Required:** until it runs, saving a hashed code fails, so both enabling 2FA and logging in with 2FA will error.
  2. If config is cached, run `php artisan config:clear` so `services.resend.key` is picked up.
  3. Any code issued before this change is plaintext and will not verify. Request a new one with Resend, or wait 10 minutes for it to expire.
  4. Browser test: enable 2FA in settings → log out → log in → check you land on `/two-factor-challenge` → enter the emailed code → check you land on the dashboard. Also try a wrong code 5 times and confirm you're sent back to login with a message.

- **Next Steps:** None scoped. Possible follow-ups, each needing its own approval: an expiry countdown on the challenge page, "trust this device for 30 days", and an email alert when 2FA is turned off.

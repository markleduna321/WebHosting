# Direct Signup — Email Verification & Plan State

### Phase 5: Unverified-state banner, plans/subscriptions schema, dashboard quick actions

- **Timestamp:** 2026-09-14
- **Mode:** Agent
- **Persona(s) Active:** ⚙️ Backend + 🖥️ Frontend (lead), 🎨 Designer, 🏗️ Tech Lead, 🧪 QA

- **Scope:** Direct signup only (no plan chosen at registration). The plan-selection registration flow is a separate future phase.

- **User amendments to the original plan:**
  1. Full `plans` / `subscriptions` schema instead of a `users.plan` column.
  2. Banner-only verification enforcement — `verified` middleware removed everywhere.
  3. **Constraint:** `0001_01_01_000000_create_users_table.php` is auth-data only. No columns may be added to `users`; link users to other tables instead.
  4. Do not seed plans for now.

- **Files Modified/Created:**
  - `database/migrations/2026_09_14_000000_create_plans_table.php` — Created. `slug` + `name` unique, nullable `monthly_price`/`annual_price` (quote-only plans), `currency`, json `features`, `is_popular`, `is_active`, `sort_order`. Indexes on `is_active` and `sort_order`. Reversible `down()`.
  - `database/migrations/2026_09_14_000001_create_subscriptions_table.php` — Created. `uuid` unique, `user_id` FK cascade-on-delete, `plan_id` FK restrict-on-delete, `status`, `billing_cycle`, `starts_at`/`ends_at`/`canceled_at`. Composite index `(user_id, status)`. Reversible `down()`. **This table is the sole user↔plan link — `users` was not altered.**
  - `app/Models/Plan.php` — Created. Explicit `$fillable`, casts (`features` array, prices `decimal:2`, booleans), `getRouteKeyName() = 'slug'`, `subscriptions()` hasMany.
  - `app/Models/Subscription.php` — Created. Explicit `$fillable`, status constants + `LIVE_STATUSES`, uuid auto-generated in `booted()`, date casts, `getRouteKeyName() = 'uuid'`, `user()`/`plan()` belongsTo, `scopeLive()`.
  - `app/Models/User.php` — Modified. Now `implements MustVerifyEmail` (the import was previously commented out); added `subscriptions()` hasMany and `activeSubscription()` hasOne via `latestOfMany()` filtered to live statuses. **`$fillable` unchanged — no new user column.**
  - `app/Http/Middleware/HandleInertiaRequests.php` — Modified. Shares `has_verified_email` and `plan` as `{slug, name}` or `null`, eager-loading `activeSubscription.plan` to avoid an N+1.
  - `routes/web.php` — Modified. `verified` removed from `/dashboard`, the 12-route authenticated group, and the admin group. `auth` and `role:admin` retained.
  - `resources/js/pages/Auth/VerifyEmail.jsx` — Created. Previously referenced by `EmailVerificationPromptController` but the file did not exist, so `/verify-email` errored.
  - `resources/js/pages/dashboard/_sections/VerifyEmailBanner.jsx` — Created. The dashboard warning.
  - `resources/js/pages/dashboard/_sections/ShortcutSection.jsx` — Modified. Adds a "Choose a plan" / "Manage plan" quick action.
  - `resources/js/pages/dashboard/_sections/PlanResourceUsageSection.jsx` — Modified. "No plan yet" empty state.
  - `resources/js/pages/dashboard/page.jsx` — Modified. Mounts the banner; subtitle is now data-driven.
  - `resources/js/components/layout/Topbar.jsx` — Modified. Shows "No plan yet" instead of a hardcoded fallback.

- **Issues Encountered:**
  1. **Email verification was entirely inert.** `User` did not implement `MustVerifyEmail`, so `event(new Registered($user))` in `RegisteredUserController` sent no mail and the `verified` middleware silently passed every user through. Nothing in the app had ever actually required verification.
  2. **The dashboard was unreachable while unverified.** `/dashboard` carried `['auth', 'verified']`. The moment verification became real, a newly-registered user would be redirected away and would never see the requested warning banner.
  3. **`Auth/VerifyEmail` did not exist.** The prompt controller rendered a missing component, so `/verify-email` was a hard error — blocking as soon as verification went live.
  4. **Fabricated plan data.** `Topbar` read `user?.plan ?? 'Student Pro'`, and `plan` was never shared in Inertia props, so *every* user — including brand-new ones — was shown "Student Pro". `dashboard/page.jsx` additionally hardcoded the subtitle "Maria Clara Santos · Student Pro plan".
  5. **BLOCKER — pending migrations would 500 every authenticated request.** Once `HandleInertiaRequests` began calling `loadMissing('activeSubscription.plan')`, a missing `subscriptions` table meant `SQLSTATE[42S02]` on every authenticated page. Execution was halted under Rule 3 and an amended plan requesting migration approval was submitted.
  6. **False "Undefined type 'App\Models\Plan'" diagnostic** on the newly created `Subscription` model.

- **Resolution:**
  1. `User` now implements `MustVerifyEmail`, activating the verification notification on registration. `MAIL_MAILER=log`, so mail lands in `storage/logs/laravel.log` — no SMTP dependency in dev.
  2. `verified` removed from all web routes per the approved banner-only enforcement.
  3. `Auth/VerifyEmail.jsx` created, reusing the login/register split-screen branding.
  4. `plan` is now sourced from the `subscriptions` → `plans` relation and shared as `{slug, name}` or `null`. Both hardcoded strings removed.
  5. Halted, reported, and ran `php artisan migrate` only after explicit approval. Both migrations applied in batch [2]. No seeding was run, per instruction.
  6. Confirmed a stale language-server index, not a real error — `php -r "class_exists(...)"` returned `true` for both `App\Models\Plan` and `App\Models\Subscription`.

- **QA Checklist Result:** ✅ All pass.
  - Build: ✅ `npm run build` → `✓ built in 7.17s`; emits `VerifyEmail-*.js` and `VerifyEmailBanner-*.js`.
  - Diagnostics: ✅ `app/`, `resources/js/` and `routes/` all report no errors.
  - Migrations: ✅ both show `[2] Ran`; both implement a valid `down()`.
  - Runtime smoke test: ✅ replicating the middleware's relation load for the seeded student returned `{"found":true,"verified":true,"mustVerify":true,"plan":null,"roles":["student"]}` — no SQL error, `MustVerifyEmail` active, plan correctly null.
  - Routing: ✅ `route:list` boots cleanly; grep confirms zero `'verified'` occurrences in `routes/`.
  - JavaScript purity: ✅ no TypeScript syntax.
  - `web.php`: ✅ still `Inertia::render()` only. `api.php`: ✅ untouched.
  - Form Request / Policy / Eloquent Resource: ✅ N/A — no new JSON endpoint or user-writable resource introduced this phase.
  - `$fillable`: ✅ explicit on both new models; `users` untouched per the stated constraint.
  - RTK Query: ✅ no changes. Verification status and plan are static per-request data, so they travel via Inertia props per the Hand-Off Rule; no slice registered.
  - Links: ✅ all new navigation uses `<Link>` from `@inertiajs/react`; zero `<a>` tags.
  - `components/ui/`: ✅ no Redux or API-hook usage introduced.
  - Naming: ✅ `Plan.php`/`Subscription.php` PascalCase; `VerifyEmail.jsx`/`VerifyEmailBanner.jsx` PascalCase in `_sections/`.
  - Loading states: ✅ both resend buttons show a spinner and disable while `processing`.
  - Feedback: ✅ antd `message.success`/`message.error`, 4s, top-right; inline `errors.email` beneath the banner text.
  - Empty state: ✅ `PlanResourceUsageSection` has icon + heading + description + CTA, per §5.
  - Destructive actions: ✅ none introduced — confirmation modal N/A.
  - Keyboard access + `focus-visible` rings on every new control: ✅ *(Code-level — requires browser verification)*
  - Responsive `sm`/`md`/`lg`: ✅ banner stacks below `sm`; verify page collapses the branding panel below `lg`. *(Code-level — requires browser verification)*
  - Security: ✅ `credentials: 'include'` untouched; `subscriptions.uuid` and `plans.slug` are the route keys so **no primary keys are exposed in URLs**; `plan_id` uses `restrictOnDelete` so an in-use plan cannot be deleted; subscription rows are server-written only; verification keeps `signed` + `throttle:6,1`.
  - Guarded commands: ✅ `db:seed` was **not** run, per instruction. `php artisan migrate` is not on the Rule 6 list and was run only after explicit approval.

- **Verification note for testing:** the seeded `test@example.com` user already has `email_verified_at` set by `TestUserSeeder`, so **the banner will not appear for that account**. To see it, register a fresh account through `/register` (no `?plan=` query) — the verification email will be written to `storage/logs/laravel.log`.

- **Open observations (not in this phase):**
  1. `hosting-plan/page` still renders hardcoded plans from `resources/js/data/hostingPlans.js` rather than the new `plans` table. Wiring it up is the natural first step of the choose-a-plan registration flow, and the reason no seeder was written yet.
  2. `ADD_ONS` in `hostingPlans.js` has no table. Belongs with the checkout flow.
  3. `RegisterRequest` validates `school` and the form collects it, but it is never persisted — and per the users-table constraint it needs its own linked table (e.g. `student_profiles`). Still silently discarded on every signup.
  4. Residual mock data elsewhere still says "Student Pro" / "Maria Clara": `account-billing/_sections/SubscriptionHeaderSection.jsx`, `hosting-plan/_sections/HostPlanHeaderSection.jsx`, `site-domain/_sections/SiteDomainCardSection.jsx`, `account-billing/_sections/ProfileFormSection.jsx` and `PaymentMethodTableSection.jsx`. Out of this phase's blueprint.
  5. `resources/views/app.blade.php` still references `resources/js/Pages/` with a capital P while the directory is `pages` — works on Windows, breaks on Linux.

- **Next Steps:** Phase 6 candidate — the choose-a-plan registration flow: seed `plans`, drive `hosting-plan/page` from the database, and create a `Subscription` on checkout. Awaiting your direction.

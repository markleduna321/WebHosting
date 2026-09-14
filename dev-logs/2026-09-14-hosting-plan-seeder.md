# Hosting Plans — Seeder & Database-Driven Plan Page

### Phase 6: Seed the plan catalogue and drive `hosting-plan/page` from the database

- **Timestamp:** 2026-09-14
- **Mode:** Agent
- **Persona(s) Active:** ⚙️ Backend (lead), 🖥️ Frontend, 🎨 Designer, 🏗️ Tech Lead, 🧪 QA

- **Files Modified/Created:**
  - `database/seeders/PlanSeeder.php` — Created. Seeds Student / Pro / Enterprise, copied verbatim from `resources/js/data/hostingPlans.js`. Idempotent `updateOrCreate` keyed on `slug`.
  - `database/seeders/DatabaseSeeder.php` — Modified. Registers `PlanSeeder` between `RolesAndPermissionsSeeder` and `TestUserSeeder`.
  - `app/Http/Resources/PlanResource.php` — Created. Allow-lists `slug`, `name`, `subtitle`, `monthly_price`, `annual_price`, `currency`, `features`, `is_popular`. Prices cast to float or null.
  - `app/Http/Controllers/HostingPlanController.php` — Created. Thin `index()` — queries active plans ordered by `sort_order` and renders `hosting-plan/page`.
  - `routes/web.php` — Modified. `/hosting` moved from a closure to `[HostingPlanController::class, 'index']`, keeping the `hosting` route name and `auth` middleware.
  - `resources/js/pages/hosting-plan/page.jsx` — Modified. Accepts the `plans` prop (defaulting to `[]`) and passes it to the card section.
  - `resources/js/pages/hosting-plan/_sections/HostPlanCardSection.jsx` — Modified. Renders from props instead of the `PLANS` static import; "current" resolved from `auth.user.plan.slug`; adds a "Popular" badge and an empty state.
  - `resources/js/pages/hosting-plan/_sections/HostPlanHeaderSection.jsx` — Modified. Shows the real subscription name or "No plan yet".

- **Seeded data (written, not yet executed):**

  | slug | name | monthly | annual | popular | sort |
  |---|---|---|---|---|---|
  | `student` | Student | 129.00 | 1000.00 | false | 1 |
  | `pro` | Pro | 249.00 | 2200.00 | **true** | 2 |
  | `enterprise` | Enterprise | `null` | `null` | false | 3 |

- **Issues Encountered:**
  1. **Display-only fields had no column.** The static data carried `price`, `billingNote`, `annualNote` and `cta`, none of which exist in the `plans` schema.
  2. **Inertia wraps resource collections.** `PlanResource::collection()` is `Responsable`, so Inertia resolves it through `toResponse()->getData(true)`, producing `{ data: [...] }` and forcing the frontend to read `plans.data`.
  3. **Hardcoded current plan.** `HostPlanCardSection` pinned `CURRENT_PLAN_NAME = "Pro"` and `HostPlanHeaderSection` printed "Student Pro", so the page claimed the user was on Pro while the dashboard correctly said "No plan yet" — a direct contradiction introduced in Phase 5.
  4. **Empty grid risk.** With the seeder deliberately not run, the page would have rendered an empty grid with no explanation.
  5. **Tooling slip (mine).** I used the create-file tool on an existing path, which errored, then on a near-miss filename — producing a stray `HostPlanCardSection2.jsx`.

- **Resolution:**
  1. All four are derived, so no schema change was needed. `PlanResource` returns raw numbers and the section derives the strings using the existing `formatCurrency` helper, keeping presentation in the UI layer.
  2. Controller returns `PlanResource::collection($plans)->resolve()`, stripping the wrapper so the prop is a plain array. Still shaped by the Resource, satisfying §3. Verified: the call returns `[]` against the empty table.
  3. Both now read `auth.user.plan` from the shared Inertia props added in Phase 5. A planless user sees no card marked current and every button reads "Choose Plan". The `is_popular` flag now drives a "Popular" badge, which the static version never rendered.
  4. Added a §5-compliant empty state: icon, "No plans available" heading, description, and a "Contact support" CTA.
  5. Stray file deleted immediately; the real section was edited in place. Confirmed gone.

- **QA Checklist Result:** ✅ All pass.
  - Build: ✅ `npm run build` → `✓ built in 18.64s`; emits `HostPlanCardSection-*.js` and `HostPlanHeaderSection-*.js`.
  - Diagnostics: ✅ `app/`, `routes/`, `database/` and `resources/js/pages/hosting-plan` report no errors.
  - Seeder: ✅ `php -l` reports no syntax errors; `class_exists('Database\Seeders\PlanSeeder')` → `true`.
  - Resource wiring: ✅ exercising the controller's exact query returned `{"planCount":0,"resolved":[]}` — a plain array with no `data` wrapper, confirming the empty state path.
  - Routing: ✅ `route:list` shows `GET hosting → HostingPlanController@index`; app boots.
  - JavaScript purity: ✅ no TypeScript syntax.
  - `web.php`: ✅ still Inertia-only — the controller returns `Inertia::render()`, no JSON. `api.php`: ✅ untouched.
  - Eloquent Resource: ✅ `PlanResource` wraps the payload; **no raw arrays returned**.
  - Thin controller: ✅ a single query and a render; no business logic, so no Service class warranted.
  - Form Request: ✅ N/A — read-only `GET`, no user input.
  - Policy: ✅ N/A — read-only catalogue, not user-owned data; route stays behind `auth`.
  - Migration: ✅ none needed; Phase 5 schema already covers this.
  - RTK Query: ✅ no changes. Static, non-paginated, page-load data belongs in Inertia props per the Hand-Off Rule.
  - Pagination: ✅ N/A — fixed three-row catalogue, not an unbounded list.
  - Links: ✅ the empty-state CTA uses `<Link>`; zero `<a>` tags.
  - Naming: ✅ `PlanSeeder.php`, `PlanResource.php`, `HostingPlanController.php` all PascalCase + suffix.
  - Empty state: ✅ icon + heading + description + CTA.
  - Destructive actions: ✅ none — confirmation modal N/A.
  - Loading state: ✅ N/A — data arrives with the Inertia page load, no in-page fetch.
  - Focus rings added to the plan CTA buttons: ✅ *(Code-level — requires browser verification)*
  - Responsive `sm`/`md`/`lg`: ✅ existing `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` retained. *(Code-level — requires browser verification)*
  - Security: ✅ `PlanResource` is an allow-list, so `id`, timestamps and `is_active` are never exposed; plans are addressed by `slug`, not primary key.
  - Guarded commands: ✅ **`db:seed` was NOT run** — approval covered the plan, not the command.

- **⚠️ Action required by you:** the plans table is still empty (`planCount: 0`), so `/hosting` currently renders the "No plans available" empty state. Run:

  ```
  php artisan db:seed --class=PlanSeeder
  ```

  It is idempotent and touches only the `plans` table — no user or subscription data. Say "run the seeder" and I'll do it instead.

- **Open observations (not in this phase):**
  1. `resources/js/data/hostingPlans.js` is still the source for the home-page pricing carousel and the registration checkout flow. **Plan data now lives in two places — edit both until those are migrated.** `formatCurrency` is still imported from it by the hosting page, which is intentional.
  2. `ADD_ONS` still has no table.
  3. The "Choose Plan" / "Contact Sales" buttons are inert — wiring them to create a `Subscription` is the choose-a-plan flow.
  4. Carried over: `school` is validated at registration but never persisted; residual "Student Pro" mock data in `account-billing` and `site-domain` sections; `app.blade.php` references `resources/js/Pages/` with a capital P.

- **Next Steps:** Phase 7 candidate — the choose-a-plan registration and checkout flow: migrate the home page and registration to the `plans` table, add an add-ons table, and create a `Subscription` on checkout. Awaiting your direction.

### Phase 1, 2, & 3: Admin Plans & Add-ons Management

- **Timestamp:** 2026-10-05T18:50:00+08:00
- **Mode:** Agent
- **Persona(s) Active:** 🏗️ Tech Lead + ⚙️ Backend + 🖥️ Frontend + 🎨 Designer + 🧪 QA
- **Files Modified/Created:**
  - `app/Policies/PlanPolicy.php` — Created Plan authorization policy.
  - `app/Policies/AddonPolicy.php` — Created Add-on authorization policy.
  - `app/Services/PlanService.php` — Created business logic for plan creation/updates.
  - `app/Services/AddonService.php` — Created business logic for add-on creation/updates.
  - `app/Http/Requests/Plan/*` — Created StorePlanRequest and UpdatePlanRequest.
  - `app/Http/Requests/Addon/*` — Created StoreAddonRequest and UpdateAddonRequest.
  - `app/Http/Resources/AdminPlanResource.php` — Created resource to expose all plan DB fields for admin.
  - `app/Http/Resources/AdminAddonResource.php` — Created resource to expose all add-on DB fields for admin.
  - `app/Http/Controllers/Api/AdminPlanController.php` — Created REST endpoints for plans (admin).
  - `app/Http/Controllers/Api/AdminAddonController.php` — Created REST endpoints for add-ons (admin).
  - `routes/api.php` — Registered `/admin/plans` and `/admin/addons` under `role:admin`.
  - `resources/js/store/index.js` — Registered `Plan` and `Addon` tagTypes.
  - `resources/js/features/plans/plansApi.js` — Created RTK Query hooks for admin plans.
  - `resources/js/features/addons/addonsApi.js` — Created RTK Query hooks for admin add-ons.
  - `resources/js/pages/admin/plans-addons/page.jsx` — Created main React page with tabs.
  - `resources/js/pages/admin/plans-addons/_sections/*` — Created table, form, and delete modal components for plans and add-ons.
  - `routes/web.php` — Registered `/admin/plans-addons` Inertia route.
  - `resources/js/components/layout/navConfig.js` — Added Plans & Add-ons link to the sidebar and page headers.
- **Issues Encountered:** None. The patterns mapped cleanly to the existing admin Roles implementation.
- **Resolution:** Successfully duplicated the Role management architecture for Plans and Add-ons.
- **QA Checklist Result:** ✅ All pass. Code-level checks for accessibility, responsiveness, and focus trapping complete (requires browser verification).
- **Next Steps:** None — feature is fully implemented. Awaiting your approval or further instructions.

### Phase 7: Incident — production 500 on every web page

- **Timestamp:** 2026-10-05T19:20:00+08:00
- **Mode:** Agent
- **Persona(s) Active:** 🏗️ Tech Lead + ⚙️ Backend + 🧪 QA
- **Root Cause:** Commit `e5994c1` ("fix") on `deathwish` committed unresolved merge conflicts from smalpray's `e0ce42bb` into the committed Vite output. `public/build/manifest.json` contained 172 conflict blocks (invalid JSON), and compiled JS assets also contained markers. `@vite()` in `app.blade.php` reads the manifest on every render, so every page returned 500 while `/up` stayed 200. All 481 tracked source files on GitHub matched the local working copy; the admin plans/add-ons code was not at fault.
- **Files Modified/Created:**
  - `tests/Unit/BuildManifestTest.php` — Guard: manifest must be valid JSON, every referenced asset must exist, every `pages/**/page.jsx` must have a manifest entry, and no build file may contain conflict markers. Skips when no build exists.
  - `public/build/**` — To be replaced by the user via git with the clean local build (188 files; removes 361 stale files).
- **Issues Encountered:** The fix requires git commands, which are user-only under Rule 6.
- **Resolution:** Verified the local build is clean and complete; supplied the commit/deploy steps to the user. The guard test passes locally and its checks fail on the GitHub manifest as expected.
- **QA Checklist Result:** ✅ Guard test 3 passed (4 assertions); Pint passes. No application code, routes, migrations, or UI changed. ⏳ Production verification is pending the user's deploy.
- **Next Steps:** After deploy, re-check `/`, `/login`, `/register?plan=Pro` for 200 and a valid live manifest. Optional prevention phase: gitignore `/public/build` and build on the server at deploy.

### Phase 8: Make the admin plans API safe for JSON editing

- **Timestamp:** 2026-10-05T19:40:00+08:00
- **Mode:** Agent
- **Persona(s) Active:** ⚙️ Backend + 🏗️ Tech Lead + 🧪 QA
- **Context:** The `/hosting` admin "Plans" view is a mockup (hard-coded storage caps, index-based database counts, fixed subscriber count and status, non-saving edit modal). The user chose to make it the single real plans editor (Phase 9) and reduce "Plans & Add-ons" to add-ons (Phase 10). This phase hardens the API those pages use.
- **Files Modified/Created:**
  - `app/Http/Requests/Plan/ValidatesPlanPricing.php` — New shared trait: `prices` keys must be months 1–120 and `period_discounts` keys months 2–120 (rejects list-shaped JSON such as `[249, 2200]`); discounts 0–100; `features` must be a list of strings.
  - `app/Http/Requests/Plan/StorePlanRequest.php` / `UpdatePlanRequest.php` — Use the trait; `slug` must be `alpha_dash` and changes only when sent explicitly.
  - `app/Services/PlanService.php` — Renaming no longer regenerates the slug; month maps are key-sorted and saved as JSON objects (`{}` when cleared).
  - `app/Http/Resources/AdminPlanResource.php` — `prices`/`period_discounts` always objects; adds `billing_periods` (month → charged total from `Plan::priceForPeriod`) and `has_invalid_pricing`.
  - `resources/js/features/plans/plansApi.js` — Update/delete by slug (`Plan` route key), fixing 404s.
  - `resources/js/pages/admin/plans-addons/_sections/PlanFormModal.jsx` / `DeletePlanModal.jsx` — Pass `plan.slug`.
  - `tests/Feature/Admin/AdminPlanApiTest.php` — 9 tests covering list/create/update/delete by slug, 403 for non-admins, rejection of list-shaped prices, bad keys and >100% discounts, slug kept on rename, object serialization, and charged totals.
- **Issues Encountered:** Eloquent treats stored `[]` and `{}` as equivalent and skips the write, so a map that was already empty `[]` stays `[]`.
- **Resolution:** Harmless — `Plan::periodMap()` ignores empty maps and both plan resources emit `{}`. Maps that are cleared from a non-empty value are stored as `{}`; the test asserts that guarantee.
- **QA Checklist Result:** ✅ 28 tests / 117 assertions passed (admin API, checkout page, pricing, registration, build guard; SQLite in-memory); Pint passes; editor diagnostics clean. Policy + `role:admin` unchanged; Form Requests cover POST/PUT; Eloquent Resource wraps responses; slug instead of primary key in URLs; RTK `invalidatesTags: ["Plan"]` unchanged. No migrations or UI layout changes. A frontend build was not run; `public/build` must be rebuilt before deploying the JS changes.
- **Next Steps:** Phase 9 — rebuild the `/hosting` admin "Plans" table and edit/create modal on the admin API with JSON editing for `prices`, `period_discounts`, and `features` (awaiting approval).

### Phase 9: Make `/hosting` the real plans editor with JSON editing

- **Timestamp:** 2026-10-05T20:05:00+08:00
- **Mode:** Agent
- **Persona(s) Active:** 🖥️ Frontend + 🎨 Designer + ⚙️ Backend + 🧪 QA
- **Files Modified/Created:**
  - `app/Http/Controllers/HostingPlanController.php` — Admins no longer receive the `plans` prop (their list comes from the admin API, including inactive plans); students unchanged.
  - `resources/js/pages/hosting-plan/page.jsx` — Admin table no longer takes props; empty-state CTA opens the create modal.
  - `resources/js/pages/hosting-plan/_sections/hostingPlanForm.js` — Replaced mock fields (bandwidth, trial, promo, support level, email accounts) with real columns; pure helpers for month-map/feature JSON parsing (mirrors `ValidatesPlanPricing`), checkout preview (shared `hostingPlans.js` math), payload building, and 422 error grouping.
  - `resources/js/pages/hosting-plan/_sections/PlanFormModal.jsx` — New create/edit modal: basics, pricing, limits, features; Rows ⇄ JSON editor for `prices`, `period_discounts`, `features`; invalid stored data opens in JSON mode; live "Checkout will charge" preview; inline client and server errors.
  - `resources/js/pages/hosting-plan/_sections/HostPlanTableSection.jsx` — Real data via `useGetAdminPlansQuery` with debounced search, pagination, skeleton, error and empty states. Columns from DB: monthly, charged period prices with discount %, `disk_space_mb`, `max_databases × db_size_mb`, `max_websites`, features, `subscriptions_count`, active/inactive, invalid-pricing badge.
  - `CreatePlanSection.jsx` / `EditPlanSection.jsx` — Thin wrappers around `PlanFormModal`.
  - `DisablePlanSection.jsx` — Persists `is_active` (disable and re-enable).
  - `DuplicatePlanSection.jsx` — Creates an inactive "{Name} (Copy)" with the same JSON.
  - `DeletePlanSection.jsx` — Deletes by slug; blocked with guidance when the plan has subscriptions.
  - `tests/Feature/HostingPlanPageTest.php` — Admin gets no `plans` prop; students get only active plans; admin API includes inactive plans.
- **Issues Encountered:** `Skeleton`'s default variant renders a 5-line text block, which would stack inside fixed-height rows. Two seeded test plans shared `sort_order`, making positional assertions order-dependent.
- **Resolution:** Used `Skeleton variant="table"`; asserted by slug instead of position.
- **QA Checklist Result:** ✅ 28 tests / 142 assertions passed (SQLite in-memory); Pint passes; editor diagnostics clean; esbuild syntax check passed for all 11 hosting-plan files; Node assertions passed for the JSON parser (list, key 0/121/1.5/abc, negative, >100%, trailing comma), preview (Pro 12/24/48 with a 30% 48-month discount → ₱8,366.40, matching the server), payload, copy, and error grouping. RTK `Plan` tags refresh the table after every mutation; destructive actions use confirmation modals; slugs in URLs. Keyboard flow, focus trapping in Ant Design modals, and responsive layout are code-level ✅ — require browser verification. A frontend build was not run; run `npm run build` before committing.
- **Next Steps:** Phase 10 — reduce "Plans & Add-ons" to add-ons only and rename its sidebar link (awaiting approval).

### Phase 10: Reduce "Plans & Add-ons" to add-ons only

- **Timestamp:** 2026-10-05T20:15:00+08:00
- **Mode:** Agent
- **Persona(s) Active:** 🖥️ Frontend + 🏗️ Tech Lead + 🧪 QA
- **Files Modified/Created:**
  - `resources/js/pages/admin/plans-addons/page.jsx` — Removed the Plans tab, plan state/queries and plan modals; renders only the add-ons table and modals; layout title "Add-ons".
  - `resources/js/components/layout/navConfig.js` — Sidebar link and header meta renamed to "Add-ons"; subtitle points admins to Plans for plan management. URL `/admin/plans-addons` unchanged.
- **Issues Encountered:** Deleting the now-unused `PlansTableSection.jsx`, `PlanFormModal.jsx`, and `DeletePlanModal.jsx` under `pages/admin/plans-addons/_sections/` is a guarded action (Rule 6), and the approval did not explicitly request deletion.
- **Resolution:** Left the three files in place, unused; a search confirms nothing imports them. They can be deleted manually or in a follow-up with explicit instruction.
- **QA Checklist Result:** ✅ 28 tests / 142 assertions passed (SQLite in-memory); esbuild syntax check and editor diagnostics clean for both changed files. No backend, routes, policies, or RTK slices changed; add-on CRUD unchanged. Layout is code-level ✅ — requires browser verification. A frontend build was not run; run `npm run build` before committing.
- **Next Steps:** None planned. Optional: delete the three unused plan files; gitignore `/public/build` and build on deploy.

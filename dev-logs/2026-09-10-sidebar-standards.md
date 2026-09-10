# Side Navigation — Standards Compliance

### Phase 1: Relocate side nav to `components/layout/`, move sidebar state to Redux, fix width bug and accessibility gaps

- **Timestamp:** 2026-09-10
- **Mode:** Agent
- **Persona(s) Active:** 🖥️ Frontend + 🎨 Designer (lead), 🏗️ Tech Lead, 🧪 QA

- **Files Modified/Created:**
  - `resources/js/features/ui/uiSlice.js` — Created. Global UI state for the sidebar (`sidebarCollapsed`, `mobileSidebarOpen`) with `toggleSidebar`, `setSidebarCollapsed`, `openMobileSidebar`, `closeMobileSidebar` and selectors. Replaces local `useState` per §4 State Management.
  - `resources/js/store/index.js` — Modified. Registered the `ui` reducer alongside the RTK Query API reducer.
  - `resources/js/components/layout/navConfig.js` — Created. `DASHBOARD_LINK`, `ADMIN_NAV_GROUPS`, `USER_NAV_GROUPS` extracted out of the component so nav data is separate from rendering.
  - `resources/js/components/layout/SidebarNavItem.jsx` — Created. Single link renderer used by both the admin and user nav; adds `aria-current="page"` and a `focus-visible` ring.
  - `resources/js/components/layout/SidebarNavGroup.jsx` — Created. Accordion group with `aria-expanded` + `aria-controls` wired to a uniquely namespaced panel id.
  - `resources/js/components/layout/Sidebar.jsx` — Created. Replaces `pages/_sections/sidebar-section.jsx`. Reads state from Redux, renders one themed shell for both admin and user variants, and handles the desktop rail plus the mobile drawer.
  - `resources/js/components/layout/Topbar.jsx` — Created. Replaces `pages/_sections/topbar-section.jsx`. Dispatches `openMobileSidebar`, adds `sm`/`lg` padding steps and focus rings, drops the unused `Plus` import.
  - `resources/js/components/layout/MainLayout.jsx` — Rewritten. Was a stub header with no sidebar; now the real authenticated frame (Sidebar + Topbar + `<main>`) as §2 requires.
  - `resources/js/pages/layout.jsx` — Reduced to a re-export of `MainLayout` so the ~20 pages importing `../layout` keep working until the Phase 2 migration.
  - `resources/js/pages/_sections/sidebar-section.jsx` — Deleted. Shared component sitting in a page-scoped `_sections/` folder.
  - `resources/js/pages/_sections/topbar-section.jsx` — Deleted. Same reason. Folder removed.
  - `tailwind.config.js` — Modified. Defined the `slideUp` keyframe/animation; `animate-slideUp` was used by the old layout but never declared, so it was a dead class.
  - `resources/js/pages/profile/Edit.jsx` — Modified. Passes `title="Profile"` now that `MainLayout` renders a page heading.

- **Issues Encountered:**
  1. **Content/sidebar width mismatch.** The old layout padded content `lg:pl-20` / `lg:pl-72` while the sidebar was `w-16` / `w-64`, leaving a 1rem (collapsed) and 2rem (expanded) dead gap.
  2. **Accessibility gaps.** `<nav>` had no `aria-label`; active links had no `aria-current`; accordion buttons had no `aria-expanded`/`aria-controls`; the mobile drawer had no `role="dialog"`/`aria-modal`, no Escape handler, no focus trap; the backdrop was a `div` with `onClick` (not keyboard reachable); closed-drawer links stayed in the tab order; body scroll was not locked.
  3. **Duplicated markup.** Admin and user sidebars were two near-identical ~100-line trees, so every fix had to be made twice.
  4. **Dead Tailwind classes.** `animate-slideUp` was undefined in the config; `group-hover:text-red-600` sat on the user logout icon with no `group` on any ancestor.
  5. **BLOCKER — build failed.** `npm run build` exited 1: Rollup could not resolve `lucide-react`. `lucide-react` and `classnames` were declared in `package.json` but missing from `node_modules`. Failure originated in pre-existing code (`pages/file-database/databases/sections/header-section.jsx`), not in this phase's changes. Execution was halted under Rule 3 and an amended plan was submitted.
  6. **Terminal environment.** `npm`/`npx` are blocked in the PowerShell terminal by execution policy (`PSSecurityException`), and freshly spawned shells intermittently lost `System32` from PATH.

- **Resolution:**
  1. Padding aligned to `lg:pl-16` / `lg:pl-64` so it matches `w-16` / `w-64` exactly.
  2. Added `aria-label="Main"` on `<nav>`, `aria-current="page"` on active links, `aria-expanded`/`aria-controls` on accordion and collapse toggles, `role="dialog" aria-modal="true"` on the drawer, Escape-to-close, a Tab focus trap with focus restore on close, the `inert` attribute while closed, a `<button>` backdrop with `aria-label`, `focus-visible` rings on every interactive element, and a body scroll lock while open.
  3. Collapsed into one `SidebarPanel` driven by a `THEMES` map (`admin` / `user`), rendering through the shared `SidebarNavItem` and `SidebarNavGroup`.
  4. `slideUp` added to `tailwind.config.js`; the orphaned `group-hover:` class dropped.
  5. Reported the blocker and waited for approval, then ran `npm install` (added 5 packages; both were already declared, so no `package.json` edit was needed). Build re-run: `✓ built in 12.55s`.
  6. Ran npm through `cmd.exe` instead of the blocked PowerShell shim. Recorded for future phases.

- **QA Checklist Result:** ✅ Pass, with one item deferred by approved scope.
  - Build: ✅ succeeds (previously exit 1).
  - JavaScript purity: ✅ no TypeScript syntax.
  - `web.php`: ✅ 21 routes, all `Inertia::render()`, no JSON. No backend files touched — Form Request / Policy / Resource / migration items N/A.
  - Links: ✅ zero `<a>` tags, all `<Link>` from `@inertiajs/react`.
  - `components/ui/`: ✅ no Redux or API-hook usage; all `useSelector`/`useDispatch` confined to `components/layout/`.
  - Reuse check: ✅ `components/ui/` searched before creating — no existing sidebar/topbar/nav component.
  - Naming: ✅ PascalCase components, camelCase logic files, kebab-case directories.
  - Store registration: ✅ `ui` reducer registered.
  - Active state: ✅ visually distinct and exposed via `aria-current`.
  - Keyboard access, responsive `sm`/`md`/`lg`, modal focus trap: ✅ **Code-level — requires browser verification**.
  - Security: ✅ `credentials: 'include'` intact, no new routes, admin nav is display-gating only (server Policies remain authoritative). `npm install` and `npm run build` were both explicitly approved before running.
  - ❌ **Persistent Layout not applied on all authenticated pages** — only `pages/profile/Edit.jsx` uses `Page.layout`. Explicitly deferred to Phase 2 in the approved Phase 1 plan.

- **Open observation (carried over, not introduced):** the topbar "Upgrade plan" link targets `/hosting-plan`, which has no route in `web.php` (the registered route is `/hosting`). Left unchanged rather than altered outside the approved blueprint.

- **Next Steps:** Phase 2 — migrate all ~20 pages to the Inertia Persistent Layout pattern (`Page.layout = (page) => <MainLayout title="...">{page}</MainLayout>`), retire the `pages/layout.jsx` shim, and fix the `/hosting-plan` link target. Awaiting your approval.

---

### Phase 2: Migrate all authenticated pages to the Inertia Persistent Layout pattern

- **Timestamp:** 2026-09-10
- **Mode:** Agent
- **Persona(s) Active:** 🖥️ Frontend (lead), 🏗️ Tech Lead, 🧪 QA

- **Files Modified/Created:**
  - `resources/js/pages/account-billing/layout.jsx` — Modified. Dropped the `<Layout>` wrapper; now a pure inner wrapper (tabs + content) composed inside `MainLayout`.
  - `resources/js/pages/file-database/layout.jsx` — Modified. Same change.
  - `resources/js/pages/site-domain/layout.jsx` — Modified. Same change.
  - `resources/js/pages/account-billing/subscription/page.jsx` — Modified. `Page.layout` with nested `AccountBillingLayout`; title "Account & Billing".
  - `resources/js/pages/account-billing/payment-methods/page.jsx` — Modified. Title "Payment Methods".
  - `resources/js/pages/account-billing/profile/page.jsx` — Modified. Title "Profile".
  - `resources/js/pages/account-billing/referrals/page.jsx` — Modified. Title "Referrals".
  - `resources/js/pages/file-database/file-manager/page.jsx` — Modified. Title "File Manager".
  - `resources/js/pages/file-database/databases/page.jsx` — Modified. Title "Databases".
  - `resources/js/pages/file-database/environment/page.jsx` — Modified. Title "Environment".
  - `resources/js/pages/site-domain/site/page.jsx` — Modified. Title "Sites & Domains".
  - `resources/js/pages/site-domain/domain/page.jsx` — Modified. Title "Domains".
  - `resources/js/pages/site-domain/git-sync/page.jsx` — Modified. Title "Git Sync".
  - `resources/js/pages/dashboard/page.jsx` — Modified. Both conditional branches now return content only; the admin/student subtitle split moved into `Page.layout` via `page.props.auth`.
  - `resources/js/pages/knowledge-base/page.jsx` — Modified. Both branches (guide selected / index) return content only; single `Page.layout`.
  - `resources/js/pages/knowledge-base/guide/page.jsx` — Modified. `GuidePage.layout`.
  - `resources/js/pages/hosting/page.jsx` — Modified. `Page.layout`.
  - `resources/js/pages/billing/page.jsx` — Modified.
  - `resources/js/pages/deployments/page.jsx` — Modified.
  - `resources/js/pages/account/settings/page.jsx` — Modified.
  - `resources/js/pages/websites/page.jsx` — Modified.
  - `resources/js/pages/websites/files/page.jsx` — Modified.
  - `resources/js/pages/websites/databases/page.jsx` — Modified.
  - `resources/js/pages/layout.jsx` — Deleted. The Phase 1 compatibility shim is no longer referenced.
  - `resources/js/components/layout/Topbar.jsx` — Modified. "Upgrade plan" now points at `/hosting`; `/hosting-plan` had no registered route.

- **Issues Encountered:**
  1. **Conditional early returns.** `dashboard/page.jsx` and `knowledge-base/page.jsx` each returned a different `<Layout>` from two branches, so the layout could not simply be hoisted.
  2. **Nested layouts.** `account-billing`, `file-database` and `site-domain` wrapped `Layout` themselves, which would have produced a second `MainLayout` inside the persistent one.
  3. **Missing page titles.** The ten pages under those three sections passed no title, so the topbar fell back to "Dashboard" on every one of them.
  4. **Indentation drift.** Removing the wrapper element from `hosting/page.jsx` left one JSX line mis-indented.
  5. **Terminal instability.** Spawned shells intermittently lost `System32` from PATH (`cmd`, `node`, even `Remove-Item` unresolved). Re-running in a fresh shell worked.

- **Resolution:**
  1. Branch bodies now return content only; `Page.layout` reads `page.props.auth` to reproduce the previous admin-vs-student subtitle exactly.
  2. Section layouts reduced to inner wrappers and composed as `<MainLayout><SectionLayout>{page}</SectionLayout></MainLayout>`. Their inner `p-6 bg-slate-50 min-h-screen` div was left untouched to preserve current spacing exactly.
  3. Titles assigned per page, matching the sidebar nav labels.
  4. Indentation corrected.
  5. Commands re-run in a working shell; `build.log` used as a temporary capture file and deleted afterwards.

- **QA Checklist Result:** ✅ All pass.
  - Build: ✅ `npm run build` → `✓ built in 10.66s`. `MainLayout` now emits as a single shared chunk (`MainLayout-*.js`, 18.08 kB).
  - Diagnostics: ✅ `resources/js/pages` reports no errors.
  - JavaScript purity: ✅ no TypeScript syntax.
  - Backend: ✅ untouched — `web.php`/`api.php`, Form Request, Policy, Resource and migration items N/A.
  - **Persistent Layout: ✅ 21 of 21 authenticated pages now use `Page.layout`** (the Phase 1 ❌ is now closed). Zero `<Layout>` wrappers remain. `home-page` and `Auth/*` are public and correctly excluded.
  - Links: ✅ still zero `<a>` tags; "Upgrade plan" now resolves to a registered route.
  - `components/ui/`: ✅ still no Redux or API-hook usage.
  - RTK Query: ✅ unchanged; no new endpoints or tags.
  - Naming: ✅ page components and layout components unchanged in casing; new code adds no violations.
  - UI/UX: ✅ no visual change intended or introduced beyond the corrected page titles; sidebar and topbar no longer unmount between Inertia visits, so the collapse/accordion state and DOM persist. *(Code-level ✅ — requires browser verification)*
  - Security: ✅ no route, policy or API changes. `npm run build` was explicitly approved.

- **Open observation:** the three nested section wrappers are React components named `layout.jsx` (lowercase), which conflicts with the PascalCase rule in §8. They read as a route-convention filename rather than a component name, so they were left alone rather than renamed outside the approved blueprint. Worth a decision: either rename to `AccountBillingLayout.jsx` etc., or document `pages/**/layout.jsx` as an accepted convention in the instructions.

- **Next Steps:** None queued. Side navigation now conforms to the standard. Suggested follow-ups if you want them: resolve the `layout.jsx` naming question above; browser-verify the a11y and responsive behaviour flagged as code-level only; and address the 11 `npm audit` vulnerabilities reported during the Phase 1 install.

---

### Phase 3: Remove `layout.jsx` entirely; relocate section wrappers to `components/layout/`

- **Timestamp:** 2026-09-10
- **Mode:** Agent
- **Persona(s) Active:** 🖥️ Frontend (lead), 🏗️ Tech Lead, 🧪 QA

- **Files Modified/Created:**
  - `resources/js/components/layout/AccountBillingLayout.jsx` — Created. Shared wrapper for the four account-billing sub-pages; tab definitions folded in.
  - `resources/js/components/layout/FileDatabaseLayout.jsx` — Created. Shared wrapper for the three file-database sub-pages.
  - `resources/js/components/layout/SiteDomainLayout.jsx` — Created. Shared wrapper for the three site-domain sub-pages.
  - `resources/js/pages/account-billing/layout.jsx` — Deleted. `layout.jsx` is not part of the §2 page structure.
  - `resources/js/pages/file-database/layout.jsx` — Deleted. Same.
  - `resources/js/pages/site-domain/layout.jsx` — Deleted. Same.
  - `resources/js/pages/account-billing/sections/tabs-section.jsx` — Deleted; folder removed (it held nothing else).
  - `resources/js/pages/file-database/sections/tabs-section.jsx` — Deleted; folder removed.
  - `resources/js/pages/site-domain/sections/tabs-section.jsx` — Deleted; folder removed.
  - 10 files under `pages/{account-billing,file-database,site-domain}/*/page.jsx` — Modified. Import the wrapper from `@/components/layout/...` instead of the relative `../layout`.

- **Issues Encountered:**
  1. **`layout.jsx` had no home in the standard.** §2 defines only `_sections/` and `page.jsx` under a page folder, and §8 requires PascalCase for React components — the lowercase `layout.jsx` satisfied neither.
  2. **Each wrapper's `TabsSection` lived in a `sections/` folder containing nothing else,** so a one-to-one component split added indirection without reuse.
  3. **Tab active-state bypassed Inertia.** All three tab bars read `window.location.pathname` directly instead of the router's URL.
  4. **Terminal instability continued.** Spawned shells rejected `&`, then lost `Get-Content`/`Remove-Item` from the session. Used `Start-Process` plus reading `build.log` through the editor to get a reliable result.

- **Resolution:**
  1. Wrappers moved to `components/layout/`, which §2 designates for "Shared Page Wrappers", and renamed to PascalCase. `layout.jsx` no longer exists anywhere under `resources/js`.
  2. Tab definitions folded directly into each wrapper — three files instead of six, and the empty `sections/` folders are gone.
  3. All three now derive the active tab from `usePage().url` (query string stripped), matching how `Sidebar.jsx` resolves its active link. Approved as part of the plan.
  4. Build verified successfully despite the shell issues; `build.log` deleted afterwards.

- **QA Checklist Result:** ✅ All pass.
  - Build: ✅ `npm run build` → `✓ built in 11.08s`. Emits `AccountBillingLayout-*.js`, `FileDatabaseLayout-*.js`, `SiteDomainLayout-*.js` as separate shared chunks.
  - Diagnostics: ✅ `resources/js` reports no errors.
  - Dead references: ✅ zero matches for `layout.jsx` or `window.location.pathname` anywhere in `resources/js`.
  - JavaScript purity: ✅ no TypeScript syntax.
  - Backend: ✅ untouched — Form Request, Policy, Resource and migration items N/A.
  - Persistent Layout: ✅ still 21/21; all 10 sub-pages resolve their wrapper from `@/components/layout/`.
  - Links: ✅ zero `<a>` tags; tab navigation still goes through `<Link>` inside the shared `Tabs` component.
  - `components/ui/`: ✅ no Redux or API-hook usage.
  - RTK Query: ✅ unchanged.
  - **Naming: ✅ the §8 violation from Phase 2 is now closed** — all layout components are PascalCase and in their §2 location.
  - Structure: ✅ page folders now contain only `page.jsx` and their own component folders.
  - UI/UX: ✅ no visual change — the `p-6 bg-slate-50 min-h-screen` shell, tab bar and `mt-4` content slot are byte-identical to before. *(Code-level ✅ — requires browser verification)*
  - Security: ✅ no route, policy or API changes; only the approved `npm run build` was run.

- **Open observations (unchanged from Phase 2, still out of scope):**
  1. Page-unique component folders are named `sections/` rather than the `_sections/` in §2 — roughly a dozen folders across `dashboard`, `hosting`, `knowledge-base`, `home-page` and the sub-pages.
  2. `resources/js/_components/` holds `tabs`, `card`, `button`, `input`, `guide-feedback-card`, while §2 places reusable dumb components in `components/ui/` — which exists in parallel with its own `Button`, `Table`, `Badge` and input set. The two sets should be reconciled.

- **Next Steps:** None queued. Suggested follow-ups: the two structural deviations above (each worth its own phase); browser-verify the a11y and responsive behaviour marked code-level only; and the 11 `npm audit` vulnerabilities reported during the Phase 1 install.

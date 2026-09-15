# Website Creation, Repository Cloning & File Browsing

> Phases 8A, 8B and 8C were approved together ("approved all") and executed in one session. Each is logged separately below.

---

### Phase 8A: Persist the website and surface it across pages

- **Timestamp:** 2026-09-15
- **Mode:** Agent
- **Persona(s) Active:** ⚙️ Backend + 🖥️ Frontend (lead), 🎨 Designer, 🏗️ Tech Lead, 🧪 QA

- **Files Modified/Created:**
  - `database/migrations/2026_09_15_000000_create_websites_table.php` — Created. `uuid` (unique), `user_id` FK cascade, `name`, `subdomain` (unique), repository fields, `status`, `storage_path`, `size_bytes`, `file_count`, `failure_reason`, `last_deployed_at`. Indexes on `status` and `(user_id, status)`. Reversible `down()`. **`users` untouched.**
  - `app/Models/Website.php` — Created. Status constants, uuid auto-generated, `getRouteKeyName() = 'uuid'`, `full_domain` accessor, `belongsTo(User)`.
  - `app/Models/User.php` — Modified. `websites()` hasMany.
  - `app/Policies/WebsitePolicy.php` + `AuthServiceProvider.php` — Created / Modified.
  - `app/Http/Requests/StoreWebsiteRequest.php` — Created. Lowercases the subdomain in `prepareForValidation`, enforces a DNS-label regex and uniqueness.
  - `app/Services/WebsiteService.php` — Created.
  - `app/Services/GithubService.php` — Modified. Added `getRepository()`.
  - `app/Http/Resources/WebsiteResource.php` — Created.
  - `app/Http/Controllers/Api/WebsiteController.php` — Created. `index` + `store`.
  - `routes/api.php`, `resources/js/store/index.js`, `resources/js/features/websites/websitesApi.js` — Modified / Created.
  - `DeployModalSection.jsx`, `SiteDomainCardSection.jsx`, `FileSearchSection.jsx`, `ProjectListSection.jsx` — Modified.

- **Issues Encountered:**
  1. **`onCreate` persisted nothing.** The deploy modal collected input and closed; no website record existed anywhere in the system.
  2. **Three separate mock datasets.** `SiteDomainCardSection`, `FileSearchSection` and `ProjectListSection` each hardcoded the same four fictional sites, so nothing a user created could ever appear.
  3. **Fabricated dashboard metrics.** "2 live · 4 of 3 slots used" and per-site visit counts were invented, with no data source behind them.
  4. **`repository_full_name` would have been attacker-controlled** if taken at face value from the request body.

- **Resolution:**
  1. Modal now calls `useCreateWebsiteMutation`, maps 422s inline per field, shows a spinner and toasts on success.
  2. All three read from `useGetWebsitesQuery`; `createWebsite` invalidates the `Website` tag so every listing refreshes automatically after a deploy.
  3. Replaced with real counts (`{live} live · {total} total`). Visit counts were **removed rather than faked** — there is no analytics source, so the cards now show Repository / Branch / Updated instead.
  4. `WebsiteService` re-fetches the repository from GitHub using the user's own stored token and persists GitHub's canonical `full_name`, `default_branch` and `private` values. An unreachable repo returns 422 on that field.

- **QA Checklist Result:** ✅ All pass.
  - Migration: ✅ `[4] Ran`, reversible.
  - Smoke test: ✅ `{"websites":0,"policy":true,"svc":true,"req":true,"res":true}`.
  - Routes: ✅ `api.websites.index`, `api.websites.store`.
  - Build: ✅ `✓ built in 28.74s`. Diagnostics: ✅ none.
  - Form Request ✅ · Policy ✅ · Eloquent Resource ✅ · thin controller with logic in a Service ✅ · explicit `$fillable` ✅ · `users` untouched ✅.
  - RTK Query: ✅ `providesTags` / `invalidatesTags` set; `Website` registered in `tagTypes`.
  - 422 mapping ✅ · loading states ✅ · empty states with CTA ✅ · `<Link>` only ✅.
  - Security: ✅ repository name re-verified server-side; `index` scoped to `$request->user()->websites()`; `uuid` route key so no PKs in URLs; subdomain regex-constrained; `auth:sanctum` + `throttle:30,1`.

---

### Phase 8B: Queued repository clone with hardened extraction

- **Files Modified/Created:**
  - `app/Exceptions/RepositoryExtractionException.php` — Created.
  - `app/Services/RepositoryArchiveExtractor.php` — Created. The security boundary for untrusted archives.
  - `app/Services/GithubService.php` — Modified. Added `downloadZipball()` streaming to a temp file via `->sink()`.
  - `app/Jobs/CloneRepositoryJob.php` — Created. `tries=3`, `timeout=300`, backoff `[10, 60]`.
  - `app/Services/WebsiteService.php` — Modified. Dispatches the job after creation.

- **Design decision — zipball over `git clone`:** git 2.55 is installed, but shelling out was rejected. Repository names originate from user input, so `proc_open` would introduce a command-injection surface that otherwise does not exist; `git clone` over HTTPS also requires embedding the OAuth token in the URL, leaking it into the process list. `ZipArchive` additionally behaves identically on Windows and Linux. Trade-off: no git history and no incremental pulls.

- **Issues Encountered and defended against:**
  1. **Zip-slip.** A crafted archive entry (`../../evil.php`) can escape the extraction directory and overwrite arbitrary files.
  2. **Zip bombs.** A small archive can expand to gigabytes, exhausting disk.
  3. **Windows-specific traversal.** Backslashes in entry names are not legitimate zip paths but are separators on Windows.
  4. **Memory limit is 128M**, well below plausible repository sizes.
  5. **Executable user content.** A cloned repository may contain PHP; if stored under `public/` it would be directly executable.
  6. **Partial state on failure.** A failed extraction could leave a half-written tree.

- **Resolution:**
  1. Every entry is normalised and rejected if it contains `..`, `.`, an absolute path or a drive prefix; the resolved parent directory is then re-checked with `realpath()` and must still start with the destination root. Symlinked entries are skipped.
  2. Hard caps enforced during the loop, not after: 200 MB total uncompressed, 25 MB per file, 5,000 files.
  3. Any entry containing a backslash aborts the extraction.
  4. The zipball is streamed to a temp file via `->sink()` and each entry copied with `stream_copy_to_stream`, so nothing large is held in memory.
  5. Files land in `storage/app/websites/{uuid}/` — **outside the web root and never servable**. Confirmed already covered by `storage/app/.gitignore` (`*`), so cloned content is never committed.
  6. The destination is deleted before extraction and again on any failure; the temp archive is removed in a `finally` block. Status moves `queued → building → live`, or `failed` with a user-safe `failure_reason`, while the raw exception goes to the log only.

- **QA Checklist Result:** ✅ All pass.
  - Class loading: ✅ all five new classes resolve.
  - Build: ✅ `✓ built in 9.16s`. Diagnostics: ✅ none.
  - Service layer: ✅ no business logic in controllers, per §3.
  - Security: ✅ zip-slip, zip-bomb, backslash-traversal, symlink and memory-exhaustion defences all in place; storage is non-servable; tokens never logged.
  - Guarded commands: ✅ none run.

---

### Phase 8C: Browse real cloned files

- **Files Modified/Created:**
  - `app/Services/WebsiteFileService.php` — Created. `resolvePath()` is the path-traversal boundary; `listDirectory()` returns one level, folders first.
  - `app/Http/Resources/WebsiteFileResource.php` — Created.
  - `app/Http/Controllers/Api/WebsiteFileController.php` — Created.
  - `routes/api.php` — Modified. `GET /api/websites/{website}/files`, `throttle:60,1`.
  - `resources/js/store/index.js`, `features/websites/websitesApi.js` — Modified. Added the `WebsiteFile` tag and `getWebsiteFiles`.
  - `resources/js/pages/file-database/_sections/FileTableSection.jsx` — Rewritten. Mock tree replaced with real API data.
  - `resources/js/pages/file-database/page.jsx` — Modified. Lifts the selected website so the picker drives the table.

- **Issues Encountered:**
  1. **Path traversal.** The browse endpoint takes a client-supplied `path`.
  2. **Sections were unconnected.** `FileSearchSection` held its selection in local state, so the table could never react to it.
  3. **Dead actions.** The mock table had Download and Delete buttons with no backing implementation.
  4. **Browsing a site mid-clone** would hit a missing directory.

- **Resolution:**
  1. `resolvePath()` rejects `..`, `.` and empty segments, then `realpath()`s the result and requires it to remain inside the website root. Route-model binding is by `uuid`, and `authorize('view', $website)` runs before any filesystem access.
  2. Selection lifted into `page.jsx` via an `onSelect` callback and passed down as a prop.
  3. **Removed rather than left dead.** Download needs `Content-Disposition: attachment` plus `X-Content-Type-Options: nosniff` to avoid stored-XSS from user-controlled files, and delete needs a confirmation modal — both deserve doing deliberately.
  4. The endpoint returns **409** with `website_not_ready` unless status is `live`; the UI shows a "Still deploying" or "Deployment failed" state accordingly.

- **QA Checklist Result:** ✅ All pass.
  - Routes: ✅ `api.websites.files` registered.
  - Build ✅ · Diagnostics ✅ · JavaScript purity ✅.
  - `api.php` JSON-only ✅ · Eloquent Resource ✅ · thin controller ✅.
  - RTK Query: ✅ `providesTags: ['WebsiteFile']`, tag registered.
  - Loading (skeleton rows) ✅ · empty ✅ · error ✅ · not-ready ✅ states all present.
  - Keyboard: ✅ breadcrumbs and folder rows are real `<button>`s with focus rings. *(Code-level — requires browser verification)*
  - Security: ✅ path-traversal boundary; Policy-gated; symlinks skipped; `throttle:60,1`; no file contents served in this phase.

---

### ⚠️ Action required by you

1. **Start a queue worker** — `QUEUE_CONNECTION=database`, so nothing clones without it:
   ```
   php artisan queue:work
   ```
   Without it, sites stay at `queued` forever and no files appear.
2. **Only public repositories are visible**, since OAuth is scoped to `public_repo`.

### Open observations

1. **File download and delete are not implemented.** Deferred deliberately — see 8C resolution 3.
2. **No redeploy action.** `CloneRepositoryJob` is idempotent and safe to re-dispatch, but nothing in the UI triggers it.
3. **No plan-based site limits.** `plans.features` is free-text json with no numeric quota; the old "4 of 3 slots used" copy has been removed rather than reimplemented.
4. **Database, domain and environment sections remain mock** — `DatabaseCardSection`, `DomainTableSection`, `BackupHistorySection`, `EnvironmentSection`, `GitSyncSection`.
5. **Site deletion does not clean up storage.** Deleting a user cascades the row but leaves `storage/app/websites/{uuid}/` on disk; a model observer should remove it.
6. **`repository_private` is stored but always false** under the current scope.

### Next Steps

Phase 9 candidates: file download (with safe headers) and delete with confirmation; a redeploy button; storage cleanup on delete; and replacing the remaining mock sections.

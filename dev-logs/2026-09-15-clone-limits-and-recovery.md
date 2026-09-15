# Tunable Clone Limits & Failed-Deploy Recovery

### Phase 9: Configurable extraction limits, diagnostic errors, redeploy and delete

- **Timestamp:** 2026-09-15
- **Mode:** Agent
- **Persona(s) Active:** ⚙️ Backend (lead), 🖥️ Frontend, 🎨 Designer, 🏗️ Tech Lead, 🧪 QA

- **Trigger:** Two deploys failed against the Phase 8B extraction caps:

  | Site | Subdomain | Failure |
  |---|---|---|
  | Inventory (`Oppai-Daisuki-ff/eo-inventory`) | `demo` | more than 5,000 files |
  | ping (`markleduna321/Pinger`) | `ping` | file larger than 25 MB |

- **Files Modified/Created:**
  - `config/hosting.php` — Created. `clone.max_files`, `clone.max_file_bytes`, `clone.max_total_bytes`, all `env()`-backed.
  - `.env` — Modified. Added commented `CLONE_MAX_FILES` / `CLONE_MAX_FILE_MB` / `CLONE_MAX_TOTAL_MB` override keys.
  - `app/Services/RepositoryArchiveExtractor.php` — Modified. Constants replaced with injected config; all three limit errors now report actual versus allowed, and the per-file error names the offending path.
  - `app/Models/Website.php` — Modified. `deleting` model event removes `storage/app/websites/{uuid}`.
  - `app/Http/Controllers/Api/WebsiteController.php` — Modified. Added `redeploy` and `destroy`.
  - `routes/api.php` — Modified. `POST /api/websites/{website}/redeploy` (`throttle:10,1`) and `DELETE /api/websites/{website}`.
  - `resources/js/features/websites/websitesApi.js` — Modified. `redeployWebsite` and `deleteWebsite` mutations.
  - `resources/js/pages/site-domain/_sections/SiteDomainCardSection.jsx` — Modified. Redeploy and Delete actions on each card.

- **Limit changes:**

  | Limit | Old | New | Env key |
  |---|---|---|---|
  | Max files | 5,000 | **50,000** | `CLONE_MAX_FILES` |
  | Max per file | 25 MB | **100 MB** | `CLONE_MAX_FILE_MB` |
  | Max total | 200 MB | **500 MB** | `CLONE_MAX_TOTAL_MB` |

- **Issues Encountered:**
  1. **Limits were too tight and hardcoded.** 5,000 files is easily exceeded by any repository with a committed `vendor/` or `node_modules/`, and the values were compile-time constants with no way to tune them per environment.
  2. **Errors were not diagnostic.** "The repository contains a file larger than 25 MB" did not say *which* file or *how* large, so there was no way to judge whether the repo was marginally or massively over.
  3. **BLOCKER — failed sites were unrecoverable.** There was no redeploy and no delete, and `subdomain` is unique, so both failed subdomains (`demo`, `ping`) were permanently unusable. Raising the limits alone would have left the user stuck, so recovery had to ship in the same phase.
  4. **Deleting a site would have orphaned its files** on disk.

- **Resolution:**
  1. Limits moved to `config/hosting.php` with env overrides and raised to realistic defaults. They were **raised, not removed** — they remain the zip-bomb and disk-exhaustion defence, and every other guard (zip-slip, backslash, symlink, traversal) is untouched.
  2. Messages now read, for example, *"`assets/demo.mp4` is 142.3 MB, which exceeds the 100 MB per-file limit."* A `formatBytes()` helper renders MB/GB, and the per-file check uses the normalised relative path.
  3. Added `redeploy` (resets to `queued`, clears `failure_reason`, re-dispatches `CloneRepositoryJob`) and `destroy`. The job already wipes the destination before extracting, so redeploy is idempotent.
  4. A `deleting` model event removes the storage directory, so deletion reclaims disk.

- **QA Checklist Result:** ✅ All pass.
  - Config resolves: ✅ `{"max_files":50000,"max_file_bytes":104857600,"max_total_bytes":524288000}` after `config:clear`.
  - Routes: ✅ `api.websites.redeploy` (POST) and `api.websites.destroy` (DELETE) registered alongside the existing three.
  - Build: ✅ `✓ built in 17.01s`, 4,453 modules. Diagnostics: ✅ `app/`, `routes/`, `config/`, `resources/js/` all clean.
  - JavaScript purity: ✅ no TypeScript syntax.
  - `api.php` JSON-only ✅ · `web.php` untouched ✅ · Eloquent Resource on both new responses ✅ · thin controller ✅.
  - Form Request: ✅ N/A — neither endpoint accepts a body.
  - Policy: ✅ `redeploy` authorises `update`, `destroy` authorises `delete`; both bind by `uuid`.
  - Migration: ✅ none required.
  - RTK Query: ✅ both mutations `invalidatesTags: ['Website', 'WebsiteFile']`, so cards, dashboard list, file picker and file table all refresh.
  - **Destructive action: ✅ delete requires an antd `Modal.confirm`** naming the site, with a red confirm button and a cancel — per §5 this is mandatory and was not skipped.
  - Loading state: ✅ redeploy button shows a spinner and disables while in flight.
  - Feedback: ✅ success and failure both toast; `failure_reason` renders inline on failed cards so the size or count is visible without opening logs.
  - Focus rings on both new buttons: ✅ *(Code-level — requires browser verification)*
  - **Security:**
    - ✅ Limits remain enforced — made configurable, not optional.
    - ✅ Both routes Policy-gated and owner-scoped via `uuid` route-model binding; no cross-user access.
    - ✅ `throttle:10,1` on redeploy prevents queue and GitHub API hammering.
    - ✅ The deleted storage path is derived from the `uuid` only, never from client input, so deletion cannot be redirected elsewhere.
  - Guarded commands: ✅ none run. Only `config:clear`.

- **Open observations:**
  1. **`eo-inventory` may still fail** if it has `node_modules` or `vendor` committed — 50,000 files is generous but not unlimited, and storing that content is wasteful. Excluding those directories during extraction is a reasonable future option, but it would silently drop files, so it needs an explicit decision rather than a quiet default.
  2. **Delete is only available on the Sites & Domains cards**, not from the dashboard list.
  3. File download and delete within the file browser remain unimplemented, as noted in Phase 8C.
  4. The `redeploy` button is shown for every status, including `live`. That is intentional — it doubles as "pull latest" — but there is no diff or confirmation before overwriting existing files.

- **Next Steps:** Retry `Inventory` with Redeploy; delete `ping` if 100 MB still is not enough for its large file. Then optionally: excluded-directory support, file download with safe headers, and replacing the remaining mock sections.

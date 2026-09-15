# Student Databases

Lets student users provision their own real MySQL schemas from the **Databases** tab of `/files-database`.

---

### Phase 1: Backend provisioning — real MySQL schemas, accounts and grants

- **Timestamp:** 2026-09-15
- **Mode:** Agent
- **Persona(s) Active:** ⚙️ Backend Engineer (lead) + 🏗️ Tech Lead

**Files Modified/Created:**

| File | Action | Reason |
|---|---|---|
| `config/database.php` | Modify | Added privileged `mysql_admin` connection with `'database' => null` so the provisioning account can never serve ordinary app queries |
| `config/hosting.php` | Modify | Added `databases` block: connection, host, port, prefix, grant host, charset/collation, `max_per_user`, `quota_mb`, phpMyAdmin URL |
| `.env.example` | Modify | Documented `DB_ADMIN_*` and `STUDENT_DB_*` keys |
| `database/migrations/2026_09_15_010000_create_student_databases_table.php` | Create | Ownership + credential records for provisioned schemas |
| `app/Models/StudentDatabase.php` | Create | uuid route key, `encrypted` password cast, `$hidden`, status constants, `IDENTIFIER_PATTERN` |
| `app/Models/User.php` | Modify | Added `studentDatabases()` hasMany relation |
| `app/Exceptions/DatabaseProvisioningException.php` | Create | Typed failure so raw driver errors never reach the client |
| `app/Services/StudentDatabaseService.php` | Create | Sole owner of all DDL; identifier whitelist boundary; create/destroy/usage |
| `app/Policies/StudentDatabasePolicy.php` | Create | Ownership enforcement |
| `app/Providers/AuthServiceProvider.php` | Modify | Registered the new policy |
| `app/Http/Requests/StoreStudentDatabaseRequest.php` | Create | Validates the student-supplied label only |
| `app/Http/Resources/StudentDatabaseResource.php` | Create | JSON shape with the password deliberately excluded |
| `app/Http/Controllers/Api/StudentDatabaseController.php` | Create | `index`, `store`, `credentials`, `destroy` |
| `routes/api.php` | Modify | Registered four throttled endpoints |

**Architecture decisions:**

- **Synchronous, not queued.** Unlike repository cloning, `CREATE DATABASE` is instantaneous, so no job/queue worker is involved. The `status` column is retained to record a `failed` state.
- **Identifiers are never user-supplied.** The student submits a *label*; `db_name` is derived as `{prefix}_{userId}_{slug}` and `db_user` as `{prefix}{userId}_{random8}`, both generated server-side.
- **Whitelist-then-interpolate.** MySQL cannot parameterise identifiers, so `assertSafeIdentifier()` / `assertSafePassword()` / `assertSafeHost()` run immediately before each statement is built and **throw rather than sanitise**. This mirrors how `RepositoryArchiveExtractor` is the single zip-slip boundary.
- **Passwords drawn from a fixed alphanumeric alphabet** (no quotes or backslashes), which sidesteps the fact that `CREATE USER ... IDENTIFIED BY` is not reliably preparable.
- **`unprepared()` for DDL, bound parameters for reads.** `information_schema` queries use placeholders throughout.
- **Credentials split from the listing.** `index` never carries the password; a dedicated throttled `GET /databases/{uuid}/credentials` endpoint serves it, backing the UI's "Reveal credentials" button.
- **Rollback on partial failure.** A failed provision best-effort drops the schema and account, deletes the record, and throws.

**Issues Encountered:**

1. `CREATE USER ... IDENTIFIED BY ?` is not guaranteed to be preparable in MySQL, so a bound parameter could not be used for the password.
2. The Psy Shell from `artisan tinker <script>` stayed open and swallowed the next terminal command, which surfaced as a bogus PHP parse error.

**Resolution:**

1. Restricted generated passwords to a fixed alphanumeric alphabet and routed all DDL through `unprepared()`. Because the value is generated from a whitelist rather than accepted from input, there is no injection surface.
2. Sent `exit` to close the shell, then re-ran the cleanup. Temp script removed (`Test-Path` → `False`).

**QA Checklist Result:** ✅ All pass.

Verified live against WAMP MySQL with a throwaway script (since deleted):

| Check | Result |
|---|---|
| Schema created | ✅ `stu_1_qa_check_site` |
| Account created | ✅ `stu1_66md82j7` |
| Grants scoped | ✅ `USAGE ON *.*` + `ALL PRIVILEGES ON \`stu_1_qa_check_site\`.*` only |
| Student can create tables in own schema | ✅ |
| Student blocked from `mysql.user` | ✅ denied |
| Usage reporting | ✅ 1024 bytes |
| Teardown drops schema + record | ✅ |

`php artisan migrate` ran successfully (170ms). `php artisan route:list --path=databases` confirms all four routes registered.

**Configuration note:** `DB_ADMIN_USERNAME` / `DB_ADMIN_PASSWORD` are not set in `.env`; the defaults (`root` / empty) already match WAMP. Set them explicitly if the local root account gains a password.

**Next Steps:** Phase 2 — frontend. Create `resources/js/features/databases/databasesApi.js`, register a `StudentDatabase` tag in `store/index.js`, and replace the mock arrays in `DatabaseHeaderSection`, `DatabaseCardSection` and the empty `CreateDatabaseSection` stub with live data, including loading/empty/error states, an Ant Design create modal, a destructive-delete confirmation, and inline 422 mapping. Awaiting your approval.

---

### Phase 2: Databases tab wired to live data

- **Timestamp:** 2026-09-15
- **Mode:** Agent
- **Persona(s) Active:** 🖥️ Frontend Engineer (lead) + 🎨 UI/UX Designer

**Files Modified/Created:**

| File | Action | Reason |
|---|---|---|
| `resources/js/store/index.js` | Modify | Added `StudentDatabase` to `tagTypes` |
| `resources/js/features/databases/databasesApi.js` | Create | RTK Query endpoints injected into the base api |
| `resources/js/pages/file-database/_sections/DatabaseHeaderSection.jsx` | Modify | Replaced hardcoded `USED_GB`/`TOTAL_GB` with live totals; wired the Create button and quota limit |
| `resources/js/pages/file-database/_sections/CreateDatabaseSection.jsx` | Modify | Filled the empty stub with the create modal |
| `resources/js/pages/file-database/_sections/DatabaseCardSection.jsx` | Modify | Replaced `sampleDatabases` with live data; real reveal/copy/delete plus skeleton, empty and error states |
| `resources/js/pages/file-database/page.jsx` | Modify | Hoisted modal state, passed `onCreate`, rendered the create modal |

**Architecture decisions:**

- **Sections fetch, page orchestrates.** `DatabaseHeaderSection` and `DatabaseCardSection` both call `useGetDatabasesQuery()`; RTK Query dedupes this into a single request. `page.jsx` owns only the modal open state.
- **Credentials are a lazy query.** `useLazyGetDatabaseCredentialsQuery` fires only when the student clicks Reveal or Copy. `keepUnusedDataFor: 0` keeps the password out of the RTK cache, and "Hide credentials" deletes it from component state.
- **Schema-name preview without a backend change.** `previewSuffix()` mirrors the server slug so the student sees the trailing portion of their schema name; the unique prefix is still authoritative server-side.
- **Design language.** The `premium-ui-design` instructions specify a dark, glassmorphic canvas, but the surrounding app — and every other section on this page — is light-themed. Introducing a dark panel into one tab would break the page, so the existing light system was followed. Premium cues still applied: `rounded-xl`/`rounded-2xl` surfaces, `transition-[width]` rather than `transition-all`, transform/opacity-only motion, and staggered card reveal via Framer Motion with `useReducedMotion()` respected.
- **Reused, did not create.** `Button`, `Input`, `Skeleton` and `Card` came from `components/ui/`; antd `Modal` + `message` were used directly, matching `DeleteRoleModal.jsx`. No new UI component was added.
- **`DatabaseToolSection` and `BackupHistorySection` still hold mock data** — they are Phase 3 scope.

**Issues Encountered:**

1. `create_file` cannot overwrite, so `DatabaseCardSection.jsx` could not be rewritten in place.
2. Uncertainty over whether `->additional(['meta' => ...])` surfaces `meta` at the top level of a non-paginated resource collection; if it did not, the header would silently render a zero quota.
3. `php artisan tinker <script>` left the Psy Shell open again, so the following command was swallowed and reported a bogus parse error.

**Resolution:**

1. Wrote to `_DatabaseCardSection.tmp.jsx`, then `Move-Item -Force` onto the target. Directory listing confirms the temp file is gone.
2. Verified live — the serialized payload is `{"data":[],"meta":{"max_per_user":3,"quota_mb":256,"phpmyadmin_url":"..."}}`, which matches `transformResponse`. Temp script deleted.
3. Sent `exit` before each cleanup command.

**QA Checklist Result:** ✅ All automated items pass. `get_errors` clean across all six touched files.

⚠️ **One item deferred to the user:** `npm run build` is on the Rule 6 guarded list and was not run. The bundle needs a build (or a running Vite dev server) to confirm it compiles.

Browser-dependent items — keyboard navigation, modal focus trapping, and responsive reflow at `sm`/`md`/`lg` — are **code-level ✅, requiring browser verification**.

**Next Steps:** Phase 3 — database tooling. Wire `DatabaseToolSection` to the real `phpmyadmin_url` from `meta` and populate its select from live databases; implement SQL export/backup and `BackupHistorySection`; add a usage-refresh action. Awaiting your approval.

---

### Phase 3: SQL export and honest tooling panels

- **Timestamp:** 2026-09-15
- **Mode:** Agent
- **Persona(s) Active:** ⚙️ Backend Engineer + 🖥️ Frontend Engineer, with 🎨 UI/UX Designer

**Files Modified/Created:**

| File | Action | Reason |
|---|---|---|
| `app/Services/StudentDatabaseService.php` | Modify | Added `streamDump()` plus `tableNames()`, `tableRows()`, `literal()`, `quoteIdentifier()` helpers |
| `app/Http/Controllers/Api/StudentDatabaseController.php` | Modify | Added `export()` returning a streamed `.sql` download |
| `routes/api.php` | Modify | Registered `GET /databases/{database}/export`, throttled `5,1` |
| `resources/js/features/databases/databasesApi.js` | Modify | Added `exportDatabase` as a lazy blob query |
| `resources/js/pages/file-database/_sections/DatabaseToolSection.jsx` | Modify | Replaced the hardcoded `DATABASES` array; wired phpMyAdmin and export |
| `resources/js/pages/file-database/_sections/BackupHistorySection.jsx` | Modify | Replaced fabricated `BACKUPS` rows with a truthful empty state |

**Architecture decisions:**

- **Export reads as the student, not as admin.** `streamDump()` builds a throwaway connection from the student's own `db_user`/`db_password`, so the export path can only ever reach data they already own. The privileged `mysql_admin` account is never used for reads. The connection is `DB::purge()`d in a `finally` block so credentials do not survive an aborted stream.
- **No `mysqldump`.** Shelling out would place the password in the process list. The dump is assembled in PHP via `SHOW CREATE TABLE` and chunked `SELECT`s, consistent with the project's standing "no shell-out" stance.
- **Bounded memory.** `streamDump()` is a generator; rows are read in 500-row chunks and echoed with `flush()`, so a large schema never has to fit in `memory_limit`.
- **Correct escaping on both axes.** Identifiers are escaped by doubling backticks; values go through `PDO::quote()`, with non-UTF-8 values emitted as `0x` hex literals so binary columns round-trip.
- **Deviation from the approved plan (improvement, not scope change):** the plan proposed a plain authenticated download link. That would have bypassed the standing "never call `fetch`/`axios` directly — use RTK Query hooks" rule and could not show a spinner. Implemented instead as an RTK Query lazy query with `responseHandler: (r) => r.blob()`, then an object URL. More compliant, and it gives real loading feedback.
- **Backup history tells the truth.** Rather than keep four fabricated rows and a false "automatic backups run nightly at 02:00" claim, the panel is now an empty state pointing at Export .sql. Mock data that looks real is worse than showing nothing.

**Issues Encountered:**

1. Needed confidence that the generated SQL survives hostile content — quotes, newlines, NULLs and injection-shaped strings.
2. `php artisan tinker <script>` left the Psy Shell open again.

**Resolution:**

1. Provisioned a scratch database, seeded `Maria O'Hara`, a value containing a newline, a NULL, and `Bobby'); DROP TABLE students;--`, then dumped and tore it down. All cases emitted correctly: `O\'Hara`, preserved `\n`, bare `NULL`, unquoted integer, and the injection string rendered inert. Temp script deleted.
2. Sent `exit` before cleanup, as recorded in repo memory.

**QA Checklist Result:** ✅ All automated items pass. `get_errors` clean across all six touched files. `php artisan route:list --path=databases` shows all five endpoints.

Note: the export response is a raw SQL stream rather than an Eloquent Resource. This is a deliberate exception — it is a file download, not a model representation. The `409 database_not_ready` path still returns structured JSON.

⚠️ **Deferred to the user:** `npm run build` is on the Rule 6 guarded list and was not run.

Browser-dependent items — keyboard navigation, focus rings, and responsive reflow — are **code-level ✅, requiring browser verification**.

**Next Steps:** The student database feature is functionally complete across the Databases tab. Candidate follow-ups, each needing its own plan and approval:
- Import a `.sql` file into an existing database (the inverse of export).
- Link a database to a `Website` so the connection string can be injected into the site's environment, which would also give the `Environment` tab real content.
- Enforce the storage quota at write time rather than only displaying it.

---

### Phase 4: Student-chosen name and password, plus phpMyAdmin access

- **Timestamp:** 2026-09-15
- **Mode:** Agent
- **Persona(s) Active:** ⚙️ Backend Engineer + 🖥️ Frontend Engineer, with 🎨 UI/UX Designer

**Files Modified/Created:**

| File | Action | Reason |
|---|---|---|
| `app/Models/StudentDatabase.php` | Modify | Added `PASSWORD_PATTERN` beside `IDENTIFIER_PATTERN` |
| `app/Http/Requests/StoreStudentDatabaseRequest.php` | Modify | Replaced `label` with `name`; added `password` + `password_confirmation` |
| `app/Services/StudentDatabaseService.php` | Modify | Uses the chosen name and password; rejects duplicates; widened the password whitelist; added `redact()` |
| `app/Http/Controllers/Api/StudentDatabaseController.php` | Modify | Exposed `name_prefix` in the index meta |
| `resources/js/pages/file-database/_sections/CreateDatabaseSection.jsx` | Modify | Name field with live schema preview; password + confirm with reveal, generator and strength meter |
| `resources/js/pages/file-database/_sections/DatabaseCardSection.jsx` | Modify | Added "Open phpMyAdmin"; card subtitle now shows quota instead of the now-redundant label |

**Architecture decisions:**

- **The prefix stays, and it is load-bearing.** The student names only the suffix; the server still prepends `stu_{userId}_`. This is what makes reserved schemas unreachable — typing `mysql` yields `stu_1_mysql`, so no blocklist is required. Verified.
- **Duplicate names fail loudly.** The Phase 1 auto-dedupe loop (`..._2`, `..._3`) was removed. Silently renaming what a student typed is worse than a 422 telling them the name is taken.
- **Password charset excludes every literal-breaking character** — no `'`, `"`, `` ` `` or `\`. Enforced in the Form Request, again at the `assertSafePassword()` gate, and the value is *also* escaped before interpolation. Validation and escaping, not either.
- **phpMyAdmin uses a plain deep link** (`?route=/database/structure&db=...`), per the user's instruction that the student signs in themselves. No credentials are posted from the page.
- **Reused `PasswordChecklist`** rather than writing a new meter, and deliberately did **not** touch the shared `utils/passwordRules.js`, since the auth pages depend on it. The narrower symbol restriction is surfaced as its own inline field error.
- **Deviation from the approved blueprint (disclosed):** the plan's file list did not include the controller, but the approved UI required a live preview of the *real* schema name, which the client cannot construct without the prefix. Added one `name_prefix` key to the existing index `meta`. Additive and non-breaking.

**Issues Encountered:**

1. **Plaintext password leak into `laravel.log`.** The service logged `$e->getMessage()` directly. A server-side `CREATE USER` failure raises a `QueryException` whose message embeds the failing SQL — including `IDENTIFIED BY '<password>'`. This bug predates Phase 4 (it applied to generated passwords too) but became materially worse once students supply passwords they may reuse elsewhere.
2. `assertWithinQuota()` still reported its error on the now-nonexistent `label` field, so the quota message would never have rendered.
3. `php artisan tinker <script>` left the Psy Shell open again.

**Resolution:**

1. Added `redact()`, which strips the known password and scrubs any `IDENTIFIED BY '...'` clause. Applied at all three log sites. Proved the bug was real by forcing a genuine driver error: the raw message leaked the password (`YES`), and after `redact()` it did not (`no`).
2. Repointed the quota `ValidationException` to `name`.
3. Sent `exit` before each follow-up command, per repo memory.

**QA Checklist Result:** ❌ one failure (the log leak), fixed, full checklist re-run → ✅ all pass.

Live verification:

| Case | Result |
|---|---|
| Password containing `'`, `\`, or `` ` `` | ✅ rejected by validation |
| Mismatched confirmation | ✅ rejected |
| Name starting with a digit | ✅ rejected |
| Name `mysql` | ✅ accepted as `stu_1_mysql` — prefix isolation working as designed |
| Duplicate name | ✅ 422 on `name` |
| Injection payload as password | ✅ blocked; no leftover schema; `mysql` intact |
| Symbol password, real login | ✅ works |
| Password in log after fix | ✅ redacted |

`get_errors` clean across all six touched files. All temp scripts deleted (`_qa*` count: 0).

⚠️ **Deferred to the user:** `npm run build` is on the Rule 6 guarded list and was not run.

Browser-dependent items — keyboard navigation, focus rings, modal focus trapping and responsive reflow — are **code-level ✅, requiring browser verification**.

**Next Steps:** Candidate follow-ups, each needing its own plan and approval:
- Rotate a database password after creation (the natural companion to setting it).
- Import a `.sql` file into an existing database.
- Link a database to a `Website` so the connection string feeds that site's environment, giving the empty `Environment` tab real content.
- Enforce the storage quota at write time rather than only displaying it.

---

### Phase 5: Fix the phpMyAdmin 404

- **Timestamp:** 2026-09-15
- **Mode:** Agent
- **Persona(s) Active:** 🏗️ Tech Lead + ⚙️ Backend Engineer

**Files Modified/Created:**

| File | Action | Reason |
|---|---|---|
| `.env` | Modify | Added `STUDENT_DB_PHPMYADMIN_URL=http://localhost/phpmyadmin5.2.3` |
| `.env.example` | Modify | Documented the versioned-alias gotcha |

**Diagnosis:**

The "Open phpMyAdmin" button returned an Apache 404. This was **not** a code defect. WAMP mounts phpMyAdmin at a versioned alias:

```
Alias /phpmyadmin5.2.3 "${INSTALL_DIR}/apps/phpmyadmin5.2.3/"
```

There is no generic `/phpmyadmin` alias, so Apache 404'd before phpMyAdmin was ever reached. `.env` contained no `STUDENT_DB_*` keys, so the application fell back to the `config/hosting.php` default of `http://localhost/phpmyadmin`.

The link construction itself was correct — `?route=/database/structure&db=stu_3_test` is the right format for phpMyAdmin 5.2, and the schema name confirms Phase 4 is producing properly prefixed names.

**Architecture decision:**

Fixed in `.env` rather than by changing the committed default. The `5.2.3` suffix changes on every phpMyAdmin upgrade and differs per machine, so baking it into `config/hosting.php` would break on the next WAMP update and on every other developer's machine. `.env.example` now carries a comment pointing at `C:\wamp64\alias\` so the next person diagnoses this in seconds.

**Incidental security check:**

While diagnosing, verified phpMyAdmin's auth mode: `$cfg['Servers'][$i]['auth_type'] = 'cookie'` with `user = ''`. There is **no root auto-login** — students are prompted and sign in with their own scoped account, matching the approved design. Had this been `auth_type = 'config'`, the button would have handed every student a root session, so it was worth confirming rather than assuming.

**Issues Encountered:** None beyond the diagnosis itself.

**QA Checklist Result:** ✅ All pass.

| Check | Result |
|---|---|
| `config('hosting.databases.phpmyadmin_url')` | ✅ `http://localhost/phpmyadmin5.2.3` |
| Previously-404ing deep link | ✅ now returns **200** |
| phpMyAdmin auth mode | ✅ `cookie` — no root auto-login |
| `.env` handling | ✅ appended one key; file never read or printed wholesale |

No rebuild required — the value is served from the API at runtime, not bundled. A page refresh is enough.

**Next Steps:** Unchanged from Phase 4 — password rotation, `.sql` import, website/database linking, or write-time quota enforcement. Each needs its own plan and approval.

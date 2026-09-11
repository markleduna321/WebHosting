### Phase 1: Consolidate site-domain into a single page

- **Timestamp:** 2026-09-11
- **Mode:** Agent
- **Persona(s) Active:** 🖥️ Frontend + ⚙️ Backend
- **Files Modified/Created:**
  - `site-domain/_sections/SiteDomainCardSection.jsx`, `DomainTableSection.jsx`, `ConnectDomainSection.jsx`, `GitSyncSection.jsx` — flattened + PascalCase, moved from the three former subfolders (`GitSyncSection` extracted from `git-sync/page.jsx`'s inline JSX)
  - `site-domain/page.jsx` — single entry point; uses `Tabs`/`TabPanel` id-based (client-side) mode instead of route-based tabs; `Page.layout = MainLayout` directly
  - `routes/web.php` — collapsed 3 `site-domain*` routes into one `site-domain` route rendering `site-domain/page`
  - `file-database/page.jsx` — updated its cross-page import of `SiteDomainCardSection` to the new `_sections/` path
  - Deleted: `site-domain/site/`, `site-domain/domain/`, `site-domain/git-sync/`, `components/layout/SiteDomainLayout.jsx`
- **Issues Encountered:** `file-database/page.jsx` imported `SiteDomainCardSection` from the old `site-domain/site/sections/...` path — updated as part of this phase to avoid a broken import.
- **Resolution:** N/A
- **QA Checklist Result:** ✅ All pass (route verified via `php artisan route:list --name=site-domain`)
- **Next Steps:** None requested. All four multi-route page groups (`account-billing`, `file-database`, `knowledge-base`, `site-domain`) are now consolidated to this same single-page + `_sections/` pattern.

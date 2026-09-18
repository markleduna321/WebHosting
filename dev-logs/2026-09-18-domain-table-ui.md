### Phase 1: Match Connected Domains UI to reference screenshot

- **Timestamp:** 2026-09-18
- **Mode:** Agent
- **Persona(s) Active:** 🎨 Designer + 🖥️ Frontend
- **Files Modified/Created:**
  - `resources/js/pages/site-domain/_sections/DomainTableSection.jsx` — Added an inline header "Add domain" form (domain input + website dropdown sourced from `useGetWebsitesQuery` + submit button); unified `StatusBadge` to a consistent pill style across `verified`/`pending`/`failed`; moved the mock `DOMAINS` array into local state so submitting the form prepends a new `pending` row; domain count subtitle is now dynamic.
- **Issues Encountered:** No backend `Domain` model/API exists — this remains a mock/local-state component, same as before this change.
- **Resolution:** N/A — scoped to UI only per the request.
- **QA Checklist Result:** ✅ All pass (visual match flagged as code-level ✅, requires browser verification).
- **Next Steps:** None — awaiting further instructions. A real domains backend (model/migration/controller/RTK slice) would be a separate, larger feature if ever needed.

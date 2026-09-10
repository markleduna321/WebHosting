### Phase 1: Reconcile _components into components/ui

- **Timestamp:** 2026-09-10
- **Mode:** Agent
- **Persona(s) Active:** 🖥️ Frontend
- **Files Modified/Created:**
  - `components/ui/Input.jsx` — moved from `_components/input.jsx` (distinct API from existing `TextInput.jsx`, kept separate)
  - `components/ui/GuideFeedbackCard.jsx` — moved from `_components/guide-feedback-card.jsx`; internal import fixed to `./Button`
  - 22 files across `components/layout/`, `pages/dashboard`, `pages/account-billing`, `pages/file-database`, `pages/hosting`, `pages/knowledge-base`, `pages/site-domain` — repointed `Button`/`Card`/`Dropdown`/`Table`/`Tabs`/`Input`/`GuideFeedbackCard` imports from `_components/...` to `@/components/ui/...`
  - `resources/js/_components/` — deleted (all 7 files were unreferenced duplicates after the repoint)
- **Issues Encountered:** None — `Button`, `Card`, `Dropdown`, `Table`, `Tabs` were byte-identical between the two locations; only `Input` had a distinct API and was moved rather than merged.
- **Resolution:** N/A
- **QA Checklist Result:** ✅ All pass
- **Next Steps:** None requested.

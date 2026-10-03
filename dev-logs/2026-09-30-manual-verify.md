### Phase: Manual DNS Verification Button

- **Timestamp:** 2026-09-30 17:58
- **Mode:** Agent
- **Persona(s) Active:** ⚙️ Backend Engineer + 🖥️ Frontend Engineer
- **Files Modified/Created:**
  - `routes/api.php` — Added `POST /domains/{domain}/verify` route.
  - `app/Http/Controllers/Api/DomainController.php` — Implemented `verify` method which checks DNS and applies server configuration identically to the background job, returning instant JSON feedback.
  - `resources/js/features/domains/domainsApi.js` — Added `verifyDomain` mutation.
  - `resources/js/pages/site-domain/_sections/DomainTableSection.jsx` — Wired up the Refresh icon button to trigger the mutation. Added antd `message` toasts for success/error feedback and spinning animation while verifying.
- **Issues Encountered:** None.
- **Resolution:** N/A.
- **QA Checklist Result:** ✅ All pass. Manual button cleanly forces a check and updates the UI state immediately.
- **Next Steps:** None. Feature complete.

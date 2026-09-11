### Phase 1: Consolidate account-billing into a single page

- **Timestamp:** 2026-09-11
- **Mode:** Agent
- **Persona(s) Active:** 🖥️ Frontend + ⚙️ Backend
- **Files Modified/Created:**
  - `account-billing/_sections/PaymentMethodCardSection.jsx`, `PaymentMethodTableSection.jsx`, `ProfileFormSection.jsx`, `ProfileSecuritySection.jsx`, `ProfileStudentVerificationSection.jsx`, `ReferralHeaderSection.jsx`, `ReferralTableSection.jsx`, `SubscriptionHeaderSection.jsx`, `SubscriptionInvoiceHistorySection.jsx` — flattened + PascalCase, moved from the four former subfolders (also fixed the `subcription` typo)
  - `account-billing/page.jsx` — single entry point; uses `Tabs`/`TabPanel` id-based (client-side) mode instead of route-based tabs; `Page.layout = MainLayout` directly
  - `routes/web.php` — collapsed 4 `account-billing*` routes into one `account-billing` route rendering `account-billing/page`
  - Deleted: `account-billing/payment-methods/`, `profile/`, `referrals/`, `subscription/`, `components/layout/AccountBillingLayout.jsx`
- **Issues Encountered:** None.
- **Resolution:** N/A
- **QA Checklist Result:** ✅ All pass (route verified via `php artisan route:list --name=account-billing`)
- **Next Steps:** None requested. `site-domain` still follows the old multi-route + `SiteDomainLayout` pattern if the same consolidation is wanted there too.

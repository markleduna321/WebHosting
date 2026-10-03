# Payment Methods: Card & E-wallet Readiness

### Phase 1: Payment method registry + "Temporarily unavailable" UI

- **Timestamp:** 2026-10-03
- **Mode:** Agent
- **Persona(s) Active:** 🖥️ Frontend + 🎨 Designer (lead), ⚙️ Backend, 🧪 QA
- **Files Modified/Created:**
  - `app/Services/PaymentMethodRegistry.php` — Created. The single list of methods: `qrph`, `card`, `gcash`, `paymaya`, `grab_pay`. These ids are PayMongo's own type names, so Phase 2 can pass them through unchanged. Each method has a label, description, group (`qr` / `card` / `ewallet`) and an enabled flag. Provides `all()`, `ids()`, `enabledIds()`, `isEnabled()`.
  - `config/services.php` — Added `paymongo.methods.{card,gcash,maya,grabpay}`, read from `PAYMONGO_METHOD_*` and off by default. QR Ph is always on.
  - `.env.example` — Documents the four switches.
  - `app/Http/Requests/StoreCheckoutRequest.php` — New `payment_method` field (`bail|sometimes|string|in:<ids>`, plus a check that the method is switched on). Added a `paymentMethod()` helper that defaults to `qrph`.
  - `app/Services/CheckoutService.php` — `start()` takes `$method` and refuses anything but QR Ph until the Phase 2 integration exists. This is a safety net in case a switch is flipped early.
  - `app/Http/Controllers/Api/CheckoutController.php` — Passes the validated method through.
  - `app/Http/Controllers/CheckoutController.php` — Sends `paymentMethods` to the checkout page as an Inertia prop.
  - `resources/js/pages/checkout/_sections/PaymentMethodSection.jsx` — Created. A radio group split into QR / Cards / E-wallets with a `QrCode` / `CreditCard` / `Wallet` icon for each. Disabled rows are dimmed and marked `aria-disabled`, and show a "Temporarily unavailable" badge with a `Clock` icon, so the status isn't shown by color alone. Arrow keys move only between available options. Rows are at least 44px tall.
  - `resources/js/pages/checkout/_sections/InvoicePreviewSection.jsx` — Shows the selector, sends `payment_method`, changes the pay button label and icon with the selection, shows the QR help text only for QR Ph, and shows a `payment_method` 422 error inline.
  - `resources/js/pages/checkout/page.jsx` — Passes `paymentMethods` through.
  - `resources/js/pages/account-billing/_sections/PaymentMethodCardSection.jsx` — Fixed the misleading copy: QR Ph is live, cards and e-wallets are "coming soon".

- **Issues Encountered:**
  1. Without `bail`, a non-string `payment_method` (such as an array) would reach the custom check, whose `string` type hint would throw a TypeError and cause a 500.
  2. The editor reports "Undefined type PaymentMethodRegistry" in `CheckoutService`. This is out of date: the class is in the same namespace and loads at runtime (confirmed with tinker).
- **Resolution:**
  1. Added `bail`. Tinker confirms an array input now returns "must be a string".
  2. No action needed.

- **Verification (tinker; no database writes, no PayMongo calls):**
  - The registry returns 5 methods; only `qrph` is enabled.
  - `gcash` → "This payment method is temporarily unavailable. Please use QR Ph."
  - `bitcoin` → rejected as an unknown method.
  - an array → rejected as "must be a string".

- **QA Checklist Result:**
  - ✅ JS purity: plain JavaScript.
  - ✅ `web.php` / `api.php`: unchanged; no new routes.
  - ✅ Existing Form Request extended for the new field.
  - ✅ Policy: the existing `PaymentPolicy` check in `StoreCheckoutRequest::authorize()` is unchanged.
  - ✅ Resource: `PaymentResource` is unchanged; nothing new is returned.
  - ➖ Migration: none this phase.
  - ✅ Service class: `PaymentMethodRegistry` holds the method logic, and the controllers stay thin.
  - ✅ RTK Query: `createPayment` gets one extra field in its request; its cache tags are unchanged. The method list comes in as an Inertia prop because it's fixed configuration, so it isn't fetched twice.
  - ✅ 422 errors from the server are shown inline under the pay section.
  - ✅ The new component lives in the page's `_sections/`, not in `components/ui/`, so no new shared UI component was needed.
  - ✅ Naming: `PaymentMethodRegistry` (PascalCase service), `PaymentMethodSection.jsx` (PascalCase component).
  - ✅ Loading state: the selector is disabled while the payment is being created, and the button shows its spinner.
  - ✅ Keyboard and a11y at code level, needs browser check: `role="radiogroup"`/`radio`, `aria-checked`, `aria-disabled`, arrow-key navigation, focus ring, text badge alongside the color.
  - ✅ Responsive at code level, needs browser check: one column, full-width rows, long descriptions truncate, 44px touch targets.
  - ✅ Security: disabled methods are rejected on the server, not just hidden in the UI. `CheckoutService` refuses non-QR methods a second time. Amounts are still calculated only on the server.
  - ✅ Guarded commands: none. Only `php -l` and tinker validation checks ran. No build, no migrate, no git.

- **Next Steps:** Phase 2, the PayMongo Checkout Session integration for cards and e-wallets: a `createCheckoutSession()` service method, a migration for the payment method and session fields, `checkout_session.payment.paid` webhook handling, and success/cancel return pages. All of it stays inactive until a `PAYMONGO_METHOD_*` switch is turned on. Awaiting approval.

---

### Phase 2: Card & e-wallet payment flow (stays off until a method is switched on)

- **Timestamp:** 2026-10-03
- **Mode:** Agent
- **Persona(s) Active:** ⚙️ Backend (lead), 🖥️ Frontend + 🎨 Designer, 🧪 QA
- **Docs checked first** (docs.paymongo.com, Create Checkout Session reference, Checkout Session resource, Hosted Checkout quick start): `POST /v1/checkout_sessions` takes `line_items`, `payment_method_types`, `success_url`, `cancel_url`, `reference_number` and `metadata` (string values only), and returns `data.attributes.checkout_url`. The event to subscribe to is `checkout_session.payment.paid`, and its payload carries the session's `reference_number`, `metadata`, `payments[]` and `payment_intent`.

- **Files Modified/Created:**
  - `database/migrations/2026_10_03_010000_add_checkout_session_fields_to_payments_table.php` — Created. Adds `payment_method` (string, default `qrph`, indexed), `paymongo_checkout_session_id` (nullable, indexed) and `checkout_url` (`text`, because hosted URLs carry a base64 fragment). `down()` drops the indexes, then the columns.
  - `app/Models/Payment.php` — The new columns are fillable.
  - `app/Services/PayMongoService.php` — New `createCheckoutSession()`: one line item, restricted to the single chosen method, with the payment UUID as `reference_number` and in metadata.
  - `app/Services/CheckoutService.php` — `start()` re-checks that the method is switched on (replacing Phase 1's QR-only block), records `payment_method`, then branches: QR Ph goes to `startQr()` (logic unchanged, just moved), everything else to `startHostedCheckout()`. Hosted checkout saves the session id, the underlying payment intent id (so a `payment.paid` event also finds the payment) and `checkout_url`, and only accepts an `https://` URL back from PayMongo.
  - `app/Http/Resources/PaymentResource.php` — Adds `payment_method`. `checkout_url` is included only while the payment is awaiting payment.
  - `app/Http/Controllers/Api/PayMongoWebhookController.php` — Handles `checkout_session.payment.paid`: finds the payment by `metadata.payment_uuid`, then `reference_number`, then the session id, and marks it paid. The existing signature, live/test-mode and duplicate-event checks are reused. `payment.failed` no longer marks card/wallet payments failed, because PayMongo's page lets the customer retry after a decline.
  - `app/Http/Controllers/CheckoutReturnController.php` + `routes/web.php` — `GET /checkout/return/{payment:uuid}` (`checkout.return`), logged-in users only and authorized through `PaymentPolicy::view` (owner only). It only displays status.
  - `resources/js/pages/checkout/return/page.jsx` — Created. Polls every 3 seconds with the existing `useGetPaymentQuery` (on the success return only, and for at most 2 minutes). Shows: Confirming → Paid (redirects to the dashboard) / Failed (Try again) / Cancelled (Back to checkout) / Still confirming (reassures the customer they won't need to pay again).
  - `resources/js/pages/checkout/_sections/InvoicePreviewSection.jsx` — When the response includes `checkout_url`, redirects there with `window.location.assign`, but only to `https://paymongo.com` or a `*.paymongo.com` host. The button shows "Opening secure payment page..." and the selector locks while redirecting.

- **Issues Encountered:**
  1. One no-op entry in the batch edit was reported as failed ("input and output are identical").
  2. The first version of the return page put `<Button>` inside `<Link>`, which nests a button in an anchor (invalid HTML and confusing for screen readers).
  3. `php artisan tinker <file>` ran the smoke script and then stayed in its interactive shell, which moved the terminal to the background.
- **Resolution:**
  1. Read the affected file and confirmed every intended change landed. The no-op entry was redundant.
  2. Replaced with links styled as buttons; removed the unused import.
  3. Read the output, closed the terminal, and deleted the temporary script `storage/app/phase2-smoke.php` (confirmed gone).

- **Verification (fake HTTP client; no real PayMongo call, no database writes):**
  - The request goes to `https://api.paymongo.com/v1/checkout_sessions` with `payment_method_types: ["gcash"]`, an amount in centavos (`39900`), `quantity: 1`, `reference_number` = the payment UUID, and metadata containing `payment_uuid`.
  - `checkout_url` is read back correctly.
  - With the method switched off, `CheckoutService::start()` throws "temporarily unavailable" before creating any payment record.
  - `route:list` shows `checkout.return`. All PHP files lint clean, and the editor reports no errors.

- **QA Checklist Result:**
  - ✅ JS purity: plain JavaScript.
  - ✅ `web.php`: the new route only renders an Inertia page. `api.php`: unchanged.
  - ✅ Form Request: unchanged (`StoreCheckoutRequest` from Phase 1). There are no new POST endpoints.
  - ✅ Policy: the return page enforces `PaymentPolicy::view`.
  - ✅ Resource: `PaymentResource` is extended, and the return page uses it.
  - ✅ Migration is reversible.
  - ✅ Service classes hold the logic. Controllers stay thin.
  - ✅ RTK Query: reuses `getPayment` (its `providesTags` is unchanged). No new endpoints.
  - ✅ Internal links use `<Link>`. The external PayMongo redirect deliberately uses `window.location` and is checked against PayMongo's host first.
  - ✅ Loading states: a spinner while redirecting, "Confirming…" while polling, and a "still confirming" message when polling stops.
  - ✅ Empty/error states: Failed and Cancelled screens each have a clear retry link.
  - ✅ Keyboard and a11y at code level, needs browser check: `role="status"` + `aria-live`, real links with visible focus rings.
  - ✅ Responsive at code level, needs browser check: single column `max-w-lg`, padding set at `sm` and `lg`.
  - ✅ Security:
    - Card data never reaches our server or page (hosted checkout).
    - The secret key is used server-side only.
    - The redirect goes only to PayMongo hosts (open-redirect guard).
    - The webhook stays the only thing that activates a plan; the success URL grants nothing.
    - Webhook signature, live/test-mode and duplicate-event checks are unchanged.
    - The return page is owner-only.
    - The payment UUID is used in URLs, not the database id.
  - ✅ Guarded commands: none. Only `php -l`, `route:list`, and the faked smoke test ran.

- **User actions required:**
  1. `php artisan migrate`. **Required:** checkout writes the new `payment_method` column, so QR Ph checkout will also error until this runs.
  2. When PayMongo activates a method: set `PAYMONGO_METHOD_CARD=true` (or `_GCASH` / `_MAYA` / `_GRABPAY`) in `.env`, then `php artisan config:clear` if config is cached.
  3. In PayMongo Dashboard → Webhooks, add the event **`checkout_session.payment.paid`** to your existing endpoint. Keep `payment.paid` and `payment.failed`.
  4. Test with test keys first: pick the method → you're sent to PayMongo's page → pay with a test card or wallet → you return to `/checkout/return/...` → it should show Paid and activate the plan.

- **Next Steps:** None scoped. Possible follow-ups: let customers resume an unfinished hosted payment from the billing page, and expire old checkout sessions through `POST /checkout_sessions/{id}/expire` when a customer starts over.

# PayMongo QR Ph Checkout

Lets students pick a hosting plan, review an invoice preview, and pay via PayMongo QR Ph.

---

### Phase 6: Backend — payment intents, QR generation, and webhook

- **Timestamp:** 2026-09-15
- **Mode:** Agent
- **Persona(s) Active:** ⚙️ Backend Engineer (lead) + 🏗️ Tech Lead

**Files Modified/Created:**

| File | Action | Reason |
|---|---|---|
| `config/services.php` | Modify | PayMongo keys, base URL, livemode, QR expiry, signature tolerance |
| `.env.example` | Modify | Documented the PayMongo keys |
| `bootstrap/app.php` | Modify | Exempted `api/webhooks/paymongo` from CSRF |
| `database/migrations/2026_09_15_020000_create_payments_table.php` | Create | Transaction record and audit trail |
| `database/migrations/2026_09_15_020001_create_webhook_events_table.php` | Create | Event-ID dedupe store |
| `app/Models/Payment.php` | Create | uuid route key, status + cycle constants |
| `app/Models/WebhookEvent.php` | Create | Processed-event ledger |
| `app/Models/User.php` | Modify | `payments()` relation |
| `app/Exceptions/PaymentException.php` | Create | Typed failure; no raw gateway errors to the client |
| `app/Services/PayMongoService.php` | Create | v1 API client + signature verification |
| `app/Services/CheckoutService.php` | Create | Amount calculation, intent lifecycle, subscription activation |
| `app/Policies/PaymentPolicy.php` | Create | Ownership on the polling endpoint |
| `app/Providers/AuthServiceProvider.php` | Modify | Registered the policy |
| `app/Http/Requests/StoreCheckoutRequest.php` | Create | Validates plan slug + billing cycle only |
| `app/Http/Resources/PaymentResource.php` | Create | JSON shape for create + poll |
| `app/Http/Controllers/CheckoutController.php` | Create | Inertia render of the checkout page |
| `app/Http/Controllers/Api/CheckoutController.php` | Create | `store` (create QR), `show` (poll) |
| `app/Http/Controllers/Api/PayMongoWebhookController.php` | Create | Verify → dedupe → activate |
| `routes/web.php` | Modify | `GET /checkout/{plan:slug}` |
| `routes/api.php` | Modify | Checkout + public webhook routes |

**Architecture decisions:**

- **All three PayMongo calls run server-side.** Their QR Ph guide shows the payment-method create and attach happening in the browser with the *public* key. Doing them in PHP with the secret key means no key and no `client_key` ever reach the page; the browser receives only a QR image.
- **The amount never comes from the client.** `POST /api/checkout` accepts a plan slug and a billing cycle. `CheckoutService::priceFor()` reads the price from the `plans` row. A tampered request cannot change what is charged.
- **Synchronous webhook processing.** PayMongo's best practice is "acknowledge, then process in a job". Our handler does about three DB writes and no external calls — milliseconds against a 30-second budget. A queued job would add a hard dependency on `queue:work` running, and if it weren't, payments would silently never activate. Approved with the user.
- **Idempotency in two layers:** a unique `webhook_events.event_id`, plus `markPaid()` returning early when the payment is already paid. PayMongo retries up to 12 times; without this, one payment could mint twelve subscriptions.
- **Failed processing deletes the dedupe row** and returns 500, so PayMongo's retry genuinely reprocesses instead of being discarded as a duplicate.
- **Replay protection** via a 5-minute tolerance on the signed timestamp.
- **A new paid plan supersedes the old one** — existing live subscriptions are canceled inside the same transaction.

**Issues Encountered:**

1. `PayMongoWebhookController::handle()` took `CheckoutService` as both a constructor dependency and a method parameter.
2. The terminal intermittently lost `php` from PATH, and `artisan tinker <script>` again left the Psy Shell open, swallowing the next command.

**Resolution:**

1. Removed the redundant method parameter.
2. Re-ran the commands; sent `exit` before cleanup. Both are already recorded in repo memory.

**QA Checklist Result:** ✅ All pass.

Verified live (temp script, since deleted):

| Attack / case | Result |
|---|---|
| Valid signature | ✅ accepted |
| Tampered body | ✅ rejected |
| Signature forged with another secret | ✅ rejected |
| Replay of a 10-minute-old payload | ✅ rejected |
| Missing signature header | ✅ rejected |
| Live signature while in test mode | ✅ rejected |
| Webhook with bad signature over real HTTP | ✅ 401 (proves CSRF exemption works — otherwise 419) |
| `markPaid` called 3× | ✅ 1 subscription |
| Live subscriptions afterwards | ✅ exactly 1 |
| Quote-only plan checkout | ✅ 422 |
| monthly → `ends_at` | ✅ 30 days |

Both migrations applied (batch 6). `route:list` confirms all four routes.

**⚠️ Known gap — the happy path is untested.** `PAYMONGO_SECRET_KEY` is not yet in `.env`, so an actual API round-trip could not be exercised: creating a payment intent, generating a real QR, and receiving a genuine signed `payment.paid` remain **unverified**. Everything in the table above is verified; that is not.

**Action required from the user** (values must be added by hand — never through the assistant):

```
PAYMONGO_SECRET_KEY=sk_test_...
PAYMONGO_WEBHOOK_SECRET=whsk_...
PAYMONGO_LIVEMODE=false
```

The webhook signing secret is shown when the endpoint is created in the PayMongo dashboard — it is not the secret API key. Run `php artisan config:clear` afterwards.

**Next Steps:** Phase 7 — the checkout page. `features/checkout/checkoutApi.js` with a `Payment` tag, the `checkout/page` Inertia view (plan inclusions, invoice preview, monthly/annual toggle), the QR panel with polling and expiry countdown, and wiring the currently-inert "Choose Plan" buttons in `HostPlanCardSection`. Awaiting approval.

Recommended follow-up, worth its own phase: a permanent `tests/Feature` suite for the webhook. This phase's verification was a throwaway script, and payment code is exactly the kind that should have regression tests guarding it.

---

### Phase 7: Checkout page and QR payment UI

- **Timestamp:** 2026-09-15
- **Mode:** Agent
- **Persona(s) Active:** 🖥️ Frontend Engineer (lead) + 🎨 UI/UX Designer

**Files Modified/Created:**

| File | Action | Reason |
|---|---|---|
| `resources/js/store/index.js` | Modify | Added `Payment` to `tagTypes` |
| `resources/js/features/checkout/checkoutApi.js` | Create | `createPayment` + `getPayment` |
| `resources/js/pages/checkout/page.jsx` | Create | Route entry; owns cycle and payment state |
| `resources/js/pages/checkout/_sections/PlanSummarySection.jsx` | Create | Plan inclusions |
| `resources/js/pages/checkout/_sections/InvoicePreviewSection.jsx` | Create | Cycle toggle, line items, total, pay button |
| `resources/js/pages/checkout/_sections/QrPaymentSection.jsx` | Create | QR panel, countdown, polling, terminal states |
| `resources/js/pages/hosting-plan/_sections/HostPlanCardSection.jsx` | Modify | Wired the inert "Choose Plan" buttons |

**Architecture decisions:**

- **Polling uses RTK Query's built-in `pollingInterval`.** Research suggested writing a `usePollingQRStatus` hook; that would have duplicated a feature RTK Query already ships and sidestepped the "use the generated hooks" rule. `pollingInterval` flips to `0` once the status is terminal, so an abandoned tab stops calling the API.
- **Add-ons deliberately omitted.** The register flow has an `ADD_ONS` picker, but `CheckoutService` charges the plan price and nothing else, and there is no add-ons table. Showing a picker would let a student select ₱500 of extras, see them in the total, and be charged only the plan price — the invoice preview would misstate the charge. Add-ons need their own table, line items and phase.
- **Displayed amount is server-authoritative after creation.** The pre-payment figure is a preview; once the payment exists, the QR panel renders the amount returned by the API.
- **`safeImageSrc()` guards the QR.** Only `data:image/` or `https://` reaches an `img src`. The value comes from our own API, but a URL flowing into the DOM warrants the check.
- **Annual is disabled, not silently downgraded**, when a plan has no `annual_price`.
- **Plain containers instead of `Card`** for checkout panels: `components/ui/Card` renders an `<a>`, and nesting buttons inside an anchor is invalid HTML.
- **Success does a full `router.visit('/dashboard')`** so Inertia re-shares `auth.user.plan` and the new plan appears everywhere.
- Followed the existing light theme for consistency with the rest of the app.

**Issues Encountered:** None. All six touched files were clean on first check.

**Resolution:** n/a

**QA Checklist Result:** ✅ All pass.

**This phase also closed the Phase 6 gap.** With the keys now in `.env`, a real test-mode round-trip was verified:

| Check | Result |
|---|---|
| Intent created | ✅ `pi_2egSA87yTrm187eLeKF71XGb` |
| Local amount vs plan row | ✅ 129.00 = 129.00 |
| Amount as PayMongo received it | ✅ 12900 centavos |
| Currency / method | ✅ PHP / qrph |
| `livemode` | ✅ false |
| Real QR returned | ✅ `data:image/png;base64,…` (14 KB) |
| Passes the img guard | ✅ yes |
| Webhook-matching metadata | ✅ `payment_uuid`, `user_id`, `plan_slug` |
| PayMongo-side status | ✅ `awaiting_next_action` |

Temp script deleted (`_qa*` count: 0).

⚠️ **Still untested:** an actual scan-and-pay. The genuine `payment.paid` webhook → subscription activation path remains unproven end-to-end; Phase 6 verified signature handling and idempotency with synthetic events only.

> **🛑 CORRECTION (see Phase 8).** The line above, and the advice given in chat to "scan one with a test wallet", were **wrong and financially unsafe**. PayMongo's docs state that in test mode QR Ph generates *real* QR codes and scanning one **processes a real transaction**. Never scan a QR this app generates. Use the `test_url` simulation link added in Phase 8 instead.

⚠️ **Deferred to the user:** `npm run build` is on the Rule 6 guarded list.

Browser-dependent items — keyboard navigation, focus rings, countdown announcements and responsive reflow — are **code-level ✅, requiring browser verification**.

**Next Steps:** Candidate follow-ups, each needing its own plan and approval:
- A permanent `tests/Feature` suite for the webhook, before this goes anywhere near live mode.
- Fill `account-billing`'s invoice history from the real `payments` table (it is still mock data).
- An add-ons table with real line items, so the register flow's picker becomes chargeable.
- Handle renewals — subscriptions currently get an `ends_at` but nothing acts on expiry.

---

### Phase 8: Test-mode payment simulation

- **Timestamp:** 2026-09-15
- **Mode:** Agent
- **Persona(s) Active:** ⚙️ Backend Engineer + 🖥️ Frontend Engineer

**Files Modified/Created:**

| File | Action | Reason |
|---|---|---|
| `database/migrations/2026_09_15_030000_add_test_url_to_payments_table.php` | Create | Store the simulation URL so it survives a refresh |
| `app/Models/Payment.php` | Modify | Added `paymongo_test_url` to `$fillable` |
| `app/Services/CheckoutService.php` | Modify | Capture `test_url`; use PayMongo's own `expires_at` |
| `app/Http/Resources/PaymentResource.php` | Modify | Emit `test_url` only outside live mode |
| `resources/js/pages/checkout/_sections/QrPaymentSection.jsx` | Modify | Dev-only simulate link + `safeTestUrl()` guard |

**The correction that prompted this phase:**

PayMongo's testing documentation states that in test mode QR Ph generates **real** QR codes and that scanning one **processes a real transaction**; the supported way to test is the `test_url` in the response. The advice given at the end of Phase 7 — "go scan one with a test wallet" — was therefore wrong and would have moved real money. The Phase 7 entry above now carries a correction block. The user's instinct to use `test_url` was correct.

**Discovery:**

A throwaway probe against the live test API located the field and revealed a second issue:

```
next_action.type            = consume_qr
next_action.code.test_url   = https://secure-authentication.paymongo.com/sources?id=src_...&code_id=qr_...
next_action.code.image_url  = data:image/png;base64,...
next_action.code.expires_at = 2026-09-15T14:46:03Z
```

`test_url` sits at `next_action.code.test_url`, not on the intent root. PayMongo also returns its own `expires_at`, which the Phase 6 implementation ignored in favour of a locally computed `now() + 1800`. That is now used, with the computed window kept only as a fallback.

**Architecture decisions:**

- **No "mark as paid" dev endpoint.** Linking to PayMongo's own simulator drives the real flow and fires a genuine signed webhook, so it exercises the one path still unproven instead of bypassing it. Nothing in this application can mark a payment paid; only a verified webhook can.
- **Three independent gates** on a field that is effectively a free-subscription link: PayMongo omits it for live keys; the Resource withholds it when `livemode` is true; the UI branch is removed from production bundles. The client-side check is deliberately the last and weakest layer — the first two hold even if a dev build is pointed at live keys.
- **`import.meta.env.DEV`, not `process.env.NODE_ENV`.** The user's snippet used the latter, which depends on define-replacement; `import.meta.env.DEV` is statically `false` in a production build, so the branch is eliminated at build time rather than merely skipped at runtime.
- **`safeTestUrl()`** mirrors the existing `safeImageSrc()` guard so a non-`https://` value can never become an href.

**Issues Encountered:** None during implementation.

**Resolution:** n/a

**QA Checklist Result:** ✅ All pass.

| Check | Result |
|---|---|
| `test_url` captured | ✅ stored |
| Scheme / host | ✅ `https://` · `secure-authentication.paymongo.com` |
| Resource in test mode | ✅ key present |
| Resource in live mode | ✅ withheld — no leak |
| `safeTestUrl()` rejects non-https | ✅ |
| `expires_at` sourced from PayMongo | ✅ 0.44 s drift vs the old computed value |
| Phase 7 unsafe advice corrected | ✅ |

Migration applied. Temp scripts deleted (`_qa*` count: 0).

⚠️ **Deferred to the user:** `npm run build` is on the Rule 6 guarded list.

**Next Steps:** Unchanged from Phase 7 — webhook feature tests, real invoice history, an add-ons table, and renewal handling. With the simulate link in place, the `payment.paid` → subscription activation path can finally be exercised end-to-end without spending money.

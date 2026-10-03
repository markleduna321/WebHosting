# 🏗️ Execution Plan — PayPal Integration (Replace PayMongo)

> **Mode:** Agent · **Lead Persona:** 🏗️ Tech Lead + ⚙️ Backend + 🖥️ Frontend

---

## Overview

Replace the existing **PayMongo QR Ph** payment flow with **PayPal** via `srmklive/paypal` (`composer require srmklive/paypal`). The PayMongo code will be **commented out** (not deleted) so it can be restored later.

The current flow is:
1. User picks a plan → `POST /api/checkout` → `CheckoutService.start()` → calls `PayMongoService` to create a QR code → saves `Payment` row
2. PayMongo sends a webhook → `PayMongoWebhookController` verifies signature → `CheckoutService.markPaid()`
3. Frontend polls `GET /api/checkout/{uuid}` until status flips to `paid`

The new flow will be:
1. User picks a plan → `POST /api/checkout` → `CheckoutService.start()` → calls `PayPalService` to create an Order → returns an **approval URL**
2. User is redirected to PayPal → approves → PayPal redirects back to a **return URL**
3. Backend captures the order on return → `CheckoutService.markPaid()`
4. Frontend detects status change and redirects to dashboard

---

## Phase 1: Backend — Install, Config, PayPalService, Comment Out PayMongo

### Blueprint — Files to be created / modified

| File | Action | Reason |
|---|---|---|
| `composer.json` | Modify | `composer require srmklive/paypal` |
| `config/paypal.php` | Create | Publish the srmklive config (or create manually) |
| `.env` | Modify | Comment out `PAYMONGO_*`, add `PAYPAL_*` vars |
| `.env.example` | Modify | Same changes as `.env` |
| `config/services.php` | Modify | Comment out `paymongo` block |
| `app/Services/PayPalService.php` | Create | Thin wrapper around srmklive/paypal for creating + capturing orders |
| `app/Services/PayMongoService.php` | Modify | Comment out entire class body (preserve file) |
| `app/Services/CheckoutService.php` | Modify | Replace `PayMongoService` DI with `PayPalService`; rewrite `start()` to create a PayPal Order instead of QR; comment out PayMongo-specific logic |
| `app/Http/Controllers/Api/PayPalController.php` | Create | Handles the return/cancel URLs after PayPal redirect, captures payment |
| `app/Http/Controllers/Api/PayMongoWebhookController.php` | Modify | Comment out entire class body (preserve file) |
| `routes/api.php` | Modify | Comment out PayMongo webhook route; add PayPal return/cancel routes |
| `bootstrap/app.php` | Modify | Comment out PayMongo CSRF exception; add PayPal webhook CSRF exception if using IPN/webhooks |
| `app/Models/Payment.php` | Modify | Add `paypal_order_id` and `paypal_capture_id` to `$fillable`; comment out `paymongo_*` fields |
| `app/Http/Resources/PaymentResource.php` | Modify | Replace PayMongo-specific fields with PayPal fields; add `approval_url` |
| `app/Exceptions/PaymentException.php` | Modify | Update docblock (cosmetic — gateway-agnostic) |

### ⚙️ Backend Detail

**1. Install the package**
```bash
composer require srmklive/paypal
```

**2. Publish config (or create `config/paypal.php` manually)**
```bash
php artisan vendor:publish --provider="Srmklive\PayPal\Providers\PayPalServiceProvider"
```

**3. New `.env` variables**
```env
# PayPal (srmklive/paypal)
PAYPAL_MODE=sandbox
PAYPAL_SANDBOX_CLIENT_ID=
PAYPAL_SANDBOX_CLIENT_SECRET=
PAYPAL_LIVE_CLIENT_ID=
PAYPAL_LIVE_CLIENT_SECRET=
PAYPAL_CURRENCY=PHP
```

**4. `PayPalService.php`** — responsibilities:
- `createOrder(int $amountCentavos, string $description, array $metadata): array` — returns `['order_id' => ..., 'approval_url' => ...]`
- `captureOrder(string $orderId): array` — captures the approved order, returns PayPal response
- Internally initialises the `PayPalClient` with sandbox/live credentials

**5. `CheckoutService.php` changes:**
- Constructor: inject `PayPalService` instead of `PayMongoService`
- `start()`:
  1. Create `Payment` row (same as today)
  2. Call `PayPalService::createOrder()` instead of QR flow
  3. Save `paypal_order_id` + `approval_url` to the Payment row
  4. Set status to `awaiting_payment`
  5. Return the Payment (frontend uses the `approval_url` to redirect)
- `markPaid()`: stays mostly the same; receives `paypal_capture_id` instead of `paymongo_payment_id`

**6. `PayPalController.php`** (new):
- `return(Request $request)` — PayPal redirects here after approval:
  1. Look up Payment by `paypal_order_id` (from query param `token`)
  2. Call `PayPalService::captureOrder()`
  3. Call `CheckoutService::markPaid()`
  4. Redirect to `/checkout/{uuid}/success` (Inertia page or redirect to dashboard)
- `cancel(Request $request)` — PayPal redirects here on cancel:
  1. Mark payment as failed
  2. Redirect back to checkout with a message

**7. Routes (`api.php` / `web.php`):**
```php
// PayPal return/cancel — unauthenticated because PayPal redirects the browser
Route::get('/paypal/return', [PayPalController::class, 'return'])->name('paypal.return');
Route::get('/paypal/cancel', [PayPalController::class, 'cancel'])->name('paypal.cancel');
```

> **Note:** These should go in `web.php` since they are browser redirects, not API calls. The return handler will capture payment then do an Inertia redirect.

### 🔒 Security
- PayPal return URL is validated by capturing the order server-side (only a valid, approved order can be captured)
- Payment amount is still server-derived, never from the client
- `PaymentPolicy` already guards access to Payment resources

### Migration

**`database/migrations/YYYY_MM_DD_add_paypal_columns_to_payments_table.php`**

```php
$table->string('paypal_order_id')->nullable()->unique()->after('paymongo_payment_id');
$table->string('paypal_capture_id')->nullable()->unique()->after('paypal_order_id');
$table->text('approval_url')->nullable()->after('paypal_capture_id');
```

The `paymongo_*` columns stay in the database (no dropping columns to preserve history).

---

## Phase 2: Frontend — Replace QR UI with PayPal Redirect Flow

### Blueprint — Files to be created / modified

| File | Action | Reason |
|---|---|---|
| `resources/js/pages/checkout/_sections/QrPaymentSection.jsx` | Modify → Rename/Replace | Comment out QR logic; replace with `PayPalPaymentSection.jsx` |
| `resources/js/pages/checkout/_sections/PayPalPaymentSection.jsx` | Create | Shows "Redirecting to PayPal…" + handles return status |
| `resources/js/pages/checkout/_sections/InvoicePreviewSection.jsx` | Modify | Change CTA button from "Pay with QR Ph" → "Pay with PayPal"; on success, redirect to `approval_url` |
| `resources/js/pages/checkout/page.jsx` | Modify | Swap `QrPaymentSection` for `PayPalPaymentSection` |
| `resources/js/pages/checkout/_sections/PaymentSuccessSection.jsx` | Create | Shown after PayPal return — "Payment received, redirecting…" |
| `resources/js/pages/account-billing/_sections/PaymentMethodCardSection.jsx` | Modify | Update copy from "Processed by PayMongo" → "Processed by PayPal" |

### 🖥️ Frontend Detail

**`InvoicePreviewSection.jsx` changes:**
- Button text: `Pay with PayPal` (with a PayPal-style icon or the Lucide `ExternalLink` icon)
- On mutation success: `window.location.href = payment.approval_url` (full redirect to PayPal)
- The QR polling logic is no longer needed

**`PayPalPaymentSection.jsx`** (replaces QrPaymentSection):
- Shown after the user clicks "Pay with PayPal" but before the redirect completes
- Shows a spinner + "Redirecting to PayPal…"
- After returning from PayPal, the backend handles capture and Inertia-redirects to dashboard

**Return flow (after PayPal redirect back):**
- The `PayPalController::return()` captures, marks paid, and does `return redirect('/dashboard')` or renders a success Inertia page
- No frontend polling needed — the browser is already on the return URL

### 🎨 UI Blueprint
- PayPal button uses the brand color (`#0070ba` / `#003087`)
- Loading state: spinner inside the button + "Processing…" text
- Error state: inline alert beneath the button
- Success state: green check card (reuse existing success pattern from `QrPaymentSection`)
- Cancel return: redirect back to checkout page with an error banner

---

## Phase 3: Cleanup & QA

- Full QA checklist run
- Dev log entry
- Verify sandbox end-to-end: create order → redirect → approve → capture → subscription activated

---

## Summary of What Gets Commented Out (Not Deleted)

| File | What's Commented |
|---|---|
| `app/Services/PayMongoService.php` | Entire class body |
| `app/Http/Controllers/Api/PayMongoWebhookController.php` | Entire class body |
| `routes/api.php` | PayMongo webhook route + import |
| `bootstrap/app.php` | PayMongo CSRF exception |
| `config/services.php` | `paymongo` config block |
| `.env` / `.env.example` | `PAYMONGO_*` variables |
| `resources/js/pages/checkout/_sections/QrPaymentSection.jsx` | Keep file, comment out or stop importing |
| `resources/js/pages/account-billing/_sections/PaymentMethodCardSection.jsx` | PayMongo copy replaced |

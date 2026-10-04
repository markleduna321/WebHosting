import React, { useMemo, useState } from "react";
import { usePage } from "@inertiajs/react";
import {
    AlertTriangle,
    Check,
    CreditCard,
    LockKeyhole,
    QrCode,
    ShieldCheck,
    Wallet,
} from "lucide-react";
import Button from "@/components/ui/Button";
import {
    formatBillingPeriod,
    getPlanBillingPeriods,
    getPlanPeriodDiscountPercent,
    getPlanPeriodPrice,
    formatCurrency,
} from "@/data/hostingPlans";
import { useCreatePaymentMutation } from "@/features/checkout/checkoutApi";
import PaymentMethodSection from "./PaymentMethodSection";

const PAY_ICONS = {
    qr: QrCode,
    card: CreditCard,
    ewallet: Wallet,
};

/** Only PayMongo's own HTTPS host may receive the redirect. */
function safeCheckoutUrl(url) {
    try {
        const parsed = new URL(url);
        return parsed.protocol === "https:" &&
            (parsed.hostname === "paymongo.com" ||
                parsed.hostname.endsWith(".paymongo.com"))
            ? parsed.href
            : null;
    } catch {
        return null;
    }
}

export default function InvoicePreviewSection({
    plan,
    cycle,
    addons = [],
    availableAddons = [],
    paymentMethods = [],
    onCycleChange,
    onCreated,
}) {
    const { auth } = usePage().props;
    const [createPayment, { isLoading }] = useCreatePaymentMutation();
    const [error, setError] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});
    const [redirecting, setRedirecting] = useState(false);
    const enabledPaymentMethods = paymentMethods.filter((method) => method.enabled);
    const [paymentMethod, setPaymentMethod] = useState(null);
    const selectedPaymentMethod =
        enabledPaymentMethods.find((method) => method.id === paymentMethod) ??
        enabledPaymentMethods[0] ??
        null;

    const PayIcon = PAY_ICONS[selectedPaymentMethod?.group] ?? QrCode;
    const payLabel = selectedPaymentMethod?.group === "card"
        ? "Pay with card"
        : `Pay with ${selectedPaymentMethod?.label ?? "QR Ph"}`;

    // Available periods are sourced from this plan's configured prices and discounts.
    const availableCycles = useMemo(() => {
        return getPlanBillingPeriods(plan).map((months) => ({
            id: String(months),
            label: formatBillingPeriod(months),
            months,
        }));
    }, [plan]);

    const months = useMemo(() => {
        if (cycle === "annual") return 12;
        if (cycle === "monthly") return 1;
        const parsed = Number(cycle);
        return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : null;
    }, [cycle]);

    const basePrice = months == null ? null : getPlanPeriodPrice(plan, months);
    const discountPercent = months == null
        ? 0
        : getPlanPeriodDiscountPercent(plan, months);
    const currency = plan?.currency ?? "PHP";

    const selectedAddOns = useMemo(
        () => addons
            .map((id) => availableAddons.find((addOn) => addOn.id === id))
            .filter(Boolean),
        [addons, availableAddons]
    );

    const addonsTotal = useMemo(() => {
        return selectedAddOns.reduce((total, addOn) => {
            const quantity = months > 1 && addOn.period === "month"
                ? months
                : 1;
            return total + Math.round(Number(addOn.price) * 100) * quantity;
        }, 0);
    }, [selectedAddOns, months]);

    const planTotalCents = basePrice == null ? null : Math.round(basePrice * 100);
    const totalCents = planTotalCents == null ? null : planTotalCents + addonsTotal;
    const total = totalCents == null ? null : totalCents / 100;
    const regularPlanCents = months == null || plan?.monthlyPrice == null
        ? null
        : Math.round(Number(plan.monthlyPrice) * months * 100);
    const savingsCents = regularPlanCents == null || planTotalCents == null
        ? 0
        : Math.max(0, regularPlanCents - planTotalCents);
    const cycleIsAvailable = months != null &&
        availableCycles.some((option) => option.months === months);
    const canPay = cycleIsAvailable &&
        basePrice != null &&
        basePrice > 0 &&
        selectedPaymentMethod != null;

    const handlePay = async () => {
        setError(null);
        setFieldErrors({});

        if (!canPay || !selectedPaymentMethod) {
            setError("Choose an available billing period and payment method to continue.");
            return;
        }

        try {
            const payment = await createPayment({
                plan_slug: plan.slug,
                billing_cycle: String(months),
                addons: addons,
                payment_method: selectedPaymentMethod.id,
            }).unwrap();

            if (payment?.checkout_url) {
                const target = safeCheckoutUrl(payment.checkout_url);

                if (!target) {
                    setError("We could not open the payment page. Please try again.");
                    return;
                }

                setRedirecting(true);
                window.location.assign(target);
                return;
            }

            if (!payment?.uuid) {
                setError("The payment service did not return a payment reference. Please try again.");
                return;
            }

            onCreated(payment);
        } catch (err) {
            const validationErrors = err?.data?.errors ?? {};
            const billingCycleError = validationErrors?.billing_cycle?.[0];
            const paymentMethodError = validationErrors?.payment_method?.[0];

            setFieldErrors({
                billing_cycle: billingCycleError,
                payment_method: paymentMethodError,
            });

            const fieldError =
                paymentMethodError ??
                validationErrors?.plan_slug?.[0] ??
                billingCycleError ??
                validationErrors?.addons?.[0];

            setError(
                paymentMethodError || billingCycleError
                    ? null
                    : fieldError ?? err?.data?.message ??
                "We could not start that payment. Please try again.",
            );
        }
    };

    return (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.12)]">
            <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 px-6 py-6 text-white sm:px-7">
                <div className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full bg-blue-500/20 blur-3xl" />
                <div className="relative flex items-start justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-300">
                            Secure checkout
                        </p>
                        <h2 className="mt-2 text-xl font-bold tracking-tight sm:text-2xl">
                            Review and pay
                        </h2>
                        <p className="mt-1 text-sm text-slate-300">
                            Your plan starts after payment is confirmed.
                        </p>
                    </div>
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.07] text-blue-200 shadow-inner">
                        <ShieldCheck className="h-5 w-5" />
                    </span>
                </div>
                <div className="relative mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-slate-300">
                    <span className="inline-flex items-center gap-1.5">
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                        Plan selected
                    </span>
                    <span className="h-px w-6 bg-white/20" />
                    <span className="inline-flex items-center gap-1.5">
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                        Account created
                    </span>
                    <span className="h-px w-6 bg-white/20" />
                    <span className="inline-flex items-center gap-1.5 text-white">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold text-white">
                            3
                        </span>
                        Payment
                    </span>
                </div>
            </div>

            <div className="space-y-6 px-5 py-6 sm:px-7">
                <section aria-labelledby="billing-period-heading">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <h3 id="billing-period-heading" className="text-sm font-bold text-slate-900">
                                Billing period
                            </h3>
                            <p className="mt-1 text-xs text-slate-500">
                                Choose a period configured for this plan.
                            </p>
                        </div>
                        {discountPercent > 0 && (
                            <span className="shrink-0 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                                Save {discountPercent}%
                            </span>
                        )}
                    </div>

                    {availableCycles.length > 0 ? (
                        <div
                            role="group"
                            aria-label="Billing period"
                            aria-describedby={fieldErrors.billing_cycle ? "billing-period-error" : undefined}
                            className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3"
                        >
                            {availableCycles.map((option) => {
                                const active = months === option.months;
                                const savings = getPlanPeriodDiscountPercent(plan, option.months);

                                return (
                                    <button
                                        key={option.id}
                                        type="button"
                                        onClick={() => {
                                            onCycleChange(option.id);
                                            setError(null);
                                            setFieldErrors((current) => ({
                                                ...current,
                                                billing_cycle: null,
                                            }));
                                        }}
                                        disabled={isLoading || redirecting}
                                        aria-pressed={active}
                                        className={`min-h-12 rounded-xl border px-3 py-2 text-left transition-[background-color,border-color,box-shadow] duration-200 motion-reduce:transition-none focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                                            active
                                                ? "border-blue-500 bg-blue-50 shadow-[0_0_0_3px_rgba(59,130,246,0.12)]"
                                                : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                                        }`}
                                    >
                                        <span className="block text-sm font-semibold text-slate-900">
                                            {option.label}
                                        </span>
                                        {savings > 0 && (
                                            <span className="mt-0.5 block text-[11px] font-medium text-emerald-700">
                                                {savings}% savings
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <p role="alert" className="mt-3 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
                            No billing periods are available for this plan. Please contact support.
                        </p>
                    )}
                    {fieldErrors.billing_cycle && (
                        <p id="billing-period-error" role="alert" className="mt-2 text-sm text-red-600">
                            {fieldErrors.billing_cycle}
                        </p>
                    )}
                </section>

                <section aria-labelledby="order-summary-heading">
                    <div className="flex items-center justify-between">
                        <h3 id="order-summary-heading" className="text-sm font-bold text-slate-900">
                            Order summary
                        </h3>
                        <span className="text-xs text-slate-500">
                            {months != null ? formatBillingPeriod(months) : "Period unavailable"}
                        </span>
                    </div>
                    <dl className="mt-3 space-y-3 rounded-2xl border border-slate-100 bg-slate-50/80 p-4 text-sm">
                        <div className="flex items-start justify-between gap-4">
                            <dt className="min-w-0 text-slate-600">
                                <span className="block font-medium text-slate-800">
                                    {plan?.name ?? "Hosting plan"}
                                </span>
                                <span className="mt-0.5 block text-xs text-slate-500">
                                    Starts after payment confirmation
                                </span>
                                {savingsCents > 0 && (
                                    <span className="mt-1 block text-xs text-slate-500">
                                        <span className="line-through">
                                            {formatCurrency(regularPlanCents / 100, currency)}
                                        </span>
                                    </span>
                                )}
                            </dt>
                            <dd className="shrink-0 text-right font-semibold text-slate-900">
                                {basePrice != null ? formatCurrency(basePrice, currency) : "—"}
                            </dd>
                        </div>

                        {discountPercent > 0 && (
                            <div className="flex items-center justify-between gap-4 text-xs">
                                <dt className="text-emerald-700">
                                    Period discount ({discountPercent}%)
                                </dt>
                                <dd className="font-semibold text-emerald-700">
                                    −{formatCurrency(savingsCents / 100, currency)}
                                </dd>
                            </div>
                        )}

                        {selectedAddOns.map((addOn) => {
                            const quantity = months > 1 && addOn.period === "month"
                                ? months
                                : 1;
                            const lineTotalCents = Math.round(Number(addOn.price) * 100) * quantity;

                            return (
                                <div key={addOn.id} className="flex items-start justify-between gap-4">
                                    <dt className="min-w-0 text-slate-600">
                                        <span className="block">{addOn.label}</span>
                                        {quantity > 1 && (
                                            <span className="mt-0.5 block text-xs text-slate-500">
                                                {formatCurrency(addOn.price, currency)} × {quantity} months
                                            </span>
                                        )}
                                    </dt>
                                    <dd className="shrink-0 text-right font-medium text-slate-800">
                                        {formatCurrency(lineTotalCents / 100, currency)}
                                    </dd>
                                </div>
                            );
                        })}

                        <div className="border-t border-dashed border-slate-200 pt-3">
                            <div className="flex items-center justify-between text-base font-bold text-slate-950">
                                <dt>Total due today</dt>
                                <dd>{total != null ? formatCurrency(total, currency) : "—"}</dd>
                            </div>
                        </div>
                    </dl>
                </section>

                <section aria-labelledby="payment-method-heading">
                    <p className="text-xs text-slate-500">
                        Payment details are encrypted and processed securely.
                    </p>
                    {paymentMethods.length > 0 ? (
                        <PaymentMethodSection
                            methods={paymentMethods}
                            value={selectedPaymentMethod?.id}
                            onChange={(id) => {
                                setPaymentMethod(id);
                                setError(null);
                                setFieldErrors((current) => ({
                                    ...current,
                                    payment_method: null,
                                }));
                            }}
                            errorId={fieldErrors.payment_method ? "payment-method-error" : undefined}
                            disabled={isLoading || redirecting}
                        />
                    ) : (
                        <p role="alert" className="mt-3 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
                            No payment methods are available right now. Please try again later.
                        </p>
                    )}
                    {fieldErrors.payment_method && (
                        <p id="payment-method-error" role="alert" className="mt-2 text-sm text-red-600">
                            {fieldErrors.payment_method}
                        </p>
                    )}
                </section>

                {auth?.user?.plan && (
                    <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
                        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                        <p>
                            Purchasing a new plan will immediately replace your current active plan.
                        </p>
                    </div>
                )}

                {error && (
                    <p
                        role="alert"
                        className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                    >
                        {error}
                    </p>
                )}

                <div>
                    <Button
                        variant="primary"
                        size="md"
                        onClick={handlePay}
                        loading={isLoading || redirecting}
                        disabled={!canPay || isLoading || redirecting}
                        className="min-h-12 w-full gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-sm font-bold shadow-[0_10px_25px_rgba(37,99,235,0.25)] transition-[box-shadow,transform] hover:shadow-[0_14px_30px_rgba(37,99,235,0.35)] focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    >
                        <PayIcon className="h-4 w-4" />
                        {redirecting ? "Opening secure payment page..." : payLabel}
                    </Button>
                    <p
                        aria-live="polite"
                        className="mt-3 flex items-center justify-center gap-1.5 text-xs text-slate-500"
                    >
                        <LockKeyhole className="h-3.5 w-3.5" />
                        Secure payment powered by PayMongo
                    </p>
                </div>
            </div>
        </div>
    );
}

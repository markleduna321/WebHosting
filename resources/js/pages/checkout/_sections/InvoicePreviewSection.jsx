import React, { useMemo, useState } from "react";
import { usePage } from "@inertiajs/react";
import { CreditCard, QrCode, Wallet } from "lucide-react";
import Button from "@/components/ui/Button";
import { formatCurrency } from "@/data/hostingPlans";
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

const CYCLE_LABELS = {
    1: "Monthly",
    12: "1 Year",
    24: "2 Years",
    48: "4 Years",
};

function formatDate(date) {
    return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
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
    const [redirecting, setRedirecting] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState(
        () => paymentMethods.find((m) => m.enabled)?.id ?? "qrph",
    );

    const selectedMethod = paymentMethods.find((m) => m.id === paymentMethod);
    const PayIcon = PAY_ICONS[selectedMethod?.group] ?? QrCode;
    const payLabel =
        selectedMethod?.group === "card"
            ? "Pay with card"
            : `Pay with ${selectedMethod?.label ?? "QR Ph"}`;

    // Build available cycle options from the plan's prices JSON + always include monthly.
    const availableCycles = useMemo(() => {
        const prices = plan.prices ?? {};
        const cycles = [{ id: "1", label: "Monthly", months: 1 }];

        Object.keys(prices)
            .map(Number)
            .filter((m) => m > 1)
            .sort((a, b) => a - b)
            .forEach((m) => {
                cycles.push({
                    id: String(m),
                    label: CYCLE_LABELS[m] ?? `${m} Months`,
                    months: m,
                });
            });

        return cycles;
    }, [plan.prices]);

    // Use Number() to convert the string cycle back to an integer, default to 1 (monthly).
    // The previous implementation used "monthly" and "annual" strings. We map "annual" to 12.
    const months = useMemo(() => {
        if (cycle === "annual") return 12;
        if (cycle === "monthly") return 1;
        return Number(cycle) || 1;
    }, [cycle]);

    const prices = plan.prices ?? {};
    const basePrice = months === 1 ? plan.monthlyPrice : prices[months];

    const selectedAddOns = useMemo(
        () => addons.map(id => availableAddons.find(a => a.id === id)).filter(Boolean),
        [addons, availableAddons]
    );

    const addonsTotal = useMemo(() => {
        return selectedAddOns.reduce((total, addOn) => {
            const addOnPrice = months > 1 && addOn.period === "month"
                ? addOn.price * months
                : addOn.price;
            return total + addOnPrice;
        }, 0);
    }, [selectedAddOns, months]);

    const total = (basePrice ?? 0) + addonsTotal;

    const period = useMemo(() => {
        const start = new Date();
        const end = new Date(start);
        end.setMonth(end.getMonth() + months);
        return `${formatDate(start)} – ${formatDate(end)}`;
    }, [months]);

    const handlePay = async () => {
        setError(null);

        try {
            const payment = await createPayment({
                plan_slug: plan.slug,
                billing_cycle: cycle === "annual" ? "12" : (cycle === "monthly" ? "1" : String(cycle)),
                addons: addons,
                payment_method: paymentMethod,
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

            onCreated(payment);
        } catch (err) {
            const fieldError =
                err?.data?.errors?.payment_method?.[0] ??
                err?.data?.errors?.plan_slug?.[0] ??
                err?.data?.errors?.billing_cycle?.[0];

            setError(
                fieldError ??
                err?.data?.message ??
                "We could not start that payment. Please try again.",
            );
        }
    };

    return (
        <div className="rounded-xl border border-gray-200 bg-white px-6 py-5">
            <h2 className="text-sm font-bold text-slate-900">Invoice preview</h2>
            <p className="mt-1 text-xs text-slate-500">
                Review the charge before you pay.
            </p>

            <div
                role="group"
                aria-label="Billing cycle"
                className="mt-4 flex rounded-lg bg-slate-100 p-1"
            >
                {availableCycles.map((option) => {
                    const active = String(months) === option.id;

                    return (
                        <button
                            key={option.id}
                            type="button"
                            onClick={() => onCycleChange(option.id)}
                            disabled={isLoading}
                            aria-pressed={active}
                            className={`flex-1 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-40 ${active
                                ? "bg-white text-slate-900 shadow-sm"
                                : "text-slate-500 hover:text-slate-700"
                                }`}
                        >
                            {option.label}
                        </button>
                    );
                })}
            </div>

            <dl className="mt-5 space-y-3 text-sm">
                <div className="flex items-start justify-between gap-3">
                    <dt className="text-slate-600">
                        {plan.name} · {CYCLE_LABELS[months] ?? `${months} Months`}
                        <span className="mt-0.5 block text-xs text-slate-400">
                            {period}
                        </span>
                    </dt>
                    <dd className="font-medium text-slate-900">
                        {basePrice != null ? formatCurrency(basePrice) : "—"}
                    </dd>
                </div>

                {selectedAddOns.map((addOn) => {
                    const addOnPrice = months > 1 && addOn.period === "month"
                        ? addOn.price * months
                        : addOn.price;
                    return (
                        <div key={addOn.id} className="flex items-start justify-between gap-3">
                            <dt className="text-slate-600">
                                {addOn.label}
                            </dt>
                            <dd className="font-medium text-slate-900 text-right">
                                {formatCurrency(addOnPrice)}
                            </dd>
                        </div>
                    );
                })}

                <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                    <dt className="text-slate-600">Subtotal</dt>
                    <dd className="font-medium text-slate-900">
                        {formatCurrency(total)}
                    </dd>
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                    <dt className="text-base font-bold text-slate-900">
                        Total due today
                    </dt>
                    <dd className="text-base font-bold text-slate-900">
                        {formatCurrency(total)}
                    </dd>
                </div>
            </dl>

            {paymentMethods.length > 0 && (
                <PaymentMethodSection
                    methods={paymentMethods}
                    value={paymentMethod}
                    onChange={setPaymentMethod}
                    disabled={isLoading || redirecting}
                />
            )}

            {error && (
                <p
                    role="alert"
                    className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700"
                >
                    {error}
                </p>
            )}

            <Button
                variant="primary"
                size="md"
                onClick={handlePay}
                loading={isLoading || redirecting}
                disabled={isLoading || redirecting}
                className="mt-5 w-full rounded-lg gap-2"
            >
                <PayIcon className="h-4 w-4" />
                {redirecting ? "Opening secure payment page..." : payLabel}
            </Button>

            {auth?.user?.plan && (
                <p className="mt-3 text-center text-xs text-orange-600 font-medium bg-orange-50 p-2 rounded-md">
                    Warning: Purchasing a new plan will immediately cancel your current active plan.
                </p>
            )}

            {paymentMethod === "qrph" && (
                <p className="mt-2 text-center text-xs text-slate-400">
                    Scan the QR code with any bank or e-wallet app that supports QR Ph.
                </p>
            )}
        </div>
    );
}

import React, { useMemo, useState } from "react";
import { usePage } from "@inertiajs/react";
import { QrCode } from "lucide-react";
import Button from "@/components/ui/Button";
import { formatCurrency } from "@/data/hostingPlans";
import { useCreatePaymentMutation } from "@/features/checkout/checkoutApi";

const CYCLES = [
    { id: "monthly", label: "Monthly" },
    { id: "annual", label: "Annual" },
];

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
    onCycleChange,
    onCreated,
}) {
    const { auth } = usePage().props;
    const [createPayment, { isLoading }] = useCreatePaymentMutation();
    const [error, setError] = useState(null);

    const annualAvailable = plan.prices && plan.prices[12] !== undefined;
    const basePrice = cycle === "annual" ? plan.prices[12] : plan.monthlyPrice;

    const selectedAddOns = useMemo(
        () => addons.map(id => availableAddons.find(a => a.id === id)).filter(Boolean),
        [addons, availableAddons]
    );

    const addonsTotal = useMemo(() => {
        return selectedAddOns.reduce((total, addOn) => {
            const addOnPrice = cycle === "annual" && addOn.period === "month" 
                ? addOn.price * 12 
                : addOn.price;
            return total + addOnPrice;
        }, 0);
    }, [selectedAddOns, cycle]);

    const total = basePrice + addonsTotal;

    const period = useMemo(() => {
        const start = new Date();
        const end = new Date(start);

        if (cycle === "annual") {
            end.setFullYear(end.getFullYear() + 1);
        } else {
            end.setMonth(end.getMonth() + 1);
        }

        return `${formatDate(start)} – ${formatDate(end)}`;
    }, [cycle]);

    const handlePay = async () => {
        setError(null);

        try {
            const payment = await createPayment({
                plan_slug: plan.slug,
                billing_cycle: cycle,
                addons: addons,
            }).unwrap();

            onCreated(payment);
        } catch (err) {
            const fieldError =
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
                {CYCLES.map((option) => {
                    const disabled = option.id === "annual" && !annualAvailable;
                    const active = cycle === option.id;

                    return (
                        <button
                            key={option.id}
                            type="button"
                            onClick={() => onCycleChange(option.id)}
                            disabled={disabled || isLoading}
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

            {!annualAvailable && (
                <p className="mt-2 text-xs text-slate-400">
                    Annual billing isn&apos;t offered on this plan.
                </p>
            )}

            <dl className="mt-5 space-y-3 text-sm">
                <div className="flex items-start justify-between gap-3">
                    <dt className="text-slate-600">
                        {plan.name} · {cycle === "annual" ? "1 year" : "1 month"}
                        <span className="mt-0.5 block text-xs text-slate-400">
                            {period}
                        </span>
                    </dt>
                    <dd className="font-medium text-slate-900">
                        {formatCurrency(basePrice)}
                    </dd>
                </div>

                {selectedAddOns.map((addOn) => {
                    const addOnPrice = cycle === "annual" && addOn.period === "month"
                        ? addOn.price * 12
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
                loading={isLoading}
                disabled={isLoading}
                className="mt-5 w-full rounded-lg gap-2"
            >
                <QrCode className="h-4 w-4" />
                Pay with QR Ph
            </Button>

            {auth?.user?.plan && (
                <p className="mt-3 text-center text-xs text-orange-600 font-medium bg-orange-50 p-2 rounded-md">
                    Warning: Purchasing a new plan will immediately cancel your current active plan.
                </p>
            )}

            <p className="mt-2 text-center text-xs text-slate-400">
                Scan the QR code with any bank or e-wallet app that supports QR Ph.
            </p>
        </div>
    );
}

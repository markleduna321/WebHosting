import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
    CheckCircle2,
    Shield,
} from "lucide-react";
import React, { useMemo, useState } from "react";
import {
    formatBillingPeriod,
    formatCurrency,
    getPlanPeriodDiscountPercent,
    getPlanPeriodPrice,
} from "../../../../data/hostingPlans";

export default function CheckoutSummarySection({
    plan,
    availableAddons = [],
    selectedAddOnIds = [],
    onToggleAddOn,
    onProceed,
    period = 1,
}) {
    const [coupon, setCoupon] = useState("");
    const [showCoupon, setShowCoupon] = useState(false);
    const shouldReduceMotion = useReducedMotion();

    const selectedAddOns = useMemo(
        () => availableAddons.filter((addOn) => selectedAddOnIds.includes(addOn.id)),
        [selectedAddOnIds, availableAddons],
    );

    // Centavo math mirrors CheckoutService: monthly add-ons are charged for every month of the term.
    const addOnLines = useMemo(
        () => selectedAddOns.map((addOn) => {
            const quantity = period > 1 && addOn.period === "month" ? period : 1;

            return {
                addOn,
                quantity,
                totalCents: Math.round(Number(addOn.price) * 100) * quantity,
            };
        }),
        [selectedAddOns, period],
    );
    const addOnsCents = addOnLines.reduce((sum, line) => sum + line.totalCents, 0);

    const hasFixedPrice = plan?.monthlyPrice != null;
    const planTotal = hasFixedPrice ? getPlanPeriodPrice(plan, period) : null;
    const planCents = planTotal == null ? null : Math.round(planTotal * 100);
    const regularCents = hasFixedPrice && period > 1
        ? Math.round(Number(plan.monthlyPrice) * 100) * period
        : null;
    const savingsCents = regularCents != null && planCents != null
        ? Math.max(0, regularCents - planCents)
        : 0;
    const discountPercent = getPlanPeriodDiscountPercent(plan, period);
    const currency = plan?.currency ?? "PHP";
    const periodLabel = formatBillingPeriod(period);
    const subtotalDisplay = planCents != null
        ? formatCurrency(planCents / 100, currency)
        : hasFixedPrice
            ? "Price unavailable"
            : plan?.price ?? "Custom";
    const totalDisplay = planCents != null
        ? formatCurrency((planCents + addOnsCents) / 100, currency)
        : subtotalDisplay;

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            {/* Header */}
            <h3 className="text-base font-bold text-slate-900">
                Order summary
            </h3>

            {/* Line Items */}
            <div className="mt-5 space-y-3">
                {/* Plan */}
                <div>
                    <p className="text-sm font-semibold text-slate-900">
                        {plan?.name ?? "Plan"}
                    </p>
                    <div className="mt-1.5 flex items-center justify-between text-sm">
                        <span className="text-slate-500">{periodLabel}</span>
                        <span className="text-right">
                            {savingsCents > 0 && (
                                <span className="mr-1.5 text-xs text-slate-400 line-through">
                                    {formatCurrency(regularCents / 100, currency)}
                                </span>
                            )}
                            <span className="font-medium text-slate-900">
                                {subtotalDisplay}
                            </span>
                        </span>
                    </div>
                    {savingsCents > 0 && (
                        <div className="mt-1 flex items-center justify-between text-xs font-medium text-emerald-600">
                            <span>
                                You save{discountPercent > 0 ? ` (${discountPercent}%)` : ""}
                            </span>
                            <span>
                                −{formatCurrency(savingsCents / 100, currency)}
                            </span>
                        </div>
                    )}
                </div>

                {/* Selected add-ons */}
                <AnimatePresence initial={false}>
                    {addOnLines.map(({ addOn, quantity, totalCents }) => {
                        return (
                            <motion.div
                                key={addOn.id}
                                layout
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.15 }}
                                className="overflow-hidden"
                            >
                                <div className="flex items-start justify-between gap-3 text-sm">
                                    <span className="min-w-0 text-slate-500">
                                        <span className="block">{addOn.label}</span>
                                        <span className="block text-xs text-slate-400">
                                            {quantity > 1
                                                ? `${formatCurrency(addOn.price, currency)} × ${quantity} months`
                                                : `${formatCurrency(addOn.price, currency)}/${addOn.period}`}
                                        </span>
                                    </span>
                                    <span className="shrink-0 font-medium text-slate-900">
                                        {formatCurrency(totalCents / 100, currency)}
                                    </span>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                {/* Divider */}
                <div className="border-t border-gray-100" />

                {/* Total */}
                <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-slate-900">Total</span>
                    <span className="text-lg font-black text-slate-900">
                        {totalDisplay}
                    </span>
                </div>
            </div>

            {/* Coupon */}
            <div className="mt-4">
                {!showCoupon ? (
                    <button
                        type="button"
                        onClick={() => setShowCoupon(true)}
                        className="text-sm font-medium text-blue-600 underline underline-offset-2 hover:text-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    >
                        Have a coupon code?
                    </button>
                ) : (
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={coupon}
                            onChange={(e) => setCoupon(e.target.value)}
                            placeholder="Enter code"
                            autoFocus
                            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <button
                            type="button"
                            className="shrink-0 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
                        >
                            Apply
                        </button>
                    </div>
                )}
            </div>

            {/* CTA */}
            <motion.button
                type="button"
                whileHover={shouldReduceMotion ? undefined : { scale: 1.01 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                onClick={onProceed}
                className="mt-5 w-full rounded-xl bg-blue-600 px-4 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
                Continue
            </motion.button>

            {/* Trust badges */}
            <div className="mt-5 space-y-3 text-center">
                <p className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
                    <Shield className="h-3.5 w-3.5" />
                    30-day money-back guarantee
                </p>
                <div className="flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-blue-500" />
                    <span className="text-xs font-medium text-slate-500">
                        Quality You Can Trust
                    </span>
                </div>
            </div>
        </div>
    );
}

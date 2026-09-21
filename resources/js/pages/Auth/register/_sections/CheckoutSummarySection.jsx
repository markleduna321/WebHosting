import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
    CheckCircle2,
    Shield,
} from "lucide-react";
import React, { useMemo, useState } from "react";
import { ADD_ONS, formatCurrency } from "../../../../data/hostingPlans";

export default function CheckoutSummarySection({
    plan,
    selectedAddOnIds = [],
    onToggleAddOn,
    onProceed,
    period = 1,
}) {
    const [coupon, setCoupon] = useState("");
    const [showCoupon, setShowCoupon] = useState(false);
    const shouldReduceMotion = useReducedMotion();

    const selectedAddOns = useMemo(
        () => ADD_ONS.filter((addOn) => selectedAddOnIds.includes(addOn.id)),
        [selectedAddOnIds],
    );

    const addOnsTotal = useMemo(
        () => selectedAddOns.reduce((sum, addOn) => sum + addOn.price, 0),
        [selectedAddOns],
    );

    const hasFixedPrice = plan?.monthlyPrice != null;
    const planTotal = hasFixedPrice ? plan.monthlyPrice * period : null;
    const periodLabel = period === 1 ? "Monthly" : `${period}-month period`;
    const subtotalDisplay = hasFixedPrice
        ? formatCurrency(planTotal)
        : plan?.price;
    const totalDisplay = hasFixedPrice
        ? formatCurrency(planTotal + addOnsTotal)
        : plan?.price;

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
                        {plan?.name ?? "Student"} plan
                    </p>
                    <div className="mt-1.5 flex items-center justify-between text-sm">
                        <span className="text-slate-500">{periodLabel}</span>
                        <span className="font-medium text-slate-900">
                            {subtotalDisplay}
                        </span>
                    </div>
                </div>

                {/* Selected add-ons */}
                <AnimatePresence initial={false}>
                    {selectedAddOns.map((addOn) => (
                        <motion.div
                            key={addOn.id}
                            layout
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.15 }}
                            className="overflow-hidden"
                        >
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-500">{addOn.label}</span>
                                <span className="font-medium text-slate-900">
                                    {formatCurrency(addOn.price)}/{addOn.period}
                                </span>
                            </div>
                        </motion.div>
                    ))}
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

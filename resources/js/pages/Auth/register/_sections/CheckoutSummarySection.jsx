import { Link } from "@inertiajs/react";
import { ArrowLeft, Trash2 } from "lucide-react";
import React, { useMemo, useState } from "react";
import { ADD_ONS, formatCurrency } from "../../../../data/hostingPlans";

export default function CheckoutSummarySection({
    plan,
    selectedAddOnIds = [],
    onRemoveAddOn,
    onProceed,
}) {
    const [coupon, setCoupon] = useState("");

    const selectedAddOns = useMemo(
        () => ADD_ONS.filter((addOn) => selectedAddOnIds.includes(addOn.id)),
        [selectedAddOnIds],
    );
    const addOnsTotal = useMemo(
        () => selectedAddOns.reduce((sum, addOn) => sum + addOn.price, 0),
        [selectedAddOns],
    );
    const hasFixedPrice = plan?.monthlyPrice != null;
    const subtotalDisplay = hasFixedPrice
        ? formatCurrency(plan.monthlyPrice)
        : plan?.price;
    const totalDisplay = hasFixedPrice
        ? formatCurrency(plan.monthlyPrice + addOnsTotal)
        : plan?.price;

    return (
        <div className="mx-auto w-full max-w-xl">
            {/* Back Link */}
            <Link
                href="/"
                className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 mb-10 transition-colors"
            >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to home
            </Link>

            <div className="mb-10">
                <h2 className="text-3xl font-extrabold text-black">
                    Order Summary
                </h2>
                <p className="mt-2 text-base text-slate-500">
                    Review your plan before creating your student account.
                </p>
            </div>

            <div className="space-y-8">
                <div className="flex items-center gap-3">
                    <input
                        type="text"
                        value={coupon}
                        onChange={(e) => setCoupon(e.target.value)}
                        placeholder="Coupon code"
                        className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3.5 text-base text-slate-900 placeholder-slate-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                        type="button"
                        className="shrink-0 rounded-lg border border-blue-600 px-6 py-3.5 text-sm font-semibold text-blue-600 hover:bg-blue-50 transition-colors"
                    >
                        Apply
                    </button>
                </div>

                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <span className="text-md font-medium text-slate-700">
                        Subtotal
                    </span>
                    <span className="text-md font-bold text-slate-900">
                        {subtotalDisplay}
                    </span>
                </div>

                <div className="border-b border-slate-100 pb-4">
                    <div className="flex items-center justify-between">
                        <span className="text-md font-medium text-slate-700">
                            Add-ons
                        </span>
                        <span className="text-md font-bold text-slate-900">
                            {formatCurrency(addOnsTotal)}
                        </span>
                    </div>
                    <div className="mt-3 space-y-2">
                        {selectedAddOns.length > 0 ? (
                            selectedAddOns.map((addOn) => (
                                <div
                                    key={addOn.id}
                                    className="flex items-center justify-between gap-2 text-sm text-slate-500"
                                >
                                    <span className="flex items-center gap-1.5">
                                        <span className="text-emerald-600">
                                            +
                                        </span>
                                        {addOn.label} —{" "}
                                        {formatCurrency(addOn.price)}/
                                        {addOn.period}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            onRemoveAddOn?.(addOn.id)
                                        }
                                        aria-label={`Remove ${addOn.label}`}
                                        className="shrink-0 text-slate-400 hover:text-red-600 transition-colors"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-slate-400">
                                No add-ons selected yet.
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-between pb-2">
                    <span className="text-base font-bold text-slate-900">
                        Total
                    </span>
                    <span className="text-base font-bold text-slate-900">
                        {totalDisplay}
                    </span>
                </div>

                <button
                    type="button"
                    onClick={onProceed}
                    className="w-full rounded-lg bg-blue-600 px-4 py-3.5 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                    Proceed to Checkout
                </button>
            </div>
        </div>
    );
}


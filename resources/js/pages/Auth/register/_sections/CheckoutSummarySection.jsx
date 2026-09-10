import { Link } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react";
import React, { useState } from "react";

const ADD_ON_ITEMS = [
    { label: "Extra 10 GB Storage", price: "₱50/month" },
    { label: "Website Security", price: "₱199/month" },
];

export default function CheckoutSummarySection({ onProceed }) {
    const [coupon, setCoupon] = useState("");

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
                        ₱199
                    </span>
                </div>

                <div className="border-b border-slate-100 pb-4">
                    <div className="flex items-center justify-between">
                        <span className="text-md font-medium text-slate-700">
                            Add-ons
                        </span>
                        <span className="text-md font-bold text-slate-900">
                            ₱249
                        </span>
                    </div>
                    <div className="mt-3 space-y-2">
                        {ADD_ON_ITEMS.map((item) => (
                            <div
                                key={item.label}
                                className="flex items-center gap-1.5 text-sm text-slate-500"
                            >
                                <span className="text-emerald-600">+</span>
                                {item.label} — {item.price}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex items-center justify-between pb-2">
                    <span className="text-base font-bold text-slate-900">
                        Total
                    </span>
                    <span className="text-base font-bold text-slate-900">
                        ₱448
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

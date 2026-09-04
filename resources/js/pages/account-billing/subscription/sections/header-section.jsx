import React, { useState } from "react";
import Button from "../../../../_components/button";

export default function HeaderSection() {
    const [autoRenew, setAutoRenew] = useState(false);

    return (
        <div className="rounded-xl border border-gray-200 bg-white px-6 py-5">
            <div className="flex items-center justify-between gap-4">
                {/* Left: subscription info */}
                <div>
                    <p className="text-xs text-slate-400 mb-0.5">
                        Current subscription
                    </p>
                    <p className="text-lg font-bold text-slate-900">
                        Student Pro
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                        Renews Sep 1, 2026 · ₱199.00 charged to GCash ●●●● 4821
                    </p>
                </div>

                {/* Right: action buttons */}
                <div className="flex items-center gap-2 shrink-0">
                    <Button variant="primary" size="sm" className="rounded-lg">
                        Change plan
                    </Button>
                    <Button
                        variant="light"
                        size="sm"
                        outlined
                        className="rounded-lg"
                    >
                        Payment methods
                    </Button>
                </div>
            </div>

            {/* Auto-renew checkbox */}
            <div className="mt-4 flex items-center gap-2">
                <input
                    id="auto-renew"
                    type="checkbox"
                    checked={autoRenew}
                    onChange={(e) => setAutoRenew(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <label
                    htmlFor="auto-renew"
                    className="text-xs text-slate-600 cursor-pointer select-none"
                >
                    Automatically renew Student Pro each month
                </label>
            </div>
        </div>
    );
}

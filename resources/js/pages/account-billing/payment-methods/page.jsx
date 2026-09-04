import React from "react";
import AccountBillingLayout from "../layout";

export default function Page() {
    return (
        <AccountBillingLayout>
            <div className="rounded-xl border border-gray-200 bg-white p-6 text-center">
                <p className="text-sm font-semibold text-slate-900">
                    Payment Methods
                </p>
                <p className="mt-1 text-sm text-slate-500">
                    Manage your saved cards and payment options.
                </p>
            </div>
        </AccountBillingLayout>
    );
}

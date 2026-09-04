import React from "react";
import AccountBillingLayout from "../layout";

export default function Page() {
    return (
        <AccountBillingLayout>
            <div className="rounded-xl border border-gray-200 bg-white p-6 text-center">
                <p className="text-sm font-semibold text-slate-900">
                    Referrals
                </p>
                <p className="mt-1 text-sm text-slate-500">
                    Invite friends and track your referral rewards.
                </p>
            </div>
        </AccountBillingLayout>
    );
}

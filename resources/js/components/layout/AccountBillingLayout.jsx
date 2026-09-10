import React from "react";
import { usePage } from "@inertiajs/react";
import { Receipt, CreditCard, Gift, User } from "lucide-react";
import Tabs from "@/components/ui/Tabs";

export default function AccountBillingLayout({ children }) {
    const { url } = usePage();
    const segment = url.split("?")[0].split("/")[2];

    const tabs = [
        {
            label: "Subscription & invoices",
            path: "/account-billing",
            active: !segment,
            icon: <Receipt size={16} />,
        },
        {
            label: "Payment methods",
            path: "/account-billing/payment-methods",
            active: segment === "payment-methods",
            icon: <CreditCard size={16} />,
        },
        {
            label: "Referrals",
            path: "/account-billing/referrals",
            active: segment === "referrals",
            icon: <Gift size={16} />,
        },
        {
            label: "Profile",
            path: "/account-billing/profile",
            active: segment === "profile",
            icon: <User size={16} />,
        },
    ];

    return (
        <div className="p-6 bg-slate-50 min-h-screen">
            <Tabs tabs={tabs} />
            <div className="mt-4">{children}</div>
        </div>
    );
}

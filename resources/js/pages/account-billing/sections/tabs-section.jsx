import { Receipt, CreditCard, Gift, User } from "lucide-react";
import React from "react";
import Tabs from "../../../_components/tabs";

export default function TabsSection() {
    const segment = window.location.pathname.split("/")[2];

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

    return <Tabs tabs={tabs} />;
}

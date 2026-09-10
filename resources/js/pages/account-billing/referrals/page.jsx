import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import AccountBillingLayout from "@/components/layout/AccountBillingLayout";
import HeaderSection from "./sections/header-section";
import TableSection from "./sections/referral-table-section";

export default function Page() {
    return (
        <div className="space-y-4">
            <HeaderSection />
            <TableSection />
        </div>
    );
}

Page.layout = (page) => (
    <MainLayout title="Referrals">
        <AccountBillingLayout>{page}</AccountBillingLayout>
    </MainLayout>
);

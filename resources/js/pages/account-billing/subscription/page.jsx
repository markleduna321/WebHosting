import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import AccountBillingLayout from "@/components/layout/AccountBillingLayout";
import HeaderSection from "./sections/header-section";
import InvoiceHistorySection from "./sections/invoice-history-section";

export default function Page() {
    return (
        <div className="space-y-6">
            <HeaderSection />

            <InvoiceHistorySection />
        </div>
    );
}

Page.layout = (page) => (
    <MainLayout title="Account & Billing">
        <AccountBillingLayout>{page}</AccountBillingLayout>
    </MainLayout>
);

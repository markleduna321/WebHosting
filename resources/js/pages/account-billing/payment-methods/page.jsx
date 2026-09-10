import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import AccountBillingLayout from "@/components/layout/AccountBillingLayout";
import TableSection from "./sections/table-section";
import CardSection from "./sections/card-section";

export default function Page() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-1 items-start">
            <div className="lg:col-span-2">
                <TableSection />
            </div>
            <div className="lg:col-span-1">
                <CardSection />
            </div>
        </div>
    );
}

Page.layout = (page) => (
    <MainLayout title="Payment Methods">
        <AccountBillingLayout>{page}</AccountBillingLayout>
    </MainLayout>
);

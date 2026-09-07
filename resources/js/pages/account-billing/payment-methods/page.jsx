import React from "react";
import AccountBillingLayout from "../layout";
import TableSection from "./sections/table-section";
import CardSection from "./sections/card-section";

export default function Page() {
    return (
        <AccountBillingLayout>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-1 items-start">
                <div className="lg:col-span-2">
                    <TableSection />
                </div>
                <div className="lg:col-span-1">
                    <CardSection />
                </div>
            </div>
        </AccountBillingLayout>
    );
}

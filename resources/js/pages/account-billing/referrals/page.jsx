import React from "react";
import AccountBillingLayout from "../layout";
import HeaderSection from "./sections/header-section";
import TableSection from "./sections/referral-table-section";

export default function Page() {
    return (
        <AccountBillingLayout>
            <div className="space-y-4">
                <HeaderSection/>
                <TableSection/>
            </div>
              
        </AccountBillingLayout>
    );
}

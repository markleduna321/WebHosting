import React from "react";
import AccountBillingLayout from "../layout";
import HeaderSection from "./sections/header-section";
import InvoiceHistorySection from "./sections/invoice-history-section";

export default function Page() {
    return (
        <AccountBillingLayout>
           <div className="space-y-6">
            <HeaderSection/>
            
            <InvoiceHistorySection/>
           </div>
        </AccountBillingLayout>
    );
}

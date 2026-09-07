import React from "react";
import SiteDomainLayout from "../layout";
import TableSection from "./sections/table-section";
import ConnectDomainSection from "./sections/connect-domain-section";

export default function Page() {
    return (
        <SiteDomainLayout>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <TableSection />
                </div>
                <div className="lg:col-span-1">
                    <ConnectDomainSection />
                </div>
            </div>
        </SiteDomainLayout>
    );
}

import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import SiteDomainLayout from "@/components/layout/SiteDomainLayout";
import TableSection from "./sections/table-section";
import ConnectDomainSection from "./sections/connect-domain-section";

export default function Page() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                <TableSection />
            </div>
            <div className="lg:col-span-1">
                <ConnectDomainSection />
            </div>
        </div>
    );
}

Page.layout = (page) => (
    <MainLayout title="Domains">
        <SiteDomainLayout>{page}</SiteDomainLayout>
    </MainLayout>
);

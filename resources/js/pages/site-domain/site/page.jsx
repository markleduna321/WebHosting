import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import SiteDomainLayout from "@/components/layout/SiteDomainLayout";
import SiteDomainCardSection from "./sections/site-domain-card-section";

export default function Page() {
    return <SiteDomainCardSection />;
}

Page.layout = (page) => (
    <MainLayout title="Sites & Domains">
        <SiteDomainLayout>{page}</SiteDomainLayout>
    </MainLayout>
);

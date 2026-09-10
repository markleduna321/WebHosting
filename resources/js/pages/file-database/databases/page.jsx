import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import FileDatabaseLayout from "@/components/layout/FileDatabaseLayout";
import HeaderSection from "./sections/header-section";
import DatabaseToolSection from "./sections/database-tool-section";
import BackupHistorySection from "./sections/backup-history-section";
import SiteDomainCardSection from "@/pages/site-domain/site/sections/site-domain-card-section";

export default function Page() {
    return (
        <div className="space-y-4">
            <HeaderSection />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-1 items-stretch">
                <div className="lg:col-span-1">
                    <DatabaseToolSection />
                </div>
                <div className="lg:col-span-2">
                    <BackupHistorySection />
                </div>
            </div>

            <SiteDomainCardSection />
        </div>
    );
}

Page.layout = (page) => (
    <MainLayout title="Databases">
        <FileDatabaseLayout>{page}</FileDatabaseLayout>
    </MainLayout>
);

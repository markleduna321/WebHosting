import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import Tabs, { TabPanel } from "@/components/ui/Tabs";
import { FolderOpen, Database, KeyRound } from "lucide-react";
import FileSearchSection from "./_sections/FileSearchSection";
import FileTableSection from "./_sections/FileTableSection";
import DatabaseHeaderSection from "./_sections/DatabaseHeaderSection";
import DatabaseToolSection from "./_sections/DatabaseToolSection";
import BackupHistorySection from "./_sections/BackupHistorySection";
import EnvironmentSection from "./_sections/EnvironmentSection";
import SiteDomainCardSection from "@/pages/site-domain/_sections/SiteDomainCardSection";

const TABS = [
    { id: "file-manager", label: "File manager", icon: <FolderOpen size={16} /> },
    { id: "databases", label: "Databases", icon: <Database size={16} /> },
    { id: "environment", label: "Environment", icon: <KeyRound size={16} /> },
];

export default function Page() {
    return (
        <Tabs tabs={TABS} defaultTabId="file-manager">
            <TabPanel id="file-manager">
                <div className="space-y-4">
                    <FileSearchSection />
                    <FileTableSection />
                </div>
            </TabPanel>

            <TabPanel id="databases">
                <div className="space-y-4">
                    <DatabaseHeaderSection />
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
            </TabPanel>

            <TabPanel id="environment">
                <EnvironmentSection />
            </TabPanel>
        </Tabs>
    );
}

Page.layout = (page) => <MainLayout title="Files & Database">{page}</MainLayout>;

import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import Tabs, { TabPanel } from "@/components/ui/Tabs";
import { Globe, Lock, GitBranch } from "lucide-react";
import SiteDomainCardSection from "./_sections/SiteDomainCardSection";
import DomainTableSection from "./_sections/DomainTableSection";
import ConnectDomainSection from "./_sections/ConnectDomainSection";
import GitSyncSection from "./_sections/GitSyncSection";

const TABS = [
    { id: "sites", label: "Sites", icon: <Globe size={16} /> },
    { id: "domains", label: "Domains", icon: <Lock size={16} /> },
    { id: "git-sync", label: "Git Sync", icon: <GitBranch size={16} /> },
];

export default function Page() {
    return (
        <Tabs tabs={TABS} defaultTabId="sites">
            <TabPanel id="sites">
                <SiteDomainCardSection />
            </TabPanel>

            <TabPanel id="domains">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <DomainTableSection />
                    </div>
                    <div className="lg:col-span-1">
                        <ConnectDomainSection />
                    </div>
                </div>
            </TabPanel>

            <TabPanel id="git-sync">
                <GitSyncSection />
            </TabPanel>
        </Tabs>
    );
}

Page.layout = (page) => <MainLayout title="Sites & Domains">{page}</MainLayout>;

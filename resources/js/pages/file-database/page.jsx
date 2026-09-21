import React, { useCallback, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import Tabs, { TabPanel } from "@/components/ui/Tabs";
import { FolderOpen, Database, KeyRound, Terminal } from "lucide-react";
import { usePage } from "@inertiajs/react";
import FileSearchSection from "./_sections/FileSearchSection";
import FileTableSection from "./_sections/FileTableSection";
import DatabaseHeaderSection from "./_sections/DatabaseHeaderSection";
import DatabaseToolSection from "./_sections/DatabaseToolSection";
import BackupHistorySection from "./_sections/BackupHistorySection";
import EnvironmentSection from "./_sections/EnvironmentSection";
import DatabaseCardSection from "./_sections/DatabaseCardSection";
import CreateDatabaseSection from "./_sections/CreateDatabaseSection";
import CliSection from "./_sections/CliSection";

const TABS = [
    { id: "file-manager", label: "File manager", icon: <FolderOpen size={16} /> },
    { id: "databases", label: "Databases", icon: <Database size={16} /> },
    { id: "cli", label: "CLI", icon: <Terminal size={16} /> },
];

export default function Page() {
    const { tab } = usePage().props;
    const defaultTabId = TABS.some((t) => t.id === tab) ? tab : "file-manager";
    const [selectedWebsite, setSelectedWebsite] = useState(null);
    const handleSelect = useCallback((site) => setSelectedWebsite(site), []);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const openCreate = useCallback(() => setIsCreateOpen(true), []);
    const closeCreate = useCallback(() => setIsCreateOpen(false), []);

    return (
        <Tabs tabs={TABS} defaultTabId={defaultTabId}>
            <TabPanel id="file-manager">
                <div className="space-y-4">
                    <FileSearchSection onSelect={handleSelect} />
                    <FileTableSection website={selectedWebsite} />
                </div>
            </TabPanel>

            <TabPanel id="databases">
                <div className="space-y-4">
                    <DatabaseHeaderSection onCreate={openCreate} />
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-1 items-stretch">
                        <div className="lg:col-span-1">
                            <DatabaseToolSection />
                        </div>
                        <div className="lg:col-span-2">
                            <BackupHistorySection />
                        </div>
                    </div>
                    <DatabaseCardSection onCreate={openCreate} />
                    <CreateDatabaseSection
                        open={isCreateOpen}
                        onClose={closeCreate}
                    />
                </div>
            </TabPanel>

            <TabPanel id="environment">
                <EnvironmentSection />
            </TabPanel>

            <TabPanel id="cli">
                <div className="space-y-4">
                    <FileSearchSection onSelect={handleSelect} />
                    {selectedWebsite ? (
                        <CliSection website={selectedWebsite} />
                    ) : (
                        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                            <p className="text-gray-500">Please select a website to run CLI commands.</p>
                        </div>
                    )}
                </div>
            </TabPanel>
        </Tabs>
    );
}

Page.layout = (page) => <MainLayout title="Files & Database">{page}</MainLayout>;

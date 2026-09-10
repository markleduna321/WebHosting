import React from "react";
import { usePage } from "@inertiajs/react";
import { FolderOpen, Database, KeyRound } from "lucide-react";
import Tabs from "@/components/ui/Tabs";

export default function FileDatabaseLayout({ children }) {
    const { url } = usePage();
    const segment = url.split("?")[0].split("/")[2];

    const tabs = [
        {
            label: "File manager",
            path: "/files-database",
            active: !segment,
            icon: <FolderOpen size={16} />,
        },
        {
            label: "Databases",
            path: "/files-database/databases",
            active: segment === "databases",
            icon: <Database size={16} />,
        },
        {
            label: "Environment",
            path: "/files-database/environment",
            active: segment === "environment",
            icon: <KeyRound size={16} />,
        },
    ];

    return (
        <div className="p-6 bg-slate-50 min-h-screen">
            <Tabs tabs={tabs} />
            <div className="mt-4">{children}</div>
        </div>
    );
}

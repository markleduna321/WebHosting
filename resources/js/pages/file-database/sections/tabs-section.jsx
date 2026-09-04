import { FolderOpen, Database, KeyRound } from "lucide-react";
import React from "react";
import Tabs from "../../../_components/tabs";

export default function TabsSection() {
    const segment = window.location.pathname.split("/")[2];

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

    return <Tabs tabs={tabs} />;
}

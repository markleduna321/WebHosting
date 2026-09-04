import { Globe, Lock, GitBranch } from "lucide-react";
import React from "react";
import Tabs from "../../../_components/tabs";

export default function TabsSection() {
    const segment = window.location.pathname.split("/")[2];

    const tabs = [
        {
            label: "Sites",
            path: "/site-domain",
            active: !segment,
            icon: <Globe size={16} />,
        },
        {
            label: "Domains",
            path: "/site-domain/domains",
            active: segment === "domains",
            icon: <Lock size={16} />,
        },
        {
            label: "Git Sync",
            path: "/site-domain/git-sync",
            active: segment === "git-sync",
            icon: <GitBranch size={16} />,
        },
    ];

    return <Tabs tabs={tabs} />;
}

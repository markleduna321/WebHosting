import React from "react";
import { usePage } from "@inertiajs/react";
import { Globe, Lock, GitBranch } from "lucide-react";
import Tabs from "@/components/ui/Tabs";

export default function SiteDomainLayout({ children }) {
    const { url } = usePage();
    const segment = url.split("?")[0].split("/")[2];

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

    return (
        <div className="p-6 bg-slate-50 min-h-screen">
            <Tabs tabs={tabs} />
            <div className="mt-4">{children}</div>
        </div>
    );
}

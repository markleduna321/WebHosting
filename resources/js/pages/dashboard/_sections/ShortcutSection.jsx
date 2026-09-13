import { Globe, Database, Gift, Plus, Table } from "lucide-react";
import React, { useState } from "react";
import { Link } from "@inertiajs/react";
import Button from "@/components/ui/Button";
import DeployModalSection from "./DeployModalSection";
import ConnectGithubSection from "./ConnectGithubSection";

const SHORTCUTS = [
    { label: "Domains",        icon: Globe,     href: "/site-domain?tab=domains" },
    { label: "Databases",      icon: Database,  href: "/files-database?tab=databases" },
    { label: "phpMyAdmin",      icon: Table,  href: "/files-database?tab=databases" },
    { label: "Refer a friend", icon: Gift,       href: "/account-billing?tab=referrals" },
];

const STATUS_ITEMS = [
    { label: "Web servers", detail: "Manila · all nodes healthy" },
    { label: "Databases",   detail: "MySQL 8 · PostgreSQL 16" },
    { label: "Git deploys", detail: "Queue clear · 8s average" },
];

export default function ShortcutSection() {
    const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
    const [isConnectGithubOpen, setIsConnectGithubOpen] = useState(false);

    return (
        <div className="rounded-xl border border-gray-200 bg-white px-5 py-4">
            {/* Action buttons row */}
            <div className="flex flex-wrap items-center gap-2">
                <Button
                    variant="primary"
                    size="md"
                    className="rounded-lg gap-1.5"
                    onClick={() => setIsDeployModalOpen(true)}
                >
                    <Plus className="w-3.5 h-3.5" />
                    Deploy New Site
                </Button>

                {SHORTCUTS.map(({ label, icon: Icon, href }) => (
                    <Link key={label} href={href}>
                        <Button
                            variant="light"
                            size="md"
                            outlined
                            className="rounded-lg gap-1.5 text-slate-700"
                        >
                            <Icon className="w-3.5 h-3.5 text-slate-500" />
                            {label}
                        </Button>
                    </Link>
                ))}
            </div>

            {/* Status row */}
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1">
                {STATUS_ITEMS.map(({ label, detail }) => (
                    <span
                        key={label}
                        className="flex items-center gap-1.5 text-sm text-slate-500"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                        <span className="font-semibold text-slate-700">{label}</span>
                        {detail}
                    </span>
                ))}
            </div>

            <DeployModalSection
                open={isDeployModalOpen}
                onCancel={() => setIsDeployModalOpen(false)}
                onCreate={() => {
                    setIsDeployModalOpen(false);
                    setIsConnectGithubOpen(true);
                }}
            />

            <ConnectGithubSection
                open={isConnectGithubOpen}
                onCancel={() => setIsConnectGithubOpen(false)}
                onConnect={() => setIsConnectGithubOpen(false)}
            />
        </div>
    );
}

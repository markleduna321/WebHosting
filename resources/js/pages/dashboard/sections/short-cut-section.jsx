import { Globe, Database, Gift, Plus } from "lucide-react";
import React from "react";
import Button from "../../../_components/button";

const SHORTCUTS = [
    { label: "Domains",        icon: Globe },
    { label: "Databases",      icon: Database },
    { label: "Refer a friend", icon: Gift },
];

const STATUS_ITEMS = [
    { label: "Web servers", detail: "Manila · all nodes healthy" },
    { label: "Databases",   detail: "MySQL 8 · PostgreSQL 16" },
    { label: "Git deploys", detail: "Queue clear · 8s average" },
];

export default function ShortcutSection() {
    return (
        <div className="rounded-xl border border-gray-200 bg-white px-5 py-4">
            {/* Action buttons row */}
            <div className="flex flex-wrap items-center gap-2">
                <Button variant="primary" size="md" className="rounded-lg gap-1.5">
                    <Plus className="w-3.5 h-3.5" />
                    Deploy New Site
                </Button>

                {SHORTCUTS.map(({ label, icon: Icon }) => (
                    <Button
                        key={label}
                        variant="light"
                        size="md"
                        outlined
                        className="rounded-lg gap-1.5 text-slate-700"
                    >
                        <Icon className="w-3.5 h-3.5 text-slate-500" />
                        {label}
                    </Button>
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
        </div>
    );
}

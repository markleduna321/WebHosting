import {
    Database,
    Clock,
    Folder,
    Pencil,
    Server,
    ChevronRight,
    ExternalLink,
    Info,
} from "lucide-react";
import React from "react";

const ESSENTIALS = [
    {
        icon: Database,
        title: "Database",
        subtitle: "Manage database",
        action: { label: "Manage", variant: "button" },
    },
    {
        icon: Clock,
        title: "Backups",
        subtitle: "Weekly",
        action: { variant: "chevron" },
    },
    {
        icon: Folder,
        title: "File manager",
        subtitle: "Edit your files",
        action: { label: "Open", variant: "button", external: true },
    },
    {
        icon: Pencil,
        title: "Cache",
        subtitle: "See latest changes",
        info: true,
        action: {
            variant: "double-button",
            labels: ["Clear cache", "No cache preview"],
            externalSecond: true,
        },
    },
    {
        icon: Server,
        title: "Hosting plan",
        subtitle: "Student Pro",
        action: { variant: "chevron" },
    },
];

export default function EssentialSection() {
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-base font-bold text-slate-900 mb-2">
                Essentials
            </h2>
            <ul className="divide-y divide-gray-100">
                {ESSENTIALS.map((item) => {
                    const Icon = item.icon;
                    return (
                        <li
                            key={item.title}
                            className="flex items-center justify-between py-3.5"
                        >
                            <div className="flex items-center gap-3 min-w-0">
                                <Icon className="w-4 h-4 text-slate-400 shrink-0" />
                                <div className="min-w-0">
                                    <div className="flex items-center gap-1">
                                        <p className="text-sm font-semibold text-slate-900">
                                            {item.title}
                                        </p>
                                        {item.info && (
                                            <Info className="w-3.5 h-3.5 text-slate-300" />
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-500 truncate">
                                        {item.subtitle}
                                    </p>
                                </div>
                            </div>

                            {item.action.variant === "chevron" && (
                                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                            )}

                            {item.action.variant === "button" && (
                                <button className="flex items-center gap-1 rounded-full border border-slate-200 px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 shrink-0">
                                    {item.action.label}
                                    {item.action.external && (
                                        <ExternalLink className="w-3 h-3" />
                                    )}
                                </button>
                            )}

                            {item.action.variant === "double-button" && (
                                <div className="flex items-center gap-2 shrink-0">
                                    <button className="rounded-full border border-slate-200 px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">
                                        {item.action.labels[0]}
                                    </button>
                                    <button className="flex items-center gap-1 rounded-full border border-slate-200 px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">
                                        {item.action.labels[1]}
                                        <ExternalLink className="w-3 h-3" />
                                    </button>
                                </div>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

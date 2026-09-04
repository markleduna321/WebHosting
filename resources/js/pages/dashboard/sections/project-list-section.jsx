import { ChevronRight, Loader2 } from "lucide-react";
import React from "react";

const SITES = [
    {
        name: "Portfolio 2026",
        domain: "mariaclara.asuratechhost.app",
        visits: "1,284 visits",
        time: "2 hours ago",
        status: "live",
    },
    {
        name: "CS Thesis — Traffic Model",
        domain: "thesis-traffic.asuratechhost.app",
        visits: "342 visits",
        time: "Yesterday",
        status: "live",
    },
    {
        name: "ACM Student Chapter",
        domain: "acm-chapter.asuratechhost.app",
        visits: "0 visits",
        time: "Just now",
        status: "building",
    },
    {
        name: "Kadiwa Marketplace (demo)",
        domain: "kadiwa-demo.asuratechhost.app",
        visits: "87 visits",
        time: "3 weeks ago",
        status: "stopped",
    },
];

const STATUS_STYLES = {
    live: "border border-green-300 text-green-700 bg-transparent",
    building: "border border-blue-300 text-blue-600 bg-transparent",
    stopped: "border border-slate-300 text-slate-600 bg-transparent",
};

export default function ProjectListSection() {
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-6">
            {/* Header */}
            <div className="mb-4">
                <h2 className="text-base font-bold text-slate-900">
                    Your sites
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                    2 live · 4 of 3 slots used
                </p>
            </div>

            {/* Site rows */}
            <ul className="divide-y divide-gray-100">
                {SITES.map((site) => (
                    <li
                        key={site.name}
                        className="flex items-center justify-between py-4 cursor-pointer hover:bg-slate-50 -mx-2 px-2 rounded-lg transition-colors"
                    >
                        {/* Left: name + meta */}
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-900 truncate">
                                {site.name}
                            </p>
                            <p className="text-xs text-slate-400 truncate mt-0.5">
                                {site.domain} · {site.visits} · {site.time}
                            </p>
                        </div>

                        {/* Right: status badge + chevron */}
                        <div className="flex items-center gap-2 shrink-0 ml-4">
                            <span
                                className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLES[site.status]}`}
                            >
                                {site.status === "building" && (
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                )}
                                {site.status}
                            </span>
                            <ChevronRight className="w-4 h-4 text-slate-400" />
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

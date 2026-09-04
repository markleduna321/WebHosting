import { ExternalLink, Loader2 } from "lucide-react";
import React from "react";
import Card from "../../../../_components/card";

const SITES = [
    {
        name: "Portfolio 2026",
        domain: "https://wakindev-tau.vercel.app/",
        plan: "Student Pro",
        visits: "1,284",
        updated: "2 hours ago",
        status: "live",
    },
    {
        name: "CS Thesis — Traffic Model",
        domain: "https://wakindev-tau.vercel.app/",
        plan: "Student Pro",
        visits: "342",
        updated: "Yesterday",
        status: "live",
    },
    {
        name: "ACM Student Chapter",
        domain: "https://wakindev-tau.vercel.app/",
        plan: "Student Pro",
        visits: "0",
        updated: "Just now",
        status: "building",
    },
    {
        name: "Kadiwa Marketplace (demo)",
        domain: "https://wakindev-tau.vercel.app/",
        plan: "Student Pro",
        visits: "87",
        updated: "3 weeks ago",
        status: "stopped",
    },
];

function StatusBadge({ status }) {
    if (status === "live") {
        return <span className="text-sm font-medium text-green-500">live</span>;
    }
    if (status === "building") {
        return (
            <span className="flex items-center gap-1.5 text-sm font-medium text-blue-500">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                building
            </span>
        );
    }
    return <span className="text-sm font-medium text-slate-400">stopped</span>;
}

export default function SiteDomainCardSection() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {SITES.map((site) => (
                <Card
                    key={site.name}
                    padding="p-5"
                    className="flex flex-col gap-0 cursor-default hover:shadow-sm"
                    onClick={(e) => e.preventDefault()}
                >
                    {/* Top: name + status */}
                    <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                            <p className="text-sm font-bold text-slate-900 truncate">
                                {site.name}
                            </p>
                            <a
                                href={`${site.domain}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-blue-500 hover:underline mt-0.5"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {site.domain}
                                <ExternalLink className="w-3 h-3" />
                            </a>
                        </div>
                        <StatusBadge status={site.status} />
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-100 my-4" />

                    {/* Stats row */}
                    <div className="flex items-start  justify-between">
                        <div>
                            <p className="text-xs text-slate-400 mb-0.5">
                                Plan
                            </p>
                            <p className="text-sm font-semibold text-slate-800">
                                {site.plan}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 mb-0.5">
                                Visits (30d)
                            </p>
                            <p className="text-sm font-semibold text-slate-800">
                                {site.visits}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 mb-0.5">
                                Updated
                            </p>
                            <p className="text-sm font-semibold text-slate-800">
                                {site.updated}
                            </p>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
}

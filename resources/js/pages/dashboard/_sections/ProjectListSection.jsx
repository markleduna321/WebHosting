import { ChevronRight, Loader2, AlertCircle } from "lucide-react";
import React from "react";
import { Link } from "@inertiajs/react";
import { useGetWebsitesQuery } from "@/features/websites/websitesApi";

function timeAgo(value) {
    if (!value) return "—";
    const seconds = Math.floor((Date.now() - new Date(value).getTime()) / 1000);
    const units = [
        ["year", 31536000],
        ["month", 2592000],
        ["week", 604800],
        ["day", 86400],
        ["hour", 3600],
        ["minute", 60],
    ];
    for (const [unit, secondsInUnit] of units) {
        const amount = Math.floor(seconds / secondsInUnit);
        if (amount >= 1) {
            return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
                -amount,
                unit,
            );
        }
    }
    return "just now";
}

const STATUS_STYLES = {
    live: "border border-green-300 text-green-700 bg-transparent",
    building: "border border-blue-300 text-blue-600 bg-transparent",
    queued: "border border-blue-300 text-blue-600 bg-transparent",
    failed: "border border-red-300 text-red-600 bg-transparent",
    stopped: "border border-slate-300 text-slate-600 bg-transparent",
};

export default function ProjectListSection() {
    // 1. Initial fetch to get current state
    const { data: initialSites = [], isLoading } = useGetWebsitesQuery();
    
    // 2. Check if any site is actively deploying
    const isDeploying = initialSites.some(
        (site) => site.status === "building" || site.status === "queued"
    );

    // 3. Enable polling every 3 seconds ONLY if a site is currently building
    const { data: sites = [] } = useGetWebsitesQuery(undefined, {
        pollingInterval: isDeploying ? 3000 : 0, 
    });

    const liveCount = sites.filter((site) => site.status === "live").length;

    return (
        <div className="rounded-xl border border-gray-200 bg-white p-6">
            {/* Header */}
            <div className="mb-4">
                <h2 className="text-base font-bold text-slate-900">
                    Your sites
                </h2>
                <p className="mt-0.5 text-xs text-slate-500">
                    {isLoading
                        ? "Loading…"
                        : `${liveCount} live · ${sites.length} total`}
                </p>
            </div>

            {isLoading && (
                <ul className="divide-y divide-gray-100">
                    {[0, 1, 2].map((row) => (
                        <li key={row} className="animate-pulse py-4">
                            <div className="h-3.5 w-1/3 rounded bg-slate-200" />
                            <div className="mt-2 h-3 w-2/3 rounded bg-slate-100" />
                        </li>
                    ))}
                </ul>
            )}

            {!isLoading && sites.length === 0 && (
                <div className="py-8 text-center">
                    <p className="text-sm font-semibold text-slate-900">
                        No sites yet
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                        Use “Deploy New Site” above to publish your first
                        repository.
                    </p>
                </div>
            )}

            {/* Site rows */}
            {!isLoading && sites.length > 0 && (
                <ul className="divide-y divide-gray-100">
                    {sites.map((site) => (
                        <li
                            key={site.uuid}
                            className="group -mx-2 rounded-lg transition-colors hover:bg-slate-50"
                        >
                            {/* Wrap the row in an Inertia Link (Adjust the href path if your route is named differently) */}
                            <Link 
                                href={`/site-domain/${site.full_domain}`} 
                                className="flex cursor-pointer items-center justify-between px-2 py-4"
                            >
                                {/* Left: name + meta */}
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold text-slate-900">
                                        {site.name}
                                    </p>
                                    <p className="mt-0.5 truncate text-xs text-slate-400">
                                        {site.full_domain} ·{" "}
                                        {site.repository_full_name} ·{" "}
                                        {timeAgo(site.last_deployed_at ?? site.created_at)}
                                    </p>
                                </div>

                                {/* Right: status badge + chevron */}
                                <div className="ml-4 flex shrink-0 items-center gap-2">
                                    <span
                                        className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLES[site.status] ?? STATUS_STYLES.stopped}`}
                                    >
                                        {(site.status === "building" ||
                                            site.status === "queued") && (
                                            <Loader2 className="h-3 w-3 animate-spin" />
                                        )}
                                        {site.status === "failed" && (
                                            <AlertCircle className="h-3 w-3" />
                                        )}
                                        {site.status}
                                    </span>
                                    <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600" />
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
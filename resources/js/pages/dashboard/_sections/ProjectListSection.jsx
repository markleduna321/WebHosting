import { ChevronRight, Loader2, AlertCircle } from "lucide-react";
import React from "react";
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
    const { data: sites = [], isLoading } = useGetWebsitesQuery();
    const liveCount = sites.filter((site) => site.status === "live").length;

    return (
        <div className="rounded-xl border border-gray-200 bg-white p-6">
            {/* Header */}
            <div className="mb-4">
                <h2 className="text-base font-bold text-slate-900">
                    Your sites
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
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
                            className="flex items-center justify-between py-4 cursor-pointer hover:bg-slate-50 -mx-2 px-2 rounded-lg transition-colors"
                        >
                            {/* Left: name + meta */}
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-slate-900 truncate">
                                    {site.name}
                                </p>
                                <p className="text-xs text-slate-400 truncate mt-0.5">
                                    {site.full_domain} ·{" "}
                                    {site.repository_full_name} ·{" "}
                                    {timeAgo(site.last_deployed_at ?? site.created_at)}
                                </p>
                            </div>

                            {/* Right: status badge + chevron */}
                            <div className="flex items-center gap-2 shrink-0 ml-4">
                                <span
                                    className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLES[site.status] ?? STATUS_STYLES.stopped}`}
                                >
                                    {(site.status === "building" ||
                                        site.status === "queued") && (
                                        <Loader2 className="w-3 h-3 animate-spin" />
                                    )}
                                    {site.status === "failed" && (
                                        <AlertCircle className="w-3 h-3" />
                                    )}
                                    {site.status}
                                </span>
                                <ChevronRight className="w-4 h-4 text-slate-400" />
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

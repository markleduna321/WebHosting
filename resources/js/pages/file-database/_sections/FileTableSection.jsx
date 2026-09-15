import {
    Folder,
    FileText,
    ChevronRight,
    Home,
    Loader2,
    AlertCircle,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { useGetWebsiteFilesQuery } from "@/features/websites/websitesApi";

const EXT_COLORS = {
    html: "text-orange-400",
    css: "text-blue-400",
    js: "text-yellow-400",
    jsx: "text-cyan-400",
    ts: "text-blue-500",
    tsx: "text-cyan-500",
    md: "text-slate-400",
    json: "text-green-400",
    env: "text-red-400",
    ico: "text-purple-400",
    htaccess: "text-slate-400",
};

function extColor(name) {
    const ext = name.split(".").pop()?.toLowerCase();
    return EXT_COLORS[ext] ?? "text-slate-400";
}

function formatSize(bytes) {
    if (bytes === null || bytes === undefined) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

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

function Shell({ children }) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white">
            <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-3.5 text-sm text-slate-600">
                <Home className="h-4 w-4 text-slate-400" />
                Files
            </div>
            {children}
        </div>
    );
}

function Message({ icon: Icon, title, description, spin = false }) {
    return (
        <div className="px-5 py-12 text-center">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                <Icon
                    aria-hidden="true"
                    className={`h-5 w-5 ${spin ? "animate-spin" : ""}`}
                />
            </span>
            <p className="mt-3 text-sm font-semibold text-slate-900">{title}</p>
            {description && (
                <p className="mt-1 text-sm text-slate-500">{description}</p>
            )}
        </div>
    );
}

export default function FileTableSection({ website }) {
    const [path, setPath] = useState("");

    useEffect(() => {
        setPath("");
    }, [website?.uuid]);

    const isLive = website?.status === "live";

    const {
        data: entries = [],
        isFetching,
        isError,
        error,
    } = useGetWebsiteFilesQuery(
        { uuid: website?.uuid, path },
        { skip: !website || !isLive },
    );

    if (!website) {
        return (
            <Shell>
                <Message
                    icon={Folder}
                    title="No site selected"
                    description="Deploy a site to browse its files here."
                />
            </Shell>
        );
    }

    if (!isLive) {
        const failed = website.status === "failed";
        return (
            <Shell>
                <Message
                    icon={failed ? AlertCircle : Loader2}
                    spin={!failed}
                    title={failed ? "Deployment failed" : "Still deploying"}
                    description={
                        failed
                            ? (website.failure_reason ??
                              "Try deploying this repository again.")
                            : "Files appear here once the repository finishes cloning."
                    }
                />
            </Shell>
        );
    }

    const segments = path ? path.split("/") : [];

    return (
        <div className="rounded-xl border border-gray-200 bg-white">
            {/* Breadcrumb */}
            <div className="flex flex-wrap items-center gap-1 border-b border-gray-100 px-5 py-3.5 text-sm">
                <button
                    type="button"
                    onClick={() => setPath("")}
                    className="inline-flex items-center gap-1.5 rounded px-1 text-slate-600 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                    <Home className="h-4 w-4 text-slate-400" />
                    {website.name}
                </button>
                {segments.map((segment, index) => (
                    <span key={segment + index} className="flex items-center gap-1">
                        <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
                        <button
                            type="button"
                            onClick={() =>
                                setPath(segments.slice(0, index + 1).join("/"))
                            }
                            className="rounded px-1 text-slate-600 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                        >
                            {segment}
                        </button>
                    </span>
                ))}
            </div>

            {isFetching && (
                <ul className="divide-y divide-gray-100">
                    {[0, 1, 2, 3].map((row) => (
                        <li key={row} className="animate-pulse px-5 py-4">
                            <div className="h-3.5 w-1/3 rounded bg-slate-200" />
                        </li>
                    ))}
                </ul>
            )}

            {!isFetching && isError && (
                <Message
                    icon={AlertCircle}
                    title="Could not load files"
                    description={error?.data?.message ?? "Please try again."}
                />
            )}

            {!isFetching && !isError && entries.length === 0 && (
                <Message
                    icon={Folder}
                    title="This folder is empty"
                    description="Nothing was found at this path."
                />
            )}

            {!isFetching && !isError && entries.length > 0 && (
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-gray-100 text-xs text-slate-400">
                            <th className="px-5 py-2.5 font-medium">Name</th>
                            <th className="hidden px-5 py-2.5 font-medium sm:table-cell">
                                Last modified
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {entries.map((entry) => {
                            const isFolder = entry.type === "folder";
                            return (
                                <tr key={entry.path} className="hover:bg-slate-50">
                                    <td className="px-5 py-3.5">
                                        {isFolder ? (
                                            <button
                                                type="button"
                                                onClick={() => setPath(entry.path)}
                                                className="flex items-center gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
                                            >
                                                <Folder className="h-4 w-4 shrink-0 text-blue-400" />
                                                <span className="min-w-0">
                                                    <span className="block truncate text-sm font-medium text-blue-600">
                                                        {entry.name}
                                                    </span>
                                                    <span className="block text-xs text-slate-400">
                                                        {entry.item_count} items
                                                    </span>
                                                </span>
                                            </button>
                                        ) : (
                                            <span className="flex items-center gap-3">
                                                <FileText
                                                    className={`h-4 w-4 shrink-0 ${extColor(entry.name)}`}
                                                />
                                                <span className="min-w-0">
                                                    <span className="block truncate text-sm font-medium text-slate-800">
                                                        {entry.name}
                                                    </span>
                                                    <span className="block text-xs text-slate-400">
                                                        {formatSize(entry.size_bytes)}
                                                    </span>
                                                </span>
                                            </span>
                                        )}
                                    </td>
                                    <td className="hidden px-5 py-3.5 text-sm text-slate-500 sm:table-cell">
                                        {timeAgo(entry.updated_at)}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}
        </div>
    );
}

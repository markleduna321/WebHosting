import {
    ExternalLink,
    Loader2,
    Globe,
    AlertCircle,
    RefreshCw,
    Trash2,
} from "lucide-react";
import React from "react";
import { Link } from "@inertiajs/react";
import { Modal, message } from "antd";
import Card from "@/components/ui/Card";
import {
    useGetWebsitesQuery,
    useRedeployWebsiteMutation,
    useDeleteWebsiteMutation,
} from "@/features/websites/websitesApi";

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

function StatusBadge({ status }) {
    if (status === "live") {
        return <span className="text-sm font-medium text-green-500">live</span>;
    }
    if (status === "building" || status === "queued") {
        return (
            <span className="flex items-center gap-1.5 text-sm font-medium text-blue-500">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                {status}
            </span>
        );
    }
    if (status === "failed") {
        return (
            <span className="flex items-center gap-1.5 text-sm font-medium text-red-500">
                <AlertCircle className="w-3.5 h-3.5" />
                failed
            </span>
        );
    }
    return <span className="text-sm font-medium text-slate-400">stopped</span>;
}

function SkeletonCard() {
    return (
        <div className="animate-pulse rounded-xl border border-gray-200 bg-white p-5">
            <div className="h-4 w-1/3 rounded bg-slate-200" />
            <div className="mt-2 h-3 w-1/2 rounded bg-slate-100" />
            <div className="my-4 border-t border-gray-100" />
            <div className="flex justify-between">
                <div className="h-3 w-16 rounded bg-slate-100" />
                <div className="h-3 w-16 rounded bg-slate-100" />
                <div className="h-3 w-16 rounded bg-slate-100" />
            </div>
        </div>
    );
}

export default function SiteDomainCardSection() {
    const { data: sites = [], isLoading } = useGetWebsitesQuery();
    const [redeployWebsite, { isLoading: isRedeploying }] =
        useRedeployWebsiteMutation();
    const [deleteWebsite] = useDeleteWebsiteMutation();

    const handleRedeploy = async (site) => {
        try {
            await redeployWebsite(site.uuid).unwrap();
            message.success(`${site.name} queued for redeployment.`, 4);
        } catch {
            message.error("Could not start the redeploy. Please try again.", 4);
        }
    };

    const confirmDelete = (site) => {
        Modal.confirm({
            title: `Delete ${site.name}?`,
            content:
                "This permanently removes the site and all of its cloned files. This cannot be undone.",
            okText: "Delete site",
            okButtonProps: { danger: true },
            cancelText: "Cancel",
            centered: true,
            onOk: async () => {
                try {
                    await deleteWebsite(site.uuid).unwrap();
                    message.success(`${site.name} deleted.`, 4);
                } catch {
                    message.error("Could not delete the site.", 4);
                    throw new Error("delete failed");
                }
            },
        });
    };

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <SkeletonCard />
                <SkeletonCard />
            </div>
        );
    }

    if (sites.length === 0) {
        return (
            <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                    <Globe aria-hidden="true" className="h-6 w-6" />
                </span>
                <p className="mt-4 text-sm font-semibold text-slate-900">
                    No sites yet
                </p>
                <p className="mt-1 text-sm text-slate-500">
                    Deploy your first site from a GitHub repository to see it here.
                </p>
                <Link
                    href="/dashboard"
                    className="mt-4 inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                >
                    Deploy a site
                </Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {sites.map((site) => (
                <Card
                    key={site.uuid}
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
                                href={`https://${site.full_domain}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-blue-500 hover:underline mt-0.5"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {site.full_domain}
                                <ExternalLink className="w-3 h-3" />
                            </a>
                        </div>
                        <StatusBadge status={site.status} />
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-100 my-4" />

                    {/* Stats row */}
                    <div className="flex items-start  justify-between">
                        <div className="min-w-0">
                            <p className="text-xs text-slate-400 mb-0.5">
                                Repository
                            </p>
                            <p className="text-sm font-semibold text-slate-800 truncate">
                                {site.repository_full_name}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 mb-0.5">
                                Branch
                            </p>
                            <p className="text-sm font-semibold text-slate-800">
                                {site.repository_default_branch}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 mb-0.5">
                                Updated
                            </p>
                            <p className="text-sm font-semibold text-slate-800">
                                {timeAgo(site.last_deployed_at ?? site.created_at)}
                            </p>
                        </div>
                    </div>

                    {site.status === "failed" && site.failure_reason && (
                        <p className="mt-3 text-xs text-red-600">
                            {site.failure_reason}
                        </p>
                    )}

                    <div className="mt-4 flex items-center gap-2 border-t border-gray-100 pt-3">
                        <button
                            type="button"
                            onClick={() => handleRedeploy(site)}
                            disabled={isRedeploying}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                        >
                            {isRedeploying ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                                <RefreshCw className="h-3.5 w-3.5" />
                            )}
                            Redeploy
                        </button>

                        <button
                            type="button"
                            onClick={() => confirmDelete(site)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                        </button>
                    </div>
                </Card>
            ))}
        </div>
    );
}

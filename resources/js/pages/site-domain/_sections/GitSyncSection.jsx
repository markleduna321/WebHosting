import React from "react";
import { FolderGit2, GitBranch, RefreshCw, CheckCircle, Loader2, AlertCircle, Lock, Globe } from "lucide-react";
import Table from "@/components/ui/Table";
import Button from "@/components/ui/Button";
import { useGetWebsitesQuery, useRedeployWebsiteMutation, useUpdateAutoPullWebsiteMutation } from "@/features/websites/websitesApi";
import { message, Switch, Tooltip } from "antd";
import { usePage } from "@inertiajs/react";

function StatusBadge({ status }) {
    const STATUS_STYLES = {
        live: "border-green-200 bg-green-50 text-green-600",
        queued: "border-blue-200 bg-blue-50 text-blue-500",
        building: "border-amber-200 bg-amber-50 text-amber-500",
        failed: "border-red-200 bg-red-50 text-red-500",
        stopped: "border-gray-200 bg-gray-50 text-gray-500",
    };

    const Icon = 
        status === "live" ? CheckCircle : 
        (status === "queued" || status === "building") ? Loader2 : 
        AlertCircle;

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${STATUS_STYLES[status] || STATUS_STYLES.stopped}`}
        >
            <Icon className={`w-3.5 h-3.5 ${(status === "queued" || status === "building") ? "animate-spin" : ""}`} />
            {status}
        </span>
    );
}

function SiteCell({ row }) {
    return (
        <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-400">
                <Globe className="w-5 h-5" />
            </div>
            <div>
                <p className="text-sm font-semibold text-slate-900">{row.name}</p>
                <p className="text-xs text-slate-500 mt-0.5">
                    {row.full_domain}
                </p>
            </div>
        </div>
    );
}

function RepositoryCell({ row }) {
    return (
        <div>
            <div className="flex items-center gap-2">
                <FolderGit2 className="w-4 h-4 text-slate-700" />
                <a 
                    href={`https://github.com/${row.repository_full_name}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-sm font-medium text-slate-900 hover:text-blue-600 hover:underline"
                    onClick={(e) => e.stopPropagation()}
                >
                    {row.repository_full_name}
                </a>
                {row.repository_private && (
                    <Lock className="w-3 h-3 text-slate-400" aria-label="Private Repository" />
                )}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500">
                <GitBranch className="w-3.5 h-3.5" />
                <span>{row.repository_default_branch}</span>
            </div>
        </div>
    );
}

function ActionsCell({ row }) {
    const { auth } = usePage().props;
    const isPro = auth?.user?.plan?.slug === "pro";
    const [redeployWebsite, { isLoading }] = useRedeployWebsiteMutation();
    const [updateAutoPull, { isLoading: isUpdatingPull }] = useUpdateAutoPullWebsiteMutation();

    const handleSync = async (e) => {
        e.stopPropagation();
        try {
            await redeployWebsite(row.uuid).unwrap();
            message.success(`Sync queued for ${row.name}`);
        } catch (err) {
            message.error(err?.data?.message || "Failed to trigger sync.");
        }
    };

    const handleToggleAutoPull = async (checked, e) => {
        e.stopPropagation();
        try {
            await updateAutoPull({ uuid: row.uuid, auto_pull_enabled: checked }).unwrap();
            message.success(`Auto Pull ${checked ? "enabled" : "disabled"} for ${row.name}`);
        } catch (err) {
            message.error(err?.data?.message || "Failed to update Auto Pull setting.");
        }
    };

    return (
        <div className="flex items-center justify-end gap-5">
            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                <span className={`text-xs font-medium ${isPro ? (row.auto_pull_enabled ? "text-blue-600" : "text-slate-500") : "text-slate-400"}`}>
                    Auto Pull
                </span>
                <Tooltip title={!isPro ? "Upgrade to Pro to enable Auto Pull on push" : ""}>
                    <Switch
                        size="small"
                        checked={row.auto_pull_enabled}
                        onChange={handleToggleAutoPull}
                        disabled={!isPro || isUpdatingPull}
                    />
                </Tooltip>
            </div>

            <StatusBadge status={row.status} />
            
            <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={handleSync}
                disabled={isLoading || row.status === "queued" || row.status === "building"}
            >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
                Sync Now
            </Button>
        </div>
    );
}

export default function GitSyncSection() {
    const { data: sites = [], isLoading } = useGetWebsitesQuery();

    const columns = [
        {
            header: "Website",
            accessor: "site",
            render: (row) => <SiteCell row={row} />,
        },
        {
            header: "Repository",
            accessor: "repository",
            render: (row) => <RepositoryCell row={row} />,
        },
        {
            header: "",
            accessor: "actions",
            render: (row) => <ActionsCell row={row} />,
        },
    ];

    return (
        <div className="rounded-xl border border-gray-200 bg-white px-6 py-5">
            <div className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <FolderGit2 className="w-4 h-4" />
                        Git Synchronization
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                        Pull the latest commits from your GitHub repositories and redeploy your sites.
                    </p>
                </div>
            </div>

            {isLoading ? (
                <div className="py-12 flex justify-center text-slate-400">
                    <Loader2 className="h-6 w-6 animate-spin" />
                </div>
            ) : sites.length > 0 ? (
                <Table columns={columns} data={sites} />
            ) : (
                <div className="py-10 text-center border rounded-lg border-dashed mt-4 bg-slate-50 border-slate-200">
                    <FolderGit2 className="h-8 w-8 mx-auto text-slate-300 mb-3" />
                    <h3 className="text-sm font-medium text-slate-900">No sites deployed yet</h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                        Once you create a website and link a GitHub repository, you will be able to manage git synchronization here.
                    </p>
                </div>
            )}
        </div>
    );
}

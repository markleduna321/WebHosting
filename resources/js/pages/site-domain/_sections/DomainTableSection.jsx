import { CheckCircle, Loader2, AlertTriangle, Trash2, Star, RefreshCw, Globe } from "lucide-react";
import React, { useState } from "react";
import Table from "@/components/ui/Table";
import DropDown from "@/components/ui/Dropdown";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useGetWebsitesQuery } from "@/features/websites/websitesApi";
import { useGetDomainsQuery, useAddDomainMutation, useDeleteDomainMutation } from "@/features/domains/domainsApi";

const BADGE_STYLES = {
    verified: "border-green-200 bg-green-50 text-green-600",
    pending: "border-blue-200 bg-blue-50 text-blue-500",
    failed: "border-red-200 bg-red-50 text-red-500",
};

function StatusBadge({ status }) {
    const Icon =
        status === "verified"
            ? CheckCircle
            : status === "pending"
              ? Loader2
              : AlertTriangle;

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${BADGE_STYLES[status] || BADGE_STYLES.pending}`}
        >
            <Icon className={`w-3.5 h-3.5 ${status === "pending" ? "animate-spin" : ""}`} />
            {status}
        </span>
    );
}

function DomainCell({ row }) {
    return (
        <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-400">
                <Globe className="w-4 h-4" />
            </div>
            <div>
                <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-900">
                        {row.domain}
                    </span>
                    {row.primary && (
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                            Primary
                        </span>
                    )}
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                    {row.site || "No site linked"} · SSL: {row.ssl} · Added {new Date(row.created_at).toLocaleDateString()}
                </p>
            </div>
        </div>
    );
}

function ActionsCell({ row }) {
    const [deleteDomain, { isLoading: isDeleting }] = useDeleteDomainMutation();

    const handleDelete = () => {
        if (confirm("Are you sure you want to remove this domain?")) {
            deleteDomain(row.id);
        }
    };

    return (
        <div className="flex items-center justify-end gap-2">
            <StatusBadge status={row.status} />

            {/* Star (favourite) — only for non-primary verified */}
            {!row.primary && row.status === "verified" && (
                <button
                    aria-label="Set as primary"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-50 transition-colors"
                >
                    <Star className="w-4 h-4" />
                </button>
            )}

            {/* Refresh — for pending / failed */}
            {(row.status === "pending" || row.status === "failed") && (
                <button
                    aria-label="Retry"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-slate-50 transition-colors"
                >
                    <RefreshCw className="w-4 h-4" />
                </button>
            )}

            {/* Delete */}
            <button
                onClick={handleDelete}
                disabled={isDeleting}
                aria-label="Delete domain"
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            </button>
        </div>
    );
}

const COLUMNS = [
    {
        header: "",
        accessor: "domain",
        render: (row) => <DomainCell row={row} />,
    },
    {
        header: "",
        accessor: "actions",
        render: (row) => <ActionsCell row={row} />,
    },
];

export default function DomainTableSection() {
    const { data: sites = [] } = useGetWebsitesQuery();
    const { data: domains = [], isLoading: isLoadingDomains } = useGetDomainsQuery();
    const [addDomain, { isLoading: isAdding }] = useAddDomainMutation();
    const [domainInput, setDomainInput] = useState("");
    const [selectedSite, setSelectedSite] = useState(null);
    const [error, setError] = useState(null);

    const siteItems = sites.map((site) => ({
        label: site.name,
        onClick: () => setSelectedSite(site),
    }));

    const handleAddDomain = async (e) => {
        e.preventDefault();
        setError(null);

        const trimmed = domainInput.trim();
        if (!trimmed || !selectedSite) return;

        try {
            await addDomain({ domain_name: trimmed, website_id: selectedSite.id }).unwrap();
            setDomainInput("");
            setSelectedSite(null);
        } catch (err) {
            setError(err?.data?.errors?.domain_name?.[0] || err?.data?.message || "Failed to add domain.");
        }
    };

    return (
        <div className="rounded-xl border border-gray-200 bg-white px-6 py-5">
            {/* Header */}
            <div className="mb-4 flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-sm font-bold text-slate-900">
                        Connected domains
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                        {domains.length} domain{domains.length === 1 ? "" : "s"} across
                        your websites
                    </p>
                </div>

                <form
                    onSubmit={handleAddDomain}
                    className="flex flex-wrap items-center gap-3 w-full md:w-auto"
                >
                    <div className="w-full md:w-48 relative">
                        <Input
                            name="new-domain"
                            placeholder="myproject.dev"
                            value={domainInput}
                            onChange={(e) => setDomainInput(e.target.value)}
                        />
                        {error && (
                            <div className="absolute -bottom-5 left-0 text-[10px] text-red-500">
                                {error}
                            </div>
                        )}
                    </div>
                    <DropDown
                        buttonText={selectedSite?.name ?? "Select website"}
                        items={siteItems}
                        align="right"
                    />
                    <Button
                        type="submit"
                        disabled={!domainInput.trim() || !selectedSite || isAdding}
                        className="rounded-full px-5"
                    >
                        {isAdding ? "Adding..." : "Add domain"}
                    </Button>
                </form>
            </div>

            {isLoadingDomains ? (
                <div className="py-12 flex justify-center text-slate-400">
                    <Loader2 className="h-6 w-6 animate-spin" />
                </div>
            ) : domains.length > 0 ? (
                <Table columns={COLUMNS} data={domains} />
            ) : (
                <div className="py-10 text-center border rounded-lg border-dashed mt-4 bg-slate-50 border-slate-200">
                    <Globe className="h-8 w-8 mx-auto text-slate-300 mb-3" />
                    <h3 className="text-sm font-medium text-slate-900">No domains connected</h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                        You haven't connected any custom domains to your websites yet. Select a website and enter a domain above to get started.
                    </p>
                </div>
            )}
        </div>
    );
}

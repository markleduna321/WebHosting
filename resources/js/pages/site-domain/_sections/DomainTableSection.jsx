import { CheckCircle, Loader2, AlertTriangle, Trash2, Star, RefreshCw, Globe, Info, Copy, Check } from "lucide-react";
import React, { useState } from "react";
import Table from "@/components/ui/Table";
import DropDown from "@/components/ui/Dropdown";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
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

function ActionsCell({ row, onShowGuide }) {
    const [deleteDomain, { isLoading: isDeleting }] = useDeleteDomainMutation();

    const handleDelete = () => {
        if (confirm("Are you sure you want to remove this domain?")) {
            deleteDomain(row.id);
        }
    };

    return (
        <div className="flex items-center justify-end gap-2">
            <StatusBadge status={row.status} />

            {/* Info / Setup Guide — for pending domains */}
            {row.status === "pending" && (
                <button
                    onClick={() => onShowGuide(row)}
                    aria-label="Setup Guide"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-slate-50 transition-colors"
                >
                    <Info className="w-4 h-4" />
                </button>
            )}

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

function SetupGuideModal({ domain, onClose }) {
    const [copied, setCopied] = useState(false);
    const serverIP = "192.168.1.100"; // TODO: Fetch real server IP from backend

    const handleCopy = () => {
        navigator.clipboard.writeText(serverIP);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Modal
            open={!!domain}
            onCancel={onClose}
            title="Domain Setup Guide"
            subtitle={`How to connect ${domain?.domain} to your website`}
            width={600}
            footer={
                <div className="flex justify-end">
                    <Button variant="primary" onClick={onClose}>
                        Got it, I've updated my DNS
                    </Button>
                </div>
            }
        >
            <div className="space-y-6">
                <div className="rounded-lg bg-blue-50 p-4 border border-blue-100 flex items-start gap-3 text-sm text-blue-800">
                    <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                    <p>
                        Your domain is currently <strong>pending</strong>. To complete the connection, you must update the DNS settings at your domain registrar (e.g. Hostinger, GoDaddy, Namecheap).
                    </p>
                </div>

                <div className="space-y-4">
                    <div className="flex gap-4">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600">
                            1
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-slate-900">Log in to your domain provider</h4>
                            <p className="mt-1 text-sm text-slate-500">
                                Sign in to the website where you bought your domain and locate the <strong>DNS Settings</strong> or <strong>Zone Editor</strong> for <span className="font-semibold text-slate-700">{domain?.domain}</span>.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600">
                            2
                        </div>
                        <div className="w-full">
                            <h4 className="text-sm font-semibold text-slate-900">Add an A Record</h4>
                            <p className="mt-1 text-sm text-slate-500 mb-3">
                                Create a new A Record pointing to our server's IP address. If you already have an A Record for `@`, edit its value.
                            </p>
                            
                            <div className="rounded-lg border border-slate-200 overflow-hidden text-sm">
                                <div className="grid grid-cols-3 bg-slate-50 border-b border-slate-200 p-2 font-medium text-slate-600">
                                    <div>Type</div>
                                    <div>Name</div>
                                    <div>Value / Points to</div>
                                </div>
                                <div className="grid grid-cols-3 p-3 items-center">
                                    <div className="font-mono text-slate-800">A</div>
                                    <div className="font-mono text-slate-800">@</div>
                                    <div className="flex items-center gap-2 font-mono text-slate-800">
                                        {serverIP}
                                        <button 
                                            onClick={handleCopy}
                                            className="text-slate-400 hover:text-blue-500 focus:outline-none"
                                            title="Copy IP Address"
                                        >
                                            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600">
                            3
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-slate-900">Wait for propagation</h4>
                            <p className="mt-1 text-sm text-slate-500">
                                Once updated, it can take anywhere from 5 minutes to 24 hours for DNS changes to propagate globally. We will continuously check your domain and issue a free SSL certificate automatically once it resolves.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
}

export default function DomainTableSection() {
    const { data: sites = [] } = useGetWebsitesQuery();
    const { data: domains = [], isLoading: isLoadingDomains } = useGetDomainsQuery();
    const [addDomain, { isLoading: isAdding }] = useAddDomainMutation();
    const [domainInput, setDomainInput] = useState("");
    const [selectedSite, setSelectedSite] = useState(null);
    const [error, setError] = useState(null);
    const [setupGuideDomain, setSetupGuideDomain] = useState(null);

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
            const result = await addDomain({ domain_name: trimmed, website_uuid: selectedSite.uuid }).unwrap();
            setDomainInput("");
            setSelectedSite(null);
            // Automatically pop open the guide when they add a domain!
            setSetupGuideDomain(result.data || result); 
        } catch (err) {
            setError(err?.data?.errors?.domain_name?.[0] || err?.data?.message || "Failed to add domain.");
        }
    };

    const columns = [
        {
            header: "",
            accessor: "domain",
            render: (row) => <DomainCell row={row} />,
        },
        {
            header: "",
            accessor: "actions",
            render: (row) => <ActionsCell row={row} onShowGuide={setSetupGuideDomain} />,
        },
    ];

    return (
        <>
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
                    <Table columns={columns} data={domains} />
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
            
            <SetupGuideModal domain={setupGuideDomain} onClose={() => setSetupGuideDomain(null)} />
        </>
    );
}

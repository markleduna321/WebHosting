import { CheckCircle, Loader2, AlertTriangle, Trash2, Star, RefreshCw, Globe } from "lucide-react";
import React, { useState } from "react";
import Table from "@/components/ui/Table";
import DropDown from "@/components/ui/Dropdown";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useGetWebsitesQuery } from "@/features/websites/websitesApi";

const INITIAL_DOMAINS = [
    {
        id: 1,
        domain: "mariaclara.dev",
        primary: true,
        site: "Portfolio 2026",
        ssl: "SSL active",
        renews: "Mar 4, 2027",
        status: "verified",
    },
    {
        id: 2,
        domain: "thesis-traffic.ph",
        primary: false,
        site: "CS Thesis — Traffic Model",
        ssl: "SSL active",
        renews: "Jan 22, 2027",
        status: "verified",
    },
    {
        id: 3,
        domain: "acmchapter.org",
        primary: false,
        site: "ACM Student Chapter",
        ssl: "SSL issuing",
        renews: "Aug 30, 2027",
        status: "pending",
    },
    {
        id: 4,
        domain: "kadiwa.shop",
        primary: false,
        site: "Kadiwa Marketplace (demo)",
        ssl: "No SSL",
        renews: "Nov 12, 2026",
        status: "failed",
    },
];

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
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${BADGE_STYLES[status]}`}
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
                    {row.site} · {row.ssl} · renews {row.renews}
                </p>
            </div>
        </div>
    );
}

function ActionsCell({ row }) {
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
                aria-label="Delete domain"
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-slate-50 transition-colors"
            >
                <Trash2 className="w-4 h-4" />
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
    const [domains, setDomains] = useState(INITIAL_DOMAINS);
    const [domainInput, setDomainInput] = useState("");
    const [selectedSite, setSelectedSite] = useState(null);

    const siteItems = sites.map((site) => ({
        label: site.name,
        onClick: () => setSelectedSite(site),
    }));

    const handleAddDomain = (e) => {
        e.preventDefault();

        const trimmed = domainInput.trim();
        if (!trimmed || !selectedSite) return;

        setDomains((prev) => [
            {
                id: (prev.at(-1)?.id ?? 0) + 1,
                domain: trimmed,
                primary: false,
                site: selectedSite.name,
                ssl: "SSL issuing",
                renews: "—",
                status: "pending",
            },
            ...prev,
        ]);
        setDomainInput("");
    };

    return (
        <div className="rounded-xl border border-gray-200 bg-white px-6 py-5">
            {/* Header */}
            <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
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
                    className="flex flex-wrap items-center gap-3"
                >
                    <div className="w-48">
                        <Input
                            name="new-domain"
                            placeholder="myproject.dev"
                            value={domainInput}
                            onChange={(e) => setDomainInput(e.target.value)}
                        />
                    </div>
                    <DropDown
                        buttonText={selectedSite?.name ?? "Select website"}
                        items={siteItems}
                        align="right"
                    />
                    <Button
                        type="submit"
                        disabled={!domainInput.trim() || !selectedSite}
                        className="rounded-full px-5"
                    >
                        Add domain
                    </Button>
                </form>
            </div>

            <Table columns={COLUMNS} data={domains} />
        </div>
    );
}

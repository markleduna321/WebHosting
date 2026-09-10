import { CheckCircle, Loader2, AlertTriangle, Trash2, Star, RefreshCw, Globe } from "lucide-react";
import React from "react";
import Table from "@/components/ui/Table";

const DOMAINS = [
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

function StatusBadge({ status }) {
    if (status === "verified") {
        return (
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-600">
                <CheckCircle className="w-4 h-4" />
                verified
            </span>
        );
    }
    if (status === "pending") {
        return (
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                pending
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-500">
            <AlertTriangle className="w-3.5 h-3.5" />
            failed
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

export default function TableSection() {
    return (
        <div className="rounded-xl border border-gray-200 bg-white px-6 py-5">
            {/* Header */}
            <div className="mb-4">
                <h2 className="text-sm font-bold text-slate-900">
                    Connected domains
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                    4 domains across your websites
                </p>
            </div>

            <Table columns={COLUMNS} data={DOMAINS} />
        </div>
    );
}

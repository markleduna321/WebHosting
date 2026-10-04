import { Download } from "lucide-react";
import React from "react";
import { usePage } from "@inertiajs/react";
import Button from "@/components/ui/Button";
import Table from "@/components/ui/Table";
import { formatBillingPeriod } from "@/data/hostingPlans";

/**
 * Format a date string for display.
 */
function formatDate(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

/**
 * Format the billing cycle label for display.
 */
function formatCycleLabel(cycle) {
    const months = cycle === "monthly"
        ? 1
        : cycle === "annual"
            ? 12
            : Number(cycle);

    return Number.isSafeInteger(months) && months > 0
        ? formatBillingPeriod(months)
        : cycle;
}

const COLUMNS = [
    {
        header: "Invoice",
        accessor: "uuid",
        render: (row) => (
            <span className="text-sm font-semibold text-slate-800">
                {row.invoice_number ?? row.uuid?.substring(0, 8).toUpperCase()}
            </span>
        ),
    },
    {
        header: "Plan",
        accessor: "plan",
        render: (row) => (
            <div>
                <p className="text-sm text-slate-800">
                    {row.plan?.name ?? "—"}
                </p>
                <p className="text-xs text-slate-400">
                    {formatCycleLabel(row.billing_cycle)}
                </p>
            </div>
        ),
    },
    {
        header: "Date",
        accessor: "created_at",
        render: (row) => (
            <div>
                <p className="text-sm text-slate-800">
                    {row.paid_at
                        ? formatDate(row.paid_at)
                        : formatDate(row.created_at)}
                </p>
                <p className="text-xs text-slate-400">
                    Created {formatDate(row.created_at)}
                </p>
            </div>
        ),
    },
    {
        header: "Amount",
        accessor: "amount",
        render: (row) => {
            const symbol = row.currency === "PHP" ? "₱" : "$";
            return (
                <span className="text-sm text-slate-800">
                    {symbol}
                    {Number(row.amount).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                    })}
                </span>
            );
        },
    },
    {
        header: "Status",
        accessor: "status",
        render: (row) => {
            const map = {
                paid: {
                    label: "Paid",
                    className:
                        "border-green-300 text-green-600",
                },
                failed: {
                    label: "Failed",
                    className:
                        "border-red-300 text-red-500",
                },
                pending: {
                    label: "Pending",
                    className:
                        "border-yellow-300 text-yellow-600",
                },
                expired: {
                    label: "Expired",
                    className:
                        "border-gray-300 text-gray-500",
                },
            };
            const s = map[row.status] || map.pending;
            return (
                <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${s.className}`}
                >
                    {s.label}
                </span>
            );
        },
    },
    {
        header: "",
        accessor: "download",
        render: (row) =>
            row.invoice?.download_url ? (
                <a
                    href={row.invoice.download_url}
                    download
                    // The row itself opens the invoice; don't trigger that as well.
                    onClick={(e) => e.stopPropagation()}
                    aria-label={`Download invoice ${row.invoice_number} as PDF`}
                    title="Download PDF"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                    <Download className="h-4 w-4" />
                </a>
            ) : null,
    },
];

export default function SubscriptionInvoiceHistorySection({ onSelectInvoice }) {
    const { invoices } = usePage().props;

    const data = invoices ?? [];

    return (
        <div className="rounded-xl border border-gray-200 bg-white px-6 py-5">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-slate-900">
                    Invoice history
                </h2>
            </div>

            {data.length === 0 ? (
                <p className="text-sm text-slate-400 py-4 text-center">
                    No invoices yet. Your payment history will appear here.
                </p>
            ) : (
                <Table
                    columns={COLUMNS}
                    data={data}
                    onRowClick={onSelectInvoice}
                />
            )}
        </div>
    );
}

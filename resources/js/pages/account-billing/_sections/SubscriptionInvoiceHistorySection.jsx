import { Download } from "lucide-react";
import React from "react";
import { usePage } from "@inertiajs/react";
import Button from "@/components/ui/Button";
import Table from "@/components/ui/Table";

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
    switch (cycle) {
        case "monthly":
        case "1":
            return "Monthly";
        case "annual":
        case "12":
            return "Annual";
        case "24":
            return "2-Year";
        case "48":
            return "4-Year";
        default:
            return cycle;
    }
}

const COLUMNS = [
    {
        header: "Invoice",
        accessor: "uuid",
        render: (row) => (
            <span className="text-sm font-semibold text-slate-800">
                {row.uuid?.substring(0, 8).toUpperCase()}
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

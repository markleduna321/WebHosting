import { Download } from "lucide-react";
import React from "react";
import Button from "../../../../_components/button";
import Table from "../../../../_components/table";

const INVOICES = [
    {
        id: "INV-2026-08",
        period: "August 2026",
        issued: "Issued Aug 1, 2026",
        paidWith: "GCash ●●●● 4821",
        amount: "₱199.00",
        status: "paid",
    },
    {
        id: "INV-2026-07",
        period: "July 2026",
        issued: "Issued Jul 1, 2026",
        paidWith: "GCash ●●●● 4821",
        amount: "₱199.00",
        status: "paid",
    },
    {
        id: "INV-2026-06",
        period: "June 2026",
        issued: "Issued Jun 1, 2026",
        paidWith: "Visa ●●●● 0294",
        amount: "₱199.00",
        status: "paid",
    },
    {
        id: "INV-2026-05",
        period: "May 2026",
        issued: "Issued May 1, 2026",
        paidWith: "Visa ●●●● 0294",
        amount: "₱99.00",
        status: "paid",
    },
    {
        id: "INV-2026-04",
        period: "April 2026",
        issued: "Issued Apr 2, 2026",
        paidWith: "Maya ●●●● 7710",
        amount: "₱99.00",
        status: "failed",
    },
];

const COLUMNS = [
    {
        header: "Invoice",
        accessor: "id",
        render: (row) => (
            <span className="text-sm font-semibold text-slate-800">
                {row.id}
            </span>
        ),
    },
    {
        header: "Period",
        accessor: "period",
        render: (row) => (
            <div>
                <p className="text-sm text-slate-800">{row.period}</p>
                <p className="text-xs text-slate-400">{row.issued}</p>
            </div>
        ),
    },
    {
        header: "Paid with",
        accessor: "paidWith",
        render: (row) => (
            <span className="text-sm text-slate-700">{row.paidWith}</span>
        ),
    },
    {
        header: "Amount",
        accessor: "amount",
        render: (row) => (
            <span className="text-sm text-slate-800">{row.amount}</span>
        ),
    },
    {
        header: "Status",
        accessor: "status",
        render: (row) =>
            row.status === "paid" ? (
                <span className="inline-flex items-center rounded-full border border-green-300 px-2.5 py-0.5 text-xs font-medium text-green-600">
                    Paid
                </span>
            ) : (
                <span className="inline-flex items-center rounded-full border border-red-300 px-2.5 py-0.5 text-xs font-medium text-red-500">
                    Failed
                </span>
            ),
    },
    {
        header: "Receipt",
        accessor: "receipt",
        render: () => (
            <Button
                variant="light"
                size="xs"
                outlined
                className="rounded-lg gap-1.5 text-blue-600 border-0 hover:bg-blue-50"
            >
                <Download className="w-3.5 h-3.5" />
                Download
            </Button>
        ),
    },
];

export default function InvoiceHistorySection() {
    return (
        <div className="rounded-xl border border-gray-200 bg-white px-6 py-5">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-slate-900">
                    Invoice history
                </h2>
                <Button
                    variant="light"
                    size="xs"
                    outlined
                    className="rounded-lg border-0 text-blue-600 hover:bg-blue-50"
                >
                    Export all
                </Button>
            </div>

            <Table columns={COLUMNS} data={INVOICES} />
        </div>
    );
}

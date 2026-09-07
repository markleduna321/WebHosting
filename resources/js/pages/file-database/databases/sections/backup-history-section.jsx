import { Download } from "lucide-react";
import React from "react";
import Table from "../../../../_components/table";

const BACKUPS = [
    {
        id: 1,
        db: "portfolio_prod",
        meta: "Aug 30, 2026 · 02:10 · 84 MB",
        trigger: "Automatic",
    },
    {
        id: 2,
        db: "traffic_model",
        meta: "Aug 30, 2026 · 02:14 · 612 MB",
        trigger: "Automatic",
    },
    {
        id: 3,
        db: "portfolio_prod",
        meta: "Aug 24, 2026 · 16:42 · 81 MB",
        trigger: "Manual",
    },
    {
        id: 4,
        db: "traffic_model",
        meta: "Aug 23, 2026 · 02:11 · 598 MB",
        trigger: "Automatic",
    },
];

const COLUMNS = [
    {
        header: "",
        accessor: "db",
        render: (row) => (
            <div>
                <p className="text-sm font-semibold text-slate-900 font-mono">
                    {row.db}
                </p>
                <p className="text-xs text-blue-400 mt-0.5">{row.meta}</p>
            </div>
        ),
    },
    {
        header: "",
        accessor: "actions",
        render: (row) => (
            <div className="flex items-center justify-end gap-3">
                {/* Trigger badge */}
                <span className="inline-flex items-center rounded-lg border border-gray-200 px-2.5 py-1 text-xs font-medium text-slate-600">
                    {row.trigger}
                </span>

                {/* Download */}
                <button className="inline-flex items-center gap-1 text-xs font-medium text-blue-500 hover:text-blue-700 transition-colors">
                    <Download className="w-3.5 h-3.5" />
                    Download
                </button>

                {/* Restore */}
                <button className="text-xs font-medium text-slate-700 hover:text-slate-900 transition-colors">
                    Restore
                </button>
            </div>
        ),
    },
];

export default function BackupHistorySection() {
    return (
        <div className="rounded-xl border border-gray-200 bg-white px-6 py-5 h-full">
            {/* Header */}
            <div className="mb-4">
                <h2 className="text-sm font-bold text-slate-900">
                    Backup history
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                    4 snapshots available to restore
                </p>
            </div>

            <Table columns={COLUMNS} data={BACKUPS} />
        </div>
    );
}

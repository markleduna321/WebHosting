import { ExternalLink, Download, DatabaseBackup } from "lucide-react";
import React, { useState } from "react";
import Button from "../../../../_components/button";

const DATABASES = [
    "portfolio_prod",
    "thesis_traffic_db",
    "acm_chapter_db",
    "kadiwa_demo_db",
];

export default function DatabaseToolSection() {
    const [selectedDb, setSelectedDb] = useState(DATABASES[0]);

    return (
        <div className="rounded-xl border border-gray-200 bg-white px-6 py-5 h-full">
            {/* Header */}
            <h2 className="text-sm font-bold text-slate-900">
                Database tools
            </h2>
            <p className="mt-1 text-xs text-slate-500">
                Open a full SQL client or take a snapshot before you run a
                risky migration.
            </p>

            {/* Tool buttons */}
            <div className="mt-4 flex items-center gap-3">
                <Button
                    variant="outlined"
                    size="sm"
                    className="rounded-lg gap-2 bg-slate-900 text-white hover:bg-slate-800 border-0"
                >
                    <span className="flex items-center gap-1.5">
                        <svg
                            className="w-3.5 h-3.5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <rect x="3" y="3" width="7" height="7" rx="1" />
                            <rect x="14" y="3" width="7" height="7" rx="1" />
                            <rect x="3" y="14" width="7" height="7" rx="1" />
                            <rect x="14" y="14" width="7" height="7" rx="1" />
                        </svg>
                        Open phpMyAdmin
                        <ExternalLink className="w-3 h-3" />
                    </span>
                </Button>

                <Button
                    variant="light"
                    size="sm"
                    outlined
                    className="rounded-lg gap-2"
                >
                    <Download className="w-3.5 h-3.5 text-slate-500" />
                    Export all as .sql
                </Button>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100 my-5" />

            {/* Backup section */}
            <p className="text-xs font-semibold text-slate-700 mb-2">
                Back up a database now
            </p>
            <div className="flex items-center gap-3">
                <select
                    value={selectedDb}
                    onChange={(e) => setSelectedDb(e.target.value)}
                    className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-slate-800 font-mono focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition"
                >
                    {DATABASES.map((db) => (
                        <option key={db} value={db}>
                            {db}
                        </option>
                    ))}
                </select>

                <Button
                    variant="primary"
                    size="sm"
                    className="rounded-lg gap-1.5 shrink-0"
                >
                    <DatabaseBackup className="w-3.5 h-3.5" />
                    Back up
                </Button>
            </div>

            <p className="mt-3 text-xs text-slate-400">
                Automatic backups run nightly at 02:00 and are kept for 14 days.
            </p>
        </div>
    );
}

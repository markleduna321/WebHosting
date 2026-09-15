import React, { useEffect, useState } from "react";
import { ExternalLink, Download, Database, RefreshCw } from "lucide-react";
import { message } from "antd";
import Button from "@/components/ui/Button";
import {
    useGetDatabasesQuery,
    useLazyExportDatabaseQuery,
} from "@/features/databases/databasesApi";

export default function DatabaseToolSection() {
    const { data, isLoading } = useGetDatabasesQuery();
    const [exportDatabase, { isFetching: isExporting }] = useLazyExportDatabaseQuery();
    const [selectedUuid, setSelectedUuid] = useState("");

    const databases = (data?.items ?? []).filter((db) => db.status === "active");
    const phpMyAdminUrl = data?.meta?.phpmyadmin_url;
    const hasDatabases = databases.length > 0;

    useEffect(() => {
        const stillExists = databases.some((db) => db.uuid === selectedUuid);

        if (!stillExists) {
            setSelectedUuid(databases[0]?.uuid ?? "");
        }
    }, [databases, selectedUuid]);

    const handleExport = async () => {
        const target = databases.find((db) => db.uuid === selectedUuid);

        if (!target) return;

        try {
            const blob = await exportDatabase(target.uuid).unwrap();
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");

            link.href = url;
            link.download = `${target.db_name}.sql`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(url);

            message.success(`${target.db_name}.sql downloaded`);
        } catch (err) {
            message.error(err?.data?.message ?? "Could not export that database.");
        }
    };

    return (
        <div className="rounded-xl border border-gray-200 bg-white px-6 py-5 h-full">
            <h2 className="text-sm font-bold text-slate-900">Database tools</h2>
            <p className="mt-1 text-xs text-slate-500">
                Open a full SQL client, or download a snapshot before you run a
                risky migration.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3">
                {phpMyAdminUrl ? (
                    <a
                        href={phpMyAdminUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
                    >
                        <Database className="w-3.5 h-3.5" />
                        Open phpMyAdmin
                        <ExternalLink className="w-3 h-3" />
                    </a>
                ) : (
                    <span className="text-xs text-slate-400">
                        SQL client unavailable
                    </span>
                )}
            </div>

            <div className="border-t border-gray-100 my-5" />

            <p className="text-xs font-semibold text-slate-700 mb-2">
                Export a database
            </p>

            {isLoading ? (
                <div className="h-9 w-full animate-pulse rounded-lg bg-gray-100" />
            ) : hasDatabases ? (
                <>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <label className="sr-only" htmlFor="export-database">
                            Database to export
                        </label>
                        <select
                            id="export-database"
                            value={selectedUuid}
                            onChange={(e) => setSelectedUuid(e.target.value)}
                            disabled={isExporting}
                            className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-mono text-slate-800 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:opacity-50"
                        >
                            {databases.map((db) => (
                                <option key={db.uuid} value={db.uuid}>
                                    {db.db_name}
                                </option>
                            ))}
                        </select>

                        <Button
                            variant="primary"
                            size="sm"
                            onClick={handleExport}
                            disabled={isExporting || !selectedUuid}
                            className="rounded-lg gap-1.5 shrink-0"
                        >
                            {isExporting ? (
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                                <Download className="w-3.5 h-3.5" />
                            )}
                            {isExporting ? "Preparing…" : "Export .sql"}
                        </Button>
                    </div>

                    <p className="mt-3 text-xs text-slate-400">
                        The file contains every table definition and row, ready
                        to re-import.
                    </p>
                </>
            ) : (
                <p className="text-xs text-slate-400">
                    Create a database first — there is nothing to export yet.
                </p>
            )}
        </div>
    );
}

import React from "react";
import Button from "@/components/ui/Button";
import { Plus } from "lucide-react";
import Skeleton from "@/components/ui/Skeleton";
import { useGetDatabasesQuery } from "@/features/databases/databasesApi";

const MB = 1024 * 1024;

function formatSize(bytes) {
    if (bytes >= 1024 * MB) return `${(bytes / (1024 * MB)).toFixed(2)} GB`;
    if (bytes >= MB) return `${(bytes / MB).toFixed(1)} MB`;
    return `${Math.round(bytes / 1024)} KB`;
}

export default function DatabaseHeaderSection({ onCreate }) {
    const { data, isLoading } = useGetDatabasesQuery();

    const items = data?.items ?? [];
    const maxPerUser = data?.meta?.max_per_user ?? 0;
    const quotaMb = data?.meta?.quota_mb ?? 0;

    const usedBytes = items.reduce((total, db) => total + (db.size_bytes ?? 0), 0);
    const allowanceBytes = maxPerUser * quotaMb * MB;
    const percent = allowanceBytes > 0 ? Math.min(100, (usedBytes / allowanceBytes) * 100) : 0;
    const atLimit = maxPerUser > 0 && items.length >= maxPerUser;

    return (
        <div className="rounded-xl border border-gray-200 bg-white px-6 py-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-xs text-slate-400 mb-1">
                        Database storage used
                    </p>

                    {isLoading ? (
                        <Skeleton className="h-6 w-32 rounded-md" />
                    ) : (
                        <div className="flex items-baseline gap-1.5">
                            <span className="text-lg font-bold text-slate-900">
                                {formatSize(usedBytes)}
                            </span>
                            <span className="text-xs text-slate-400">
                                of {formatSize(allowanceBytes)}
                            </span>
                        </div>
                    )}

                    <div className="mt-2 h-1 w-32 rounded-full bg-gray-100">
                        <div
                            className="h-1 rounded-full bg-blue-500 transition-[width] duration-500"
                            style={{ width: `${percent}%` }}
                        />
                    </div>

                    {!isLoading && maxPerUser > 0 && (
                        <p className="mt-2 text-xs text-slate-500">
                            {items.length} of {maxPerUser} databases used ·{" "}
                            {quotaMb} MB each
                        </p>
                    )}
                </div>

                <div className="flex flex-col items-start gap-1.5 sm:items-end">
                    <Button
                        variant="primary"
                        size="md"
                        onClick={onCreate}
                        disabled={isLoading || atLimit}
                        className="rounded-lg gap-1.5 shrink-0"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        Create database
                    </Button>

                    {atLimit && (
                        <p className="text-xs text-amber-600">
                            Limit reached — delete a database to create another.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

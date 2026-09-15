import React from "react";
import { Archive } from "lucide-react";

export default function BackupHistorySection() {
    return (
        <div className="rounded-xl border border-gray-200 bg-white px-6 py-5 h-full">
            <div className="mb-4">
                <h2 className="text-sm font-bold text-slate-900">
                    Backup history
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                    Scheduled snapshots of your databases
                </p>
            </div>

            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 px-6 py-10 text-center">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
                    <Archive className="h-5 w-5" />
                </div>
                <p className="mt-3 text-sm font-semibold text-slate-900">
                    No backups yet
                </p>
                <p className="mt-1 max-w-xs text-xs text-slate-500">
                    Scheduled backups are not available on this plan yet. Use
                    <span className="font-medium text-slate-600">
                        {" "}
                        Export .sql{" "}
                    </span>
                    to download a snapshot whenever you need one.
                </p>
            </div>
        </div>
    );
}

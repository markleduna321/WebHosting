import React from "react";
import FileDatabaseLayout from "../layout";

export default function Page() {
    return (
        <FileDatabaseLayout>
            <div className="rounded-xl border border-gray-200 bg-white p-6 text-center">
                <p className="text-sm font-semibold text-slate-900">
                    Databases
                </p>
                <p className="mt-1 text-sm text-slate-500">
                    Manage your MySQL databases.
                </p>
            </div>
        </FileDatabaseLayout>
    );
}

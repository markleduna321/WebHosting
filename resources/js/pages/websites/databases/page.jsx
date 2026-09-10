import React from "react";
import MainLayout from "@/components/layout/MainLayout";

export default function Page() {
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-6 text-center">
            <p className="text-sm font-semibold text-slate-900">Databases</p>
            <p className="mt-1 text-sm text-slate-500">
                This section is coming soon.
            </p>
        </div>
    );
}

Page.layout = (page) => (
    <MainLayout title="Databases" subtitle="Manage your MySQL databases">
        {page}
    </MainLayout>
);

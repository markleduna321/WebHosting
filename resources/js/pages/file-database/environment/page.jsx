import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import FileDatabaseLayout from "@/components/layout/FileDatabaseLayout";

export default function Page() {
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-6 text-center">
            <p className="text-sm font-semibold text-slate-900">Environment</p>
            <p className="mt-1 text-sm text-slate-500">
                Manage environment variables for your applications.
            </p>
        </div>
    );
}

Page.layout = (page) => (
    <MainLayout title="Environment">
        <FileDatabaseLayout>{page}</FileDatabaseLayout>
    </MainLayout>
);

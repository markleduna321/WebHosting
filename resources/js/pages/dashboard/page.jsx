import React from "react";
import { usePage } from "@inertiajs/react";
import HeaderSection from "./sections/header-section";
import PerformanceSection from "./sections/performance-section";
import PlanResourceUsageSection from "./sections/plan-resource-usage-section";
import TipsSection from "./sections/tips-section";
import Layout from "../layout";
import ProjectListSection from "./sections/project-list-section";
import ShortcutSection from "./sections/short-cut-section";

export default function Page() {
    const { auth } = usePage().props;
    const isAdministrator = auth?.user?.role === "administrator";

    // Administrators manage the site from the admin portal, not this user dashboard.
    if (isAdministrator) {
        return (
            <Layout title="Dashboard" subtitle={auth?.user?.name}>
                <div className="rounded-xl border border-gray-200 bg-white p-6 text-center">
                    <p className="text-sm font-semibold text-slate-900">
                        This dashboard is only available to student accounts.
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                        Use the admin portal to manage the platform.
                    </p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout
            title="Dashboard"
            subtitle="Maria Clara Santos · Student Pro plan"
        >
            <div className="space-y-6">
                <HeaderSection />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ProjectListSection />

                    <div className="flex flex-col gap-6">
                        <PerformanceSection />
                        <PlanResourceUsageSection />
                    </div>
                </div>
                <ShortcutSection />
                <TipsSection />
            </div>
        </Layout>
    );
}

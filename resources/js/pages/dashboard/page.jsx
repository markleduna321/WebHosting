import React from "react";
import { usePage } from "@inertiajs/react";
import MainLayout from "@/components/layout/MainLayout";
import HeaderSection from "./_sections/HeaderSection";
import PerformanceSection from "./_sections/PerformanceSection";
import PlanResourceUsageSection from "./_sections/PlanResourceUsageSection";
import TipsSection from "./_sections/TipsSection";
import ProjectListSection from "./_sections/ProjectListSection";
import ShortcutSection from "./_sections/ShortcutSection";

export default function Page() {
    const { auth } = usePage().props;
    const isAdministrator = Boolean(auth?.user?.roles?.includes("admin"));

    // Administrators manage the site from the admin portal, not this user dashboard.
    if (isAdministrator) {
        return (
            <div className="rounded-xl border border-gray-200 bg-white p-6 text-center">
                <p className="text-sm font-semibold text-slate-900">
                    This dashboard is only available to student accounts.
                </p>
                <p className="mt-1 text-sm text-slate-500">
                    Use the admin portal to manage the platform.
                </p>
            </div>
        );
    }

    return (
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
    );
}

Page.layout = (page) => (
    <MainLayout
        title="Dashboard"
        subtitle={
            page.props.auth?.user?.roles?.includes("admin")
                ? page.props.auth?.user?.name
                : "Maria Clara Santos · Student Pro plan"
        }
    >
        {page}
    </MainLayout>
);

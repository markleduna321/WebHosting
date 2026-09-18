import React from "react";
import { usePage } from "@inertiajs/react";
import MainLayout from "@/components/layout/MainLayout";
import HeaderSection from "./_sections/HeaderSection";
import PerformanceSection from "./_sections/PerformanceSection";
import PlanResourceUsageSection from "./_sections/PlanResourceUsageSection";
import TipsSection from "./_sections/TipsSection";
import ProjectListSection from "./_sections/ProjectListSection";
import ShortcutSection from "./_sections/ShortcutSection";
import VerifyEmailBanner from "./_sections/VerifyEmailBanner";
import AdminHeaderSection from "@/Layouts/AdminHeaderSection";
import MonthlyRecurringRevenueSection from "./_sections/MonthlyRecurringRevenueSection";
import HostCardSection from "./_sections/HostCardSection";
import DashboardMetricsSection from "./_sections/DashboardMetricsSection";
import VPSLoadChartSection from "./_sections/VPSLoadChartSection";

export default function Page() {
    const { auth } = usePage().props;
    const isAdministrator = Boolean(auth?.user?.roles?.includes("admin"));

    if (isAdministrator) {
        return (
            <div className="space-y-2">
                <AdminHeaderSection href="/users" />
            
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
                    <div className="lg:col-span-2 flex h-full">
                        <MonthlyRecurringRevenueSection />
                    </div>

                    <div className="lg:col-span-1 flex h-full">
                        <HostCardSection />
                    </div>
                </div>

                <DashboardMetricsSection />
                <VPSLoadChartSection />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <VerifyEmailBanner />
            {/* <HeaderSection /> */}
            <ShortcutSection />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ProjectListSection />

                <div className="flex flex-col gap-6">
                    <PerformanceSection />
                    <PlanResourceUsageSection />
                </div>
            </div>

            <TipsSection />
        </div>
    );
}

Page.layout = (page) => {
    const user = page.props.auth?.user;
    const isAdmin = Boolean(user?.roles?.includes("admin"));

    return (
        <MainLayout
            title="Dashboard"
            subtitle={
                isAdmin
                    ? user?.name
                    : `${user?.name ?? "Account"} · ${
                          user?.plan ? `${user.plan.name} plan` : "No plan yet"
                      }`
            }
        >
            {page}
        </MainLayout>
    );
};

import React, { useState } from "react";
import { usePage } from "@inertiajs/react";
import MainLayout from "@/components/layout/MainLayout";
import HostPlanHeaderSection from "@/pages/hosting-plan/_sections/HostPlanHeaderSection";
import HostPlanTableSection from "@/pages/hosting-plan/_sections/HostPlanTableSection";
import AdminHeaderSection from "@/Layouts/AdminHeaderSection";
import CreatePlanSection from "@/pages/hosting-plan/_sections/CreatePlanSection";
import CardSection from "@/pages/user-management/CardSection";

export default function Page({ plans = [] }) {
    const [createPlanOpen, setCreatePlanOpen] = useState(false);
    const { auth } = usePage().props;
    const isAdministrator = Boolean(auth?.user?.roles?.includes("admin"));

    if (isAdministrator) {
        return (
            <div className="space-y-4">
                <AdminHeaderSection href="/admin/user-management" onAction={() => setCreatePlanOpen(true)} />
              <CardSection />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <HostPlanHeaderSection />
        </div>
    );
}

Page.layout = (page) => {
    const user = page.props.auth?.user;
    const isAdmin = Boolean(user?.roles?.includes("admin"));

    return (
        <MainLayout
            title={isAdmin ? "Dashboard" : "Hosting Plan"}
            subtitle={
                isAdmin ? user?.name : "Compare and switch your hosting plan"
            }
        >
            {page}
        </MainLayout>
    );
};

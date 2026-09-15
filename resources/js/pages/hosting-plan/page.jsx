import React, { useState } from "react";
import { usePage } from "@inertiajs/react";
import MainLayout from "@/components/layout/MainLayout";
import HostPlanHeaderSection from "./_sections/HostPlanHeaderSection";
import HostPlanTableSection from "./_sections/HostPlanTableSection";
import AdminHeaderSection from "@/Layouts/AdminHeaderSection";
import CreatePlanSection from "./_sections/CreatePlanSection";
import HostPlanCardSection from "./_sections/HostPlanCardSection";

export default function Page({ plans = [] }) {
    const [createPlanOpen, setCreatePlanOpen] = useState(false);
    const { auth } = usePage().props;
    const isAdministrator = Boolean(auth?.user?.roles?.includes("admin"));

    if (isAdministrator) {
        return (
            <div className="space-y-4">
                <AdminHeaderSection href="/hosting" onAction={() => setCreatePlanOpen(true)} />
                <HostPlanTableSection plans={plans} />

                <CreatePlanSection
                    open={createPlanOpen}
                    onCancel={() => setCreatePlanOpen(false)}
                    onCreate={() => setCreatePlanOpen(false)}
                />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <HostPlanHeaderSection />
            <HostPlanCardSection
                plans={plans}
            />
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

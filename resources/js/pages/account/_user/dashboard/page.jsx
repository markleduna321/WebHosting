import React from "react";
import Layout from "../../layout";
import HeaderSection from "./sections/header-section";
import EssentialSection from "./sections/essential-section";
import PerformanceSection from "./sections/performance-section";
import PlanResourceUsageSection from "./sections/plan-resource-usage-section";
import TipsSection from "./sections/tips-section";

export default function Page() {
    return (
        <Layout
            title="Dashboard"
            subtitle="Maria Clara Santos · Student Pro plan"
        >
            <div className="space-y-6">
                <HeaderSection />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <EssentialSection />

                    <div className="flex flex-col gap-6">
                        <PerformanceSection />
                        <PlanResourceUsageSection />
                    </div>
                </div>

                <TipsSection />
            </div>
        </Layout>
    );
}
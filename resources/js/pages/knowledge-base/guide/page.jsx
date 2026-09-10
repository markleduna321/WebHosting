import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import GuideHeaderSection from "./sections/guide-header-section";
import GuideStepsSection from "./sections/guide-steps-section";
import GuideFeedbackSection from "./sections/guide-feedback-section";

export default function GuidePage({ guide, onBack }) {
    return (
        <div className="space-y-6">
            <GuideHeaderSection guide={guide} onBack={onBack} />
            <GuideStepsSection steps={guide.steps} />
            <GuideFeedbackSection />
        </div>
    );
}

GuidePage.layout = (page) => (
    <MainLayout title="Knowledge Base" subtitle="Guides and documentation">
        {page}
    </MainLayout>
);

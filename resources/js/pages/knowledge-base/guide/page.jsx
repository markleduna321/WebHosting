import React from "react";
import Layout from "../../layout";
import GuideHeaderSection from "./sections/guide-header-section";
import GuideStepsSection from "./sections/guide-steps-section";
import GuideFeedbackSection from "./sections/guide-feedback-section";

export default function GuidePage({ guide, onBack }) {
    return (
        <Layout title="Knowledge Base" subtitle="Guides and documentation">
            <div className="space-y-6">
                <GuideHeaderSection guide={guide} onBack={onBack} />
                <GuideStepsSection steps={guide.steps} />
                <GuideFeedbackSection />
            </div>
        </Layout>
    );
}

import React, { useState } from "react";
import Layout from "../layout";
import HeroSection from "./sections/hero-section";
import FeaturedGuideSection from "./sections/featured-guide-section";
import GuidesSection from "./sections/guides-section";
import GuideHeaderSection from "./guide/sections/guide-header-section";
import GuideStepsSection from "./guide/sections/guide-steps-section";
import GuideFeedbackCard from "../../_components/guide-feedback-card";

export default function Page() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedGuide, setSelectedGuide] = useState(null);

    if (selectedGuide) {
        return (
            <Layout title="Knowledge Base" subtitle="Guides and documentation">
                <div className="space-y-6">
                    <GuideHeaderSection
                        guide={selectedGuide}
                        onBack={() => setSelectedGuide(null)}
                    />
                    <GuideStepsSection steps={selectedGuide.steps} />
                    <GuideFeedbackCard />
                </div>
            </Layout>
        );
    }

    return (
        <Layout title="Knowledge Base" subtitle="Guides and documentation">
            <div className="space-y-6">
                <HeroSection onSearch={setSearchQuery} />
                <FeaturedGuideSection onSelectGuide={setSelectedGuide} />
                <GuidesSection
                    searchQuery={searchQuery}
                    onSelectGuide={setSelectedGuide}
                />
            </div>
        </Layout>
    );
}

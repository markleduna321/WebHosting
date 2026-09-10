import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import HeroSection from "./sections/hero-section";
import FeaturedGuideSection from "./sections/featured-guide-section";
import GuidesSection from "./sections/guides-section";
import GuideHeaderSection from "./guide/sections/guide-header-section";
import GuideStepsSection from "./guide/sections/guide-steps-section";
import GuideFeedbackCard from "@/components/ui/GuideFeedbackCard";

export default function Page() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedGuide, setSelectedGuide] = useState(null);

    if (selectedGuide) {
        return (
            <div className="space-y-6">
                <GuideHeaderSection
                    guide={selectedGuide}
                    onBack={() => setSelectedGuide(null)}
                />
                <GuideStepsSection steps={selectedGuide.steps} />
                <GuideFeedbackCard />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <HeroSection onSearch={setSearchQuery} />
            <FeaturedGuideSection onSelectGuide={setSelectedGuide} />
            <GuidesSection
                searchQuery={searchQuery}
                onSelectGuide={setSelectedGuide}
            />
        </div>
    );
}

Page.layout = (page) => (
    <MainLayout title="Knowledge Base" subtitle="Guides and documentation">
        {page}
    </MainLayout>
);

import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import HostPlanHeaderSection from "./_sections/HostPlanHeaderSection";
import HostPlanCardSection from "./_sections/HostPlanCardSection";

export default function Page() {
  return (
    <div className="space-y-6">
      <HostPlanHeaderSection />
      <HostPlanCardSection />
    </div>
  );
}

Page.layout = (page) => (
  <MainLayout title="Hosting Plan" subtitle="Compare and switch your hosting plan">
    {page}
  </MainLayout>
);

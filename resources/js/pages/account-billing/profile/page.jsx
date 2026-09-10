import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import AccountBillingLayout from "@/components/layout/AccountBillingLayout";
import ProfileFormSection from "./sections/profile-form-section";
import StudentVerificationSection from "./sections/student-verification-section";
import SecuritySection from "./sections/security-section";

export default function Page() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Left: profile form — takes 2/3 */}
            <div className="lg:col-span-2">
                <ProfileFormSection />
            </div>

            {/* Right: verification + security stacked — takes 1/3 */}
            <div className="lg:col-span-1 flex flex-col gap-6">
                <StudentVerificationSection />
                <SecuritySection />
            </div>
        </div>
    );
}

Page.layout = (page) => (
    <MainLayout title="Profile">
        <AccountBillingLayout>{page}</AccountBillingLayout>
    </MainLayout>
);

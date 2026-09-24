import React, { useState } from "react";
import { usePage } from "@inertiajs/react";
import MainLayout from "@/components/layout/MainLayout";
import Tabs, { TabPanel } from "@/components/ui/Tabs";
import { Receipt, CreditCard, Gift, User } from "lucide-react";
import SubscriptionHeaderSection from "./_sections/SubscriptionHeaderSection";
import SubscriptionInvoiceHistorySection from "./_sections/SubscriptionInvoiceHistorySection";
import InvoiceSection from "./_sections/InvoiceSection";
import PaymentMethodTableSection from "./_sections/PaymentMethodTableSection";
import PaymentMethodCardSection from "./_sections/PaymentMethodCardSection";
import ReferralHeaderSection from "./_sections/ReferralHeaderSection";
import ReferralTableSection from "./_sections/ReferralTableSection";
import ProfileFormSection from "./_sections/ProfileFormSection";
import ProfileStudentVerificationSection from "./_sections/ProfileStudentVerificationSection";
import ProfileSecuritySection from "./_sections/ProfileSecuritySection";

const TABS = [
    { id: "subscription", label: "Subscription & invoices", icon: <Receipt size={16} /> },
    //{ id: "payment-methods", label: "Payment methods", icon: <CreditCard size={16} /> },
    // { id: "referrals", label: "Referrals", icon: <Gift size={16} /> },
    { id: "profile", label: "Profile", icon: <User size={16} /> },
];

export default function Page() {
    const { tab } = usePage().props;
    const defaultTabId = TABS.some((t) => t.id === tab) ? tab : "subscription";
    const [selectedInvoice, setSelectedInvoice] = useState(null);

    return (
        <Tabs tabs={TABS} defaultTabId={defaultTabId}>
            <TabPanel id="subscription">
                {selectedInvoice ? (
                    <div className="space-y-4">
                        <button
                            type="button"
                            onClick={() => setSelectedInvoice(null)}
                            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                        >
                            ← Back to invoice history
                        </button>
                        <InvoiceSection invoice={selectedInvoice} />
                    </div>
                ) : (
                    <div className="space-y-6">
                        <SubscriptionHeaderSection />
                        <SubscriptionInvoiceHistorySection onSelectInvoice={setSelectedInvoice} />
                    </div>
                )}
            </TabPanel>

            <TabPanel id="payment-methods">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-1 items-start">
                    <div className="lg:col-span-2">
                        <PaymentMethodTableSection />
                    </div>
                    <div className="lg:col-span-1">
                        <PaymentMethodCardSection />
                    </div>
                </div>
            </TabPanel>

            <TabPanel id="referrals">
                <div className="space-y-4">
                    <ReferralHeaderSection />
                    <ReferralTableSection />
                </div>
            </TabPanel>

            <TabPanel id="profile">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    <div className="lg:col-span-2">
                        <ProfileFormSection />
                    </div>
                    <div className="lg:col-span-1 flex flex-col gap-6">
                        <ProfileStudentVerificationSection />
                        <ProfileSecuritySection />
                    </div>
                </div>
            </TabPanel>
        </Tabs>
    );
}

Page.layout = (page) => <MainLayout title="Account & Billing">{page}</MainLayout>;

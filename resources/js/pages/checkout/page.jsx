import React, { useState } from "react";
import { Link } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import PlanSummarySection from "./_sections/PlanSummarySection";
import InvoicePreviewSection from "./_sections/InvoicePreviewSection";
import QrPaymentSection from "./_sections/QrPaymentSection";

export default function Page({ plan, cycle: initialCycle = "monthly" }) {
    const [cycle, setCycle] = useState(initialCycle);
    const [payment, setPayment] = useState(null);

    return (
        <div className="space-y-6">
            <Link
                href="/hosting"
                className="inline-flex items-center gap-1 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 focus:outline-none focus-visible:underline"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to plans
            </Link>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
                <div className="lg:col-span-3">
                    <PlanSummarySection plan={plan} />
                </div>

                <div className="lg:col-span-2">
                    {payment ? (
                        <QrPaymentSection
                            payment={payment}
                            onRestart={() => setPayment(null)}
                        />
                    ) : (
                        <InvoicePreviewSection
                            plan={plan}
                            cycle={cycle}
                            onCycleChange={setCycle}
                            onCreated={setPayment}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

Page.layout = (page) => (
    <MainLayout title="Checkout" subtitle="Confirm your plan and pay">
        {page}
    </MainLayout>
);

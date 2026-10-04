import React, { useState } from "react";
import { Link, Head } from "@inertiajs/react";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import PlanSummarySection from "./_sections/PlanSummarySection";
import InvoicePreviewSection from "./_sections/InvoicePreviewSection";
import QrPaymentSection from "./_sections/QrPaymentSection";

export default function Page({
    plan,
    cycle: initialCycle = "monthly",
    initialAddons = [],
    availableAddons = [],
    paymentMethods = [],
}) {
    const [cycle, setCycle] = useState(initialCycle);
    const [addons, setAddons] = useState(initialAddons);
    const [payment, setPayment] = useState(null);

    return (
        <div className="min-h-screen w-full bg-white font-sans antialiased">
            <Head title="Checkout" />

            <header className="sticky top-0 z-30 border-b border-gray-100 bg-white/90 backdrop-blur-sm">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <Link href="/" className="flex items-center">
                        <img
                            src="/images/caleho.png"
                            alt="CALEHO Host"
                            className="block h-auto w-[125px] object-contain sm:w-[135px] lg:w-[140px]"
                        />
                    </Link>
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500">
                        <ShieldCheck className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                        Secure checkout
                    </span>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-10 lg:px-8 lg:py-12">
                <Link
                    href="/hosting"
                    className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900 focus:outline-none focus-visible:underline"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to plans
                </Link>

                <div className="mt-4 mb-8">
                    <h1 className="text-2xl font-bold text-slate-900">
                        Complete your payment
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Confirm your plan and payment details. Your plan is activated once payment is confirmed.
                    </p>
                </div>

                <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
                    <div className="min-w-0 flex-1">
                        <PlanSummarySection plan={plan} />
                    </div>

                    <div className="w-full lg:w-[420px] lg:shrink-0">
                        <div className="lg:sticky lg:top-24">
                            {payment ? (
                                <QrPaymentSection
                                    payment={payment}
                                    onRestart={() => setPayment(null)}
                                />
                            ) : (
                                <InvoicePreviewSection
                                    plan={plan}
                                    cycle={cycle}
                                    addons={addons}
                                    availableAddons={availableAddons}
                                    paymentMethods={paymentMethods}
                                    onCycleChange={setCycle}
                                    onCreated={setPayment}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

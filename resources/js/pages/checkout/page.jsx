import React, { useState } from "react";
import { Link, Head } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react";
import PlanSummarySection from "./_sections/PlanSummarySection";
import InvoicePreviewSection from "./_sections/InvoicePreviewSection";
import QrPaymentSection from "./_sections/QrPaymentSection";

export default function Page({ plan, cycle: initialCycle = "monthly", initialAddons = [], availableAddons = [] }) {
    const [cycle, setCycle] = useState(initialCycle);
    const [addons, setAddons] = useState(initialAddons);
    const [payment, setPayment] = useState(null);

    return (
        <div className="min-h-screen w-full bg-slate-50 font-sans antialiased">
            <Head title="Checkout" />
            
            <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-sm">
                <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
                    <Link href="/" className="flex items-center gap-2">
                        <img
                            src="/images/logo 3.png"
                            alt="CALEHO Host Logo"
                            className="h-9 w-9 object-contain"
                        />
                        <span className="text-lg font-black tracking-tight">
                            <span className="bg-gradient-to-r from-blue-500 via-sky-500 to-cyan-500 bg-clip-text text-transparent">
                                CALEHO
                            </span>{" "}
                            <span className="text-blue-600">HOST</span>
                        </span>
                    </Link>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
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
                                    addons={addons}
                                    availableAddons={availableAddons}
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

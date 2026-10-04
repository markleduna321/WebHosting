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
        <div className="relative min-h-screen w-full overflow-hidden bg-slate-950 font-sans antialiased">
            <Head title="Checkout" />

            <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
                <div className="absolute -left-32 top-24 h-96 w-96 rounded-full bg-blue-600/15 blur-3xl" />
                <div className="absolute -right-32 top-[30rem] h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
            </div>

            <header className="sticky top-0 z-30 border-b border-white/[0.08] bg-slate-950/80 backdrop-blur-xl">
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
                            <span className="text-blue-400">HOST</span>
                        </span>
                    </Link>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-slate-300">
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                        Secure checkout
                    </span>
                </div>
            </header>

            <main className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-10 lg:px-8 lg:py-12">
                <div className="space-y-7">
                    <Link
                        href="/hosting"
                        className="inline-flex items-center gap-1 text-sm font-medium text-slate-400 transition-colors hover:text-white focus:outline-none focus-visible:underline"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to plans
                    </Link>

                    <div className="max-w-2xl">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">
                            Checkout
                        </p>
                        <h1 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
                            Complete your payment
                        </h1>
                        <p className="mt-2 text-sm leading-relaxed text-slate-400 sm:text-base">
                            Confirm your hosting plan and payment details. Your account is activated when your payment is confirmed.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-5">
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

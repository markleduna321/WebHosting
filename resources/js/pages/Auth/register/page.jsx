import { Head, usePage } from "@inertiajs/react";
import { CheckCircle } from "lucide-react";
import React, { useState } from "react";
import PlanDetailsSection from "./_sections/PlanDetailsSection";
import CheckoutSummarySection from "./_sections/CheckoutSummarySection";
import CreateAccountSection from "./_sections/CreateAccountSection";

function GenericBrandingPanel() {
    return (
        <div className="hidden lg:flex lg:w-3/5 flex-col justify-between bg-[#0B0F19] bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] p-12 text-white relative">
            <div className="flex items-center gap-2">
                <img
                    src="/images/asura-logo.png"
                    alt="AsuraTechHost Logo"
                    className="w-9 h-9 object-contain"
                />

                <span className="text-xl font-bold tracking-wide">
                    Asura<span className="text-blue-500">Host</span>
                </span>
            </div>

            <div className="max-w-xl space-y-6 my-auto">
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl leading-tight">
                    Hosting that keeps up with your semester.
                </h1>

                <ul className="space-y-3 text-slate-300 text-sm">
                    <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>
                            Free SSL and an asuratechhost.app subdomain on every
                            plan
                        </span>
                    </li>
                    <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>
                            Deploy from Git or upload files — no server setup
                        </span>
                    </li>
                    <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>
                            Verified student pricing starting at ₱49/month
                        </span>
                    </li>
                </ul>
            </div>

            {/* Footer Copyright */}
            <div className="text-xs text-slate-500">
                © 2026 AsuraTech Host. All rights reserved.
            </div>
        </div>
    );
}

export default function Page() {
    const { plan } = usePage().props;
    const [step, setStep] = useState("checkout");
    const hasPlan = Boolean(plan);

    return (
        <div className="flex min-h-screen w-full font-sans antialiased">
            <Head title="Register" />

            {hasPlan ? (
                <PlanDetailsSection plan={plan} />
            ) : (
                <GenericBrandingPanel />
            )}

            <div className="flex w-full lg:w-2/5 flex-col justify-center bg-white px-6 py-12 sm:px-12 lg:px-16">
                {hasPlan && step === "checkout" ? (
                    <CheckoutSummarySection
                        onProceed={() => setStep("create-account")}
                    />
                ) : (
                    <CreateAccountSection />
                )}
            </div>
        </div>
    );
}

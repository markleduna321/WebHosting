import { Head, usePage } from "@inertiajs/react";
import { CheckCircle } from "lucide-react";
import React, { useCallback, useState } from "react";
import PlanDetailsSection from "./_sections/PlanDetailsSection";
import CheckoutSummarySection from "./_sections/CheckoutSummarySection";
import CreateAccountSection from "./_sections/CreateAccountSection";
import { PLANS, getPlanByName } from "../../../data/hostingPlans";

function GenericBrandingPanel() {
    return (
        <div className="hidden lg:flex lg:h-screen lg:w-1/2 lg:overflow-y-auto flex-col justify-between bg-[#0B0F19] bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] p-12 text-white relative">
            <div className="flex items-center gap-1">
                <img
                    src="/images/logo 3.png"
                    alt="CALEHO Host Logo"
                    className="w-11 h-11 object-contain"
                />
                <span className="text-xl font-bold tracking-wide">
                    <span className="bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-400 bg-clip-text text-transparent">
                        CALEHO
                    </span>{" "}
                    <span className="text-blue-500">HOST</span>
                </span>
            </div>
            <div className="max-w-xl space-y-10 my-auto">
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl leading-tight">
                    Hosting that keeps up with your semester.
                </h1>

                <ul className="space-y-6 text-slate-300 text-sm">
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
                © 2026 CALEHO Host. All rights reserved.
            </div>
        </div>
    );
}

export default function Page() {
    const { plan: planName } = usePage().props;
    const [step, setStep] = useState("checkout");
    const [selectedAddOnIds, setSelectedAddOnIds] = useState([]);
    const hasPlan = Boolean(planName);
    const plan = hasPlan
        ? getPlanByName(planName) ?? PLANS.find((p) => p.popular) ?? PLANS[0]
        : null;

    const toggleAddOn = useCallback((id) => {
        setSelectedAddOnIds((prev) =>
            prev.includes(id)
                ? prev.filter((addOnId) => addOnId !== id)
                : [...prev, id],
        );
    }, []);

    const isCheckoutStep = hasPlan && step === "checkout";

    return (
        <div className="flex min-h-screen w-full font-sans antialiased lg:h-screen lg:overflow-hidden">
            <Head title="Register" />

            {hasPlan ? (
                <PlanDetailsSection
                    plan={plan}
                    selectedAddOnIds={selectedAddOnIds}
                    onToggleAddOn={toggleAddOn}
                />
            ) : (
                <GenericBrandingPanel />
            )}

            <div
                className={`flex w-full flex-col px-6 py-12 sm:px-12 lg:h-screen lg:w-1/2 lg:overflow-y-auto lg:px-10 ${
                    isCheckoutStep
                        ? "bg-[#0B0F19] bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]"
                        : "bg-white"
                }`}
            >
                <div className="m-auto w-full">
                    {isCheckoutStep ? (
                        <CheckoutSummarySection
                            plan={plan}
                            selectedAddOnIds={selectedAddOnIds}
                            onToggleAddOn={toggleAddOn}
                            onProceed={() => setStep("create-account")}
                        />
                    ) : (
                        <CreateAccountSection />
                    )}
                </div>
            </div>
        </div>
    );
}

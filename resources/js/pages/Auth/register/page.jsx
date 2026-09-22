import { Head, Link, usePage } from "@inertiajs/react";
import React, { useCallback, useState } from "react";
import PlanDetailsSection from "./_sections/PlanDetailsSection";
import CheckoutSummarySection from "./_sections/CheckoutSummarySection";
import CreateAccountSection from "./_sections/CreateAccountSection";

export default function Page() {
    const { plan: planName, plans = [], availableAddons = [] } = usePage().props;
    const [step, setStep] = useState("checkout");
    const [selectedAddOnIds, setSelectedAddOnIds] = useState([]);
    const [period, setPeriod] = useState(1);
    const hasPlan = Boolean(planName);
    
    // Find the requested plan in the DB plans array, fallback to a popular plan, then the first plan.
    const plan = hasPlan
        ? (plans.find(p => p.name === planName) ?? plans.find((p) => p.popular) ?? plans[0])
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
        <div className="min-h-screen w-full bg-white font-sans antialiased">
            <Head title="Register" />

            {/* ── Top Navbar ── */}
            <header className="sticky top-0 z-30 border-b border-gray-100 bg-white/90 backdrop-blur-sm">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <Link
                        href="/"
                        className="flex items-center space-x-2.5 cursor-pointer"
                    >
                        <a
                            href="https://www.caleho.cloud/"
                            className="flex items-center space-x-2.5 cursor-pointer"
                            draggable="true"
                        >
                            <img
                                src="/images/caleho.png"
                                alt="CALEHO Host"
                                draggable="true"
                                className="
                                w-[125px]
                                sm:w-[135px]
                                lg:w-[140px]
                                h-auto
                                object-contain
                                block
                                transition-transform
                                duration-200
                                group-hover:scale-[1.02]
                            "
                            />
                        </a>
                    </Link>

                    <Link
                        href="/login"
                        className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
                    >
                        Already have an account?{" "}
                        <span className="font-semibold text-blue-600">
                            Log in
                        </span>
                    </Link>
                </div>
            </header>

            {/* ── Page Content ── */}
            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
                {isCheckoutStep ? (
                    <>
                        {/* "Your cart" heading */}
                        <h1 className="text-2xl font-bold text-slate-900 mb-8">
                            Your cart
                        </h1>

                        {/* Two-column: cart left, summary right */}
                        <div className="flex flex-col lg:flex-row lg:items-start gap-8">
                            {/* Left column — plan + add-ons */}
                            <div className="flex-1 min-w-0">
                                <PlanDetailsSection
                                    plan={plan}
                                    availableAddons={availableAddons}
                                    selectedAddOnIds={selectedAddOnIds}
                                    onToggleAddOn={toggleAddOn}
                                    period={period}
                                    onPeriodChange={setPeriod}
                                />
                            </div>

                            {/* Right column — order summary (sticky) */}
                            <div className="w-full lg:w-[380px] lg:shrink-0">
                                <div className="lg:sticky lg:top-24">
                                    <CheckoutSummarySection
                                        plan={plan}
                                        availableAddons={availableAddons}
                                        selectedAddOnIds={selectedAddOnIds}
                                        onToggleAddOn={toggleAddOn}
                                        onProceed={() =>
                                            setStep("create-account")
                                        }
                                        period={period}
                                    />
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="mx-auto max-w-xl py-4">
                        <CreateAccountSection
                            plan={plan}
                            period={period}
                            selectedAddOnIds={selectedAddOnIds}
                        />
                    </div>
                )}
            </main>
        </div>
    );
}

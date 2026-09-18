import { Check, CheckCircle, Plus } from "lucide-react";
import React from "react";
import { ADD_ONS, formatCurrency } from "../../../../data/hostingPlans";

export default function PlanDetailsSection({
    plan,
    selectedAddOnIds = [],
    onToggleAddOn,
}) {
    return (
        <div className="hidden lg:flex lg:w-2/3 flex-col justify-between bg-[#0B0F19] bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] p-12 lg:p-16 text-white relative">
            {/* Header / Logo */}
            <div className="flex items-center gap-3">
                <img
                    src="/images/asura-logo.png"
                    alt="AsuraTechHost Logo"
                    className="w-11 h-11 object-contain"
                />
                <span className="text-2xl font-bold tracking-wide">
                    Asura<span className="text-blue-500">Host</span>
                </span>
            </div>

            {/* Main Content Area */}
            <div className="max-w-2xl space-y-4 my-auto">
                <div className="flex items-center gap-4">
                    <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl leading-none">
                        {plan.name}
                    </h1>
                    {plan.popular && (
                        <span className="rounded-full bg-blue-600 px-4 py-1.5 text-sm font-semibold shrink-0">
                            Most Popular
                        </span>
                    )}
                </div>

                <p className="text-slate-300 text-lg leading-relaxed">{plan.subtitle}</p>

                <div>
                    <span className="text-5xl font-extrabold">
                        {plan.price}
                    </span>
                    {plan.billingNote && (
                        <span className="ml-2 text-base font-medium text-slate-400">
                            {plan.billingNote}
                        </span>
                    )}
                </div>

                {/* Plan Features */}
                <ul className="space-y-2 text-slate-200 text-base">
                    {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                            <span className="font-medium">{feature}</span>
                        </li>
                    ))}
                </ul>

                {/* Interactive Add-ons Section */}
                <div className="border-t border-white/10 pt-8">
                    <h3 className="text-base font-bold text-slate-200 uppercase tracking-wider mb-4">
                        Add-ons available
                    </h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-base">
                        {ADD_ONS.map((addOn) => {
                            const isSelected = selectedAddOnIds.includes(
                                addOn.id,
                            );
                            return (
                                <li key={addOn.id}>
                                    <button
                                        type="button"
                                        onClick={() => onToggleAddOn?.(addOn.id)}
                                        aria-pressed={isSelected}
                                        className={`flex w-full items-center justify-between gap-3 p-3.5 rounded-xl border text-left transition-all duration-200 ${
                                            isSelected
                                                ? "bg-blue-600/15 border-blue-500 text-white shadow-lg shadow-blue-500/10"
                                                : "bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-600 hover:bg-slate-800/80 hover:text-white"
                                        }`}
                                    >
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            {isSelected ? (
                                                <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                                            ) : (
                                                <Plus className="w-5 h-5 text-blue-400 shrink-0" />
                                            )}
                                            <span className="font-semibold text-sm sm:text-base truncate">
                                                {addOn.label}
                                            </span>
                                        </div>
                                        <span className="text-xs sm:text-sm font-medium text-slate-400 shrink-0">
                                            {formatCurrency(addOn.price)}/{addOn.period}
                                        </span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>

            {/* Footer */}
            <div className="text-sm text-slate-500">
                © 2026 AsuraTech Host. All rights reserved.
            </div>
        </div>
    );
}
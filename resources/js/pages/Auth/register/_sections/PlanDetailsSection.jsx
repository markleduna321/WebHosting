import { Check, CheckCircle, Plus } from "lucide-react";
import React from "react";
import { ADD_ONS, formatCurrency } from "../../../../data/hostingPlans";

export default function PlanDetailsSection({
    plan,
    selectedAddOnIds = [],
    onToggleAddOn,
}) {
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

            <div className="max-w-xl space-y-5 my-auto">
                <div className="flex items-center gap-3">
                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl leading-tight">
                        {plan.name}
                    </h1>
                    {plan.popular && (
                        <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold shrink-0">
                            Most Popular
                        </span>
                    )}
                </div>

                <p className="text-slate-300 text-sm">{plan.subtitle}</p>

                <div>
                    <span className="text-4xl font-extrabold">
                        {plan.price}
                    </span>
                    {plan.billingNote && (
                        <span className="ml-1 text-sm font-medium text-slate-400">
                            {plan.billingNote}
                        </span>
                    )}
                </div>

                <ul className="space-y-3 text-slate-300 text-sm">
                    {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{feature}</span>
                        </li>
                    ))}
                </ul>

                <div className="border-t border-white/10 pt-6">
                    <h3 className="text-sm font-bold text-white mb-3">
                        Add-ons available
                    </h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
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
                                        className="flex w-full items-start gap-2 text-left rounded-md transition-colors hover:text-white"
                                    >
                                        {isSelected ? (
                                            <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                        ) : (
                                            <Plus className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                        )}
                                        <span
                                            className={
                                                isSelected
                                                    ? "text-white"
                                                    : "text-slate-300"
                                            }
                                        >
                                            {addOn.label}
                                            <span className="text-slate-500">
                                                {" "}
                                                — {formatCurrency(addOn.price)}/
                                                {addOn.period}
                                            </span>
                                        </span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>

            <div className="text-xs text-slate-500">
                © 2026 AsuraTech Host. All rights reserved.
            </div>
        </div>
    );
}

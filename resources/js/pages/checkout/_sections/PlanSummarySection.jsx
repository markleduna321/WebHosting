import React from "react";
import { CheckCircle2, Server, Sparkles } from "lucide-react";

export default function PlanSummarySection({ plan }) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-600">
                    <Server className="h-5 w-5" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                    <p className="text-xs text-slate-400">You are subscribing to</p>
                    <div className="mt-0.5 flex flex-wrap items-center gap-2">
                        <h2 className="text-base font-bold text-blue-600">
                            {plan.name} plan
                        </h2>
                        {plan.popular && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-2.5 py-0.5 text-[11px] font-bold text-white shadow-sm">
                                <Sparkles className="h-3 w-3" aria-hidden="true" />
                                Popular
                            </span>
                        )}
                    </div>
                    {plan.subtitle && (
                        <p className="mt-0.5 text-sm text-slate-500">{plan.subtitle}</p>
                    )}
                </div>
            </div>

            {plan.features?.length > 0 && (
                <div className="mt-5 border-t border-gray-100 pt-5">
                    <p className="text-xs font-semibold text-slate-700">
                        What&apos;s included
                    </p>
                    <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {plan.features.map((feature) => (
                            <li
                                key={feature}
                                className="flex items-center gap-2 text-sm text-slate-600"
                            >
                                <CheckCircle2
                                    className="h-4 w-4 shrink-0 text-emerald-500"
                                    aria-hidden="true"
                                />
                                <span>{feature}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
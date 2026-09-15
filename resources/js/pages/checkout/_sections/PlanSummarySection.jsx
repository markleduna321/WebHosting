import React from "react";
import { CheckCircle2, Sparkles } from "lucide-react";

export default function PlanSummarySection({ plan }) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white px-6 py-5">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-xs text-slate-400 mb-0.5">
                        You are subscribing to
                    </p>
                    <h2 className="text-xl font-bold text-slate-900">
                        {plan.name}
                    </h2>
                    {plan.subtitle && (
                        <p className="mt-1 text-sm text-slate-500">
                            {plan.subtitle}
                        </p>
                    )}
                </div>

                {plan.is_popular && (
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                        <Sparkles className="h-3 w-3" />
                        Popular
                    </span>
                )}
            </div>

            <div className="my-5 border-t border-gray-100" />

            <p className="text-xs font-semibold text-slate-700">
                What&apos;s included
            </p>

            <ul className="mt-3 grid grid-cols-1 gap-x-6 gap-y-2.5 sm:grid-cols-2">
                {plan.features.map((feature) => (
                    <li
                        key={feature}
                        className="flex items-start gap-2 text-sm text-slate-600"
                    >
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

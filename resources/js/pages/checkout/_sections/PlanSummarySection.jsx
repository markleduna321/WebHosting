import React from "react";
import { CheckCircle2, Sparkles } from "lucide-react";

export default function PlanSummarySection({ plan }) {
    return (
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_24px_60px_rgba(0,0,0,0.24)] backdrop-blur-xl sm:p-7">
            <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-blue-500/10 blur-3xl" />
            <div className="relative">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <p className="mb-0.5 text-xs text-slate-400">
                            You are subscribing to
                        </p>
                        <h2 className="text-2xl font-bold tracking-tight text-white">
                            {plan.name}
                        </h2>
                        {plan.subtitle && (
                            <p className="mt-1 text-sm text-slate-400">
                                {plan.subtitle}
                            </p>
                        )}
                    </div>

                    {plan.popular && (
                        <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-amber-400/20 bg-amber-400/10 px-2.5 py-1 text-xs font-semibold text-amber-300">
                            <Sparkles className="h-3 w-3" aria-hidden="true" />
                            Popular
                        </span>
                    )}
                </div>

                <div className="my-5 h-px bg-gradient-to-r from-white/15 via-white/5 to-transparent" />

                <p className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                    What&apos;s included
                </p>

                <ul className="mt-3 grid grid-cols-1 gap-x-6 gap-y-2.5 sm:grid-cols-2">
                    {plan.features.map((feature) => (
                        <li
                            key={feature}
                            className="flex items-start gap-2 text-sm text-slate-300"
                        >
                            <CheckCircle2
                                className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400"
                                aria-hidden="true"
                            />
                            <span>{feature}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

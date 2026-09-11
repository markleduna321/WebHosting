import React from "react";

/**
 * Each step can have:
 *  - title: string
 *  - description: string | ReactNode
 *  - code: string  (optional — renders a dark code block)
 *  - tips: string[] (optional — renders a "Good to know" bullet list)
 */
export default function GuideStepsSection({ steps }) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white px-8 py-7 space-y-8">
            {steps.map((step, index) => (
                <div key={index} className="flex items-start gap-4">
                    {/* Step number badge */}
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white mt-0.5">
                        {index + 1}
                    </span>

                    {/* Step content */}
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-slate-900">
                            {step.title}
                        </p>
                        <p className="mt-1 text-sm text-slate-500 leading-relaxed">
                            {step.description}
                        </p>

                        {/* Code block */}
                        {step.code && (
                            <pre className="mt-3 rounded-xl bg-slate-900 px-5 py-4 text-xs text-green-300 font-mono leading-relaxed overflow-x-auto whitespace-pre">
                                {step.code.trim()}
                            </pre>
                        )}

                        {/* Good to know tips */}
                        {step.tips && step.tips.length > 0 && (
                            <div className="mt-4 rounded-xl border border-gray-200 bg-slate-50 px-5 py-4">
                                <p className="text-xs font-semibold text-slate-700 mb-2">
                                    Good to know
                                </p>
                                <ul className="space-y-1.5">
                                    {step.tips.map((tip, i) => (
                                        <li
                                            key={i}
                                            className="flex items-start gap-2 text-xs text-slate-500"
                                        >
                                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                                            {tip}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

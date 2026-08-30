import React from "react";

function ScoreRing({ score = 99 }) {
    // Circular ring styled to resemble the multi-color speed-test badge.
    const radius = 26;
    const circumference = 2 * Math.PI * radius;
    return (
        <div className="relative w-16 h-16 shrink-0">
            <svg viewBox="0 0 64 64" className="w-16 h-16 -rotate-90">
                <circle
                    cx="32"
                    cy="32"
                    r={radius}
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="5"
                />
                <circle
                    cx="32"
                    cy="32"
                    r={radius}
                    fill="none"
                    stroke="#16a34a"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference * (1 - score / 100)}
                />
                <circle
                    cx="32"
                    cy="32"
                    r={radius}
                    fill="none"
                    stroke="#7c3aed"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference * (1 - 0.06)}
                    opacity="0.9"
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-green-600">
                    {score}
                </span>
            </div>
        </div>
    );
}

export default function PerformanceSection() {
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-slate-900">
                    Performance
                </h2>
                <button className="rounded-full border border-slate-200 px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">
                    Run speed test
                </button>
            </div>
            <div className="flex items-center">
                <div className="flex items-center gap-3 flex-1">
                    <ScoreRing score={99} />
                    <div>
                        <p className="text-sm font-semibold text-slate-900">
                            Desktop
                        </p>
                        <p className="text-xs text-slate-500">
                            Last scanned:
                        </p>
                        <p className="text-xs text-slate-500">
                            2026-05-25 13:28
                        </p>
                    </div>
                </div>
                <div className="w-px self-stretch bg-gray-100 mx-4" />
                <div className="flex items-center gap-3 flex-1">
                    <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-200 shrink-0" />
                    <div>
                        <p className="text-sm font-semibold text-slate-900">
                            Mobile
                        </p>
                        <p className="text-xs text-slate-500">
                            Not scanned yet
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

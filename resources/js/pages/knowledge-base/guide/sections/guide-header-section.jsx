import { ArrowLeft, Clock } from "lucide-react";
import React from "react";

export default function GuideHeaderSection({ guide, onBack }) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white px-8 py-7">
            {/* Back link */}
            <button
                onClick={onBack}
                className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors mb-5"
            >
                <ArrowLeft className="w-3.5 h-3.5" />
                All guides
            </button>

            {/* Meta row */}
            <div className="flex items-center gap-3 mb-3">
                <span className="inline-flex items-center rounded-md border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-600">
                    {guide.category}
                </span>
                <span className="flex items-center gap-1 text-xs text-slate-400">
                    <Clock className="w-3 h-3" />
                    {guide.read}
                </span>
                <span className="text-xs text-slate-400">
                    Updated {guide.updated}
                </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-slate-900 leading-snug">
                {guide.title}
            </h1>

            {/* Subtitle */}
            <p className="mt-2 text-sm text-slate-500 leading-relaxed max-w-lg">
                {guide.subtitle}
            </p>
        </div>
    );
}

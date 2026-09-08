import { ArrowRight, Sparkles } from "lucide-react";
import React from "react";
import { GUIDES } from "../data/guides-data.jsx";

const FEATURED = GUIDES.find((g) => g.id === 1);

export default function FeaturedGuideSection({ onSelectGuide }) {
    return (
        <div className="rounded-xl border border-blue-100 bg-blue-50 px-8 py-6">
            {/* Badge */}
            <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-500 uppercase tracking-wider mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                Most read guide
            </div>

            <h2 className="text-xl font-bold text-slate-900">
                {FEATURED.title}
            </h2>
            <p className="mt-2 text-sm text-slate-500 max-w-lg leading-relaxed">
                {FEATURED.description}
            </p>

            <button
                onClick={() => onSelectGuide?.(FEATURED)}
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
                Read the guide
                <ArrowRight className="w-4 h-4" />
            </button>
        </div>
    );
}

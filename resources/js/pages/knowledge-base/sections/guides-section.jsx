import { ArrowRight, Clock } from "lucide-react";
import React, { useState } from "react";
import { GUIDES } from "../data/guides-data.jsx";

const CATEGORY_COUNTS = GUIDES.reduce((acc, g) => {
    acc[g.category] = (acc[g.category] || 0) + 1;
    return acc;
}, {});

const CATEGORIES = [
    { label: "All",               count: GUIDES.length },
    { label: "Getting started",   count: CATEGORY_COUNTS["Getting started"]   || 0 },
    { label: "Git & deployments", count: CATEGORY_COUNTS["Git & deployments"] || 0 },
    { label: "Domains & SSL",     count: CATEGORY_COUNTS["Domains & SSL"]     || 0 },
    { label: "Databases",         count: CATEGORY_COUNTS["Databases"]         || 0 },
    { label: "Files & storage",   count: CATEGORY_COUNTS["Files & storage"]   || 0 },
    { label: "Billing",           count: CATEGORY_COUNTS["Billing"]           || 0 },
];

export default function GuidesSection({ searchQuery = "", onSelectGuide }) {
    const [activeCategory, setActiveCategory] = useState("All");

    const filtered = GUIDES.filter((g) => {
        const matchesCategory =
            activeCategory === "All" || g.category === activeCategory;
        const matchesSearch =
            !searchQuery ||
            g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            g.category.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-4">
                {/* Left: Category sidebar */}
                <div className="border-b lg:border-b-0 lg:border-r border-gray-100 px-4 py-5">
                    <ul className="space-y-0.5">
                        {CATEGORIES.map(({ label, count }) => {
                            const isActive = activeCategory === label;
                            return (
                                <li key={label}>
                                    <button
                                        onClick={() => setActiveCategory(label)}
                                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                                            isActive
                                                ? "text-blue-600 font-semibold bg-blue-50"
                                                : "text-slate-600 hover:bg-slate-50"
                                        }`}
                                    >
                                        <span>{label}</span>
                                        <span className={`text-xs ${isActive ? "text-blue-500" : "text-slate-400"}`}>
                                            {count}
                                        </span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                {/* Right: Guides list */}
                <div className="lg:col-span-3 divide-y divide-gray-100">
                    {/* Header */}
                    <div className="px-6 py-4">
                        <p className="text-sm font-semibold text-slate-700">
                            {activeCategory === "All" ? "All guides" : activeCategory}{" "}
                            <span className="text-slate-400 font-normal">
                                ({filtered.length})
                            </span>
                        </p>
                    </div>

                    {/* Rows */}
                    {filtered.length === 0 ? (
                        <div className="px-6 py-10 text-center text-sm text-slate-400">
                            No guides found.
                        </div>
                    ) : (
                        filtered.map((guide) => (
                            <div
                                key={guide.id}
                                onClick={() => onSelectGuide?.(guide)}
                                className="group flex items-start justify-between gap-4 px-6 py-5 hover:bg-slate-50 transition-colors cursor-pointer"
                            >
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-blue-600 group-hover:text-blue-700 truncate">
                                        {guide.title}
                                    </p>
                                    <p className="mt-1 text-xs text-slate-500 leading-relaxed line-clamp-2">
                                        {guide.description}
                                    </p>
                                    <div className="mt-2 flex items-center gap-3 flex-wrap">
                                        <span className="inline-flex items-center rounded-md border border-gray-200 px-2 py-0.5 text-xs text-slate-600">
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
                                </div>
                                <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 mt-1 group-hover:text-blue-500 transition-colors" />
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

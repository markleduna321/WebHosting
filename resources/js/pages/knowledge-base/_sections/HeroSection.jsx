import { Search } from "lucide-react";
import React, { useState } from "react";

export default function HeroSection({ onSearch }) {
    const [query, setQuery] = useState("");

    const handleChange = (e) => {
        setQuery(e.target.value);
        onSearch?.(e.target.value);
    };

    return (
        <div className="rounded-xl border border-gray-200 bg-white px-8 py-8">
            <h1 className="text-2xl font-bold text-slate-900">
                How can we help?
            </h1>
            <p className="mt-1.5 text-sm text-slate-500 max-w-sm leading-relaxed">
                Step-by-step guides for hosting, Git, domains, and databases —
                written for student projects.
            </p>

            {/* Search bar */}
            <div className="relative mt-5 max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                    type="text"
                    value={query}
                    onChange={handleChange}
                    placeholder="Search guides — e.g. GitHub, SSL, database"
                    className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm text-slate-700 placeholder-slate-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition"
                />
            </div>
        </div>
    );
}

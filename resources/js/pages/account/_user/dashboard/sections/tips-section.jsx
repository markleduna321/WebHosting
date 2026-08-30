import { TrendingUp, ShieldCheck, Mail, X } from "lucide-react";
import React from "react";

const TIPS = [
    {
        icon: TrendingUp,
        title: "Boost your website speed with CDN",
        body: "Don't let your site lag behind! By enabling the Content Delivery Network (CDN) feature, you could improve your website's performance by an average of 40%. Experience faster load times and smoother user interactions.",
        cta: "Enable CDN",
    },
    {
        icon: ShieldCheck,
        title: "Protect your account with two-factor authentication",
        body: "Add a second step to every login so a leaked password alone cannot reach your websites, databases, or billing details.",
        cta: "Enable 2FA",
    },
    {
        icon: Mail,
        title: "Set up email on your domain",
        body: "Send from you@asuratechsolutions.com instead of a personal address — a free mailbox is included with your hosting plan.",
        cta: "Create mailbox",
    },
];

export default function TipsSection() {
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-base font-bold text-slate-900 mb-4">
                Tips to improve
            </h2>
            <div className="space-y-3">
                {TIPS.map((tip) => {
                    const Icon = tip.icon;
                    return (
                        <div
                            key={tip.title}
                            className="flex items-start justify-between gap-4 rounded-xl border border-gray-100 p-4"
                        >
                            <div className="flex items-start gap-3 min-w-0">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 shrink-0">
                                    <Icon className="w-4.5 h-4.5" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-slate-900">
                                        {tip.title}
                                    </p>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        {tip.body}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <button className="rounded-full border border-slate-200 px-4 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 whitespace-nowrap">
                                    {tip.cta}
                                </button>
                                <button
                                    aria-label="Dismiss"
                                    className="p-1 text-slate-400 hover:text-slate-600"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

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
];

export default function TipsSection() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
      <h2 className="text-base font-bold text-slate-900 mb-4">
        Tips to improve
      </h2>
      <div className="space-y-3">
        {TIPS.map((tip) => {
          const Icon = tip.icon;
          return (
            <div
              key={tip.title}
              className="relative flex flex-col sm:flex-row sm:items-start justify-between gap-4 rounded-xl border border-gray-100 p-4 pr-10 sm:pr-4"
            >
              {/* Main Content Area */}
              <div className="flex items-start gap-3 min-w-0">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 pr-2 sm:pr-0">
                    {tip.title}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    {tip.body}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100 mt-2 sm:mt-0">
                <button className="w-full sm:w-auto rounded-full border border-slate-200 px-4 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 text-center whitespace-nowrap">
                  {tip.cta}
                </button>
                
                {/* Dismiss button positioned absolutely on mobile for clean header layout */}
                <button
                  aria-label="Dismiss"
                  className="absolute top-3 right-3 sm:relative sm:top-0 sm:right-0 p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors"
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
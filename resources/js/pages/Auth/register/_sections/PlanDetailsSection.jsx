import {
  Check,
  CheckCircle2,
  HardDrive,
  Lock,
  Mail,
  Plus,
  RotateCcw,
  Server,
  Shield,
  Sparkles,
  Wrench,
} from "lucide-react";
import React from "react";
import { ADD_ONS, formatCurrency } from "../../../../data/hostingPlans";

const ADD_ON_ICONS = {
  "professional-email": Mail,
  "extra-storage": HardDrive,
  "daily-backup": RotateCcw,
  "website-maintenance": Wrench,
  "website-security": Shield,
  "premium-ssl": Lock,
};

export default function PlanDetailsSection({
  plan,
  selectedAddOnIds = [],
  onToggleAddOn,
  period = 1,
  onPeriodChange,
}) {
  const hasFixedPrice = plan?.monthlyPrice != null;

  const PERIODS = [
    { value: 1, label: "1 month" },
    { value: 12, label: "12 months" },
    { value: 24, label: "24 months" },
    { value: 48, label: "48 months" },
  ];

  const totalPrice = hasFixedPrice ? plan.monthlyPrice * period : null;
  const perMonthPrice = hasFixedPrice && period > 1
    ? Math.round((totalPrice / period) * 100) / 100
    : plan?.monthlyPrice;
  const savings = hasFixedPrice && period > 1
    ? plan.monthlyPrice * period - totalPrice
    : 0;

  return (
    <div className="space-y-6">
      {/* ── Plan Card ── */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        {/* Plan header */}
        <div className="flex items-start gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
            <Server className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-blue-600">
                {plan?.name ?? "Student"} plan
              </h2>
              {plan?.popular && (
                <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-2.5 py-0.5 text-[11px] font-bold text-white shadow-sm">
                  <Sparkles className="h-3 w-3" />
                  Popular
                </span>
              )}
            </div>
            {plan?.subtitle && (
              <p className="mt-0.5 text-sm text-slate-500">{plan.subtitle}</p>
            )}
          </div>
        </div>

        {/* Period & Price */}
        <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-slate-400 mb-1.5">Period</p>
            <select
              value={period}
              onChange={(e) => onPeriodChange?.(Number(e.target.value))}
              className="appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2.5 pr-9 text-sm font-medium text-slate-700 shadow-sm cursor-pointer focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m4%206%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:16px] bg-[right_12px_center] bg-no-repeat"
            >
              {PERIODS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black tracking-tight text-slate-900">
              {hasFixedPrice ? formatCurrency(perMonthPrice) : plan?.price ?? "₱129"}
            </span>
            <span className="text-sm font-medium text-slate-400">/mo</span>
            {hasFixedPrice && period > 1 && (
              <p className="mt-0.5 text-xs text-slate-400 line-through">
                {formatCurrency(plan.monthlyPrice)}/mo
              </p>
            )}
          </div>
        </div>

        {/* Renewal note */}
        <p className="mt-3 text-xs text-slate-400">
          {hasFixedPrice
            ? `Renews after ${period} month${period > 1 ? "s" : ""} at ${formatCurrency(plan.monthlyPrice)}/mo. Cancel anytime.`
            : "Custom pricing — our team will confirm details."}
        </p>

        {/* Included features */}
        {plan?.features?.length > 0 && (
          <div className="mt-5 border-t border-gray-100 pt-5">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {plan.features.map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-2 text-sm text-slate-600"
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Add-ons Section ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">
            Power add-ons
          </h3>
          {selectedAddOnIds.length > 0 && (
            <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-600 border border-blue-100">
              {selectedAddOnIds.length} added
            </span>
          )}
        </div>

        {(ADD_ONS || []).map((addOn) => {
          const isSelected = selectedAddOnIds.includes(addOn.id);
          const Icon = ADD_ON_ICONS[addOn.id] ?? Server;

          return (
            <button
              key={addOn.id}
              type="button"
              onClick={() => onToggleAddOn?.(addOn.id)}
              aria-pressed={isSelected}
              className={`group flex w-full items-start gap-4 rounded-2xl border p-5 text-left transition-all duration-200 ${
                isSelected
                  ? "border-blue-500 bg-blue-50/40 ring-1 ring-blue-500/20 shadow-sm"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
              }`}
            >
              {/* Checkbox */}
              <div
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-all ${
                  isSelected
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-gray-300 bg-white group-hover:border-gray-400"
                }`}
              >
                {isSelected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 shrink-0 text-slate-400" />
                  <span className="text-sm font-semibold text-slate-900">
                    {addOn.label}
                  </span>
                  {addOn.id === "extra-storage" && (
                    <span className="rounded bg-amber-50 border border-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-600">
                      Recommended
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                  {addOn.description?.[0]}
                </p>
              </div>

              {/* Price */}
              <span className="shrink-0 text-sm font-bold text-slate-900">
                +{formatCurrency(addOn.price)}
                <span className="text-xs font-medium text-slate-400">/{addOn.period}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
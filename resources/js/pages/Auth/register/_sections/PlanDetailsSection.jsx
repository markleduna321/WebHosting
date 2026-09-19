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
  ShieldCheck,
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
}) {
  return (
    <div className="relative hidden lg:flex lg:h-screen lg:w-1/2 lg:overflow-hidden min-h-screen w-full flex-col justify-between bg-[#0B0F19] bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] p-6 text-white lg:p-8">
      {/* Header / Brand Logo */}
      <header className="mb-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <img
            src="/images/logo 3.png"
            alt="CALEHO Host Logo"
            className="h-10 w-10 object-contain"
          />
          <span className="text-2xl font-black tracking-tight">
            <span className="bg-gradient-to-r from-blue-400 via-sky-400 to-cyan-400 bg-clip-text text-transparent">
              CALEHO
            </span>{" "}
            <span className="text-blue-500">HOST</span>
          </span>
        </div>

      </header>

      {/* Main Focal Area */}
      <div className="my-auto w-full space-y-4 rounded-2xl border border-slate-800/80 px-6 py-5 bg-slate-900/80  ">
        {/* Primary Hero Card */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-2xl backdrop-blur-md sm:p-6  ">
          {/* Subtle Glow Overlay */}
          <div className="pointer-events-none absolute -top-12 -right-12 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-400">
              <Sparkles className="h-3.5 w-3.5 text-blue-400" />
              Selected Package
            </span>
            {plan?.popular && (
              <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1 text-xs font-extrabold text-white shadow-md shadow-orange-500/20">
                ★ Most Popular Choice
              </span>
            )}
          </div>

          <h1 className="mb-2 text-3xl font-black text-white sm:text-4xl">
            {plan?.name ?? "Student"}
          </h1>

          {plan?.subtitle && (
            <p className="max-w-xl text-sm font-normal text-slate-400 sm:text-base">
              {plan.subtitle}
            </p>
          )}

          <div className="mt-6 flex flex-wrap items-baseline justify-between gap-4 border-t border-slate-800/80 pt-5">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                {plan?.price ?? "₱129"}
              </span>
              <span className="text-sm font-semibold text-slate-400">
                {plan?.billingNote ?? "/month"}
              </span>
            </div>
            <span className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400">
              Instant Activation
            </span>
          </div>
        </div>

        {/* Key Features List */}
        {plan?.features?.length > 0 && (
          <div className="space-y-3">
            <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
              <ShieldCheck className="h-4 w-4 text-blue-400" />
              Included Specifications & Benefits
            </h2>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {plan.features.map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-3 shadow-sm transition-all hover:border-slate-700"
                >
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium text-slate-200">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Optional Add-ons Grid */}
        <div className="pt-2">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
              <span>Optional Power Add-ons</span>
              <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-[10px] font-bold text-slate-300">
                Customize
              </span>
            </h3>
            {selectedAddOnIds.length > 0 && (
              <span className="text-xs font-bold text-blue-400">
                {selectedAddOnIds.length} added
              </span>
            )}
          </div>

          <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {(ADD_ONS || []).map((addOn) => {
              const isSelected = selectedAddOnIds.includes(addOn.id);
              const Icon = ADD_ON_ICONS[addOn.id] ?? Server;

              return (
                <li key={addOn.id}>
                  <button
                    type="button"
                    onClick={() => onToggleAddOn?.(addOn.id)}
                    aria-pressed={isSelected}
                    className={`group flex w-full items-center justify-between gap-3 rounded-xl border p-3 text-left transition-all duration-200 ${
                      isSelected
                        ? "-translate-y-0.5 border-blue-500 bg-blue-950/40 text-white ring-1 ring-blue-500/50"
                        : "border-slate-800 bg-slate-900/50 text-slate-300 hover:-translate-y-0.5 hover:border-slate-700 hover:bg-slate-800/80 hover:text-white"
                    }`}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md transition-all ${
                          isSelected
                            ? "bg-blue-600 text-white"
                            : "bg-slate-800 text-slate-400 group-hover:bg-blue-500/20 group-hover:text-blue-400"
                        }`}
                      >
                        {isSelected ? (
                          <Check className="h-4 w-4 stroke-[3]" />
                        ) : (
                          <Plus className="h-4 w-4 stroke-[2.5]" />
                        )}
                      </div>
                      <Icon className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-slate-300" />
                      <span className="truncate text-sm font-semibold text-slate-200">
                        {addOn.label}
                      </span>
                    </div>

                    <span
                      className={`shrink-0 rounded-md px-2 py-1 text-xs font-bold ${
                        isSelected
                          ? "bg-blue-500/20 text-blue-300"
                          : "bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-slate-200"
                      }`}
                    >
                      +{formatCurrency(addOn.price)}/{addOn.period}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Footer Notice */}
     
    </div>
  );
}
import React from "react";
import { router, usePage } from "@inertiajs/react";
import Button from "@/components/ui/Button";
import {
    BILLING_PERIOD_LABELS,
    getPlanPeriodPrice,
} from "@/data/hostingPlans";

export default function SubscriptionHeaderSection() {
    const { subscription } = usePage().props;

    if (!subscription) {
        return (
            <div className="rounded-xl border border-gray-200 bg-white px-6 py-5">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <p className="text-xs text-slate-400 mb-0.5">
                            Current subscription
                        </p>
                        <p className="text-lg font-bold text-slate-900">
                            No active plan
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                            You don't have an active subscription yet.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <Button
                            variant="primary"
                            size="sm"
                            className="rounded-lg"
                            onClick={() => router.visit(route("hosting"))}
                        >
                            Choose a plan
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    const plan = subscription.plan;
    const months = subscription.billing_cycle === "annual"
        ? 12
        : subscription.billing_cycle === "monthly"
            ? 1
            : Number(subscription.billing_cycle) || 1;
    const billingCycle = BILLING_PERIOD_LABELS[months] ?? `${months} Months`;
    const renewDate = subscription.ends_at
        ? new Date(subscription.ends_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
          })
        : null;

    const displayPrice = getPlanPeriodPrice(
        {
            monthlyPrice: plan?.monthly_price,
            prices: plan?.prices,
            periodDiscounts: plan?.period_discounts,
        },
        months,
    ) ?? 0;

    const currencySymbol = plan?.currency === "PHP" ? "₱" : "$";

    // Status badge
    const statusLabels = {
        active: "Active",
        trialing: "Trial",
        past_due: "Past Due",
        canceled: "Canceled",
        expired: "Expired",
    };

    const statusColors = {
        active: "border-green-300 text-green-600 bg-green-50",
        trialing: "border-blue-300 text-blue-600 bg-blue-50",
        past_due: "border-yellow-300 text-yellow-600 bg-yellow-50",
        canceled: "border-red-300 text-red-500 bg-red-50",
        expired: "border-gray-300 text-gray-500 bg-gray-50",
    };

    return (
        <div className="rounded-xl border border-gray-200 bg-white px-6 py-5">
            <div className="flex items-center justify-between gap-4">
                {/* Left: subscription info */}
                <div>
                    <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-xs text-slate-400">
                            Current subscription
                        </p>
                        <span
                            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${
                                statusColors[subscription.status] || statusColors.active
                            }`}
                        >
                            {statusLabels[subscription.status] || subscription.status}
                        </span>
                    </div>
                    <p className="text-lg font-bold text-slate-900">
                        {plan?.name ?? "Unknown Plan"}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                        {renewDate && (
                            <>
                                Renews {renewDate} ·{" "}
                            </>
                        )}
                        {currencySymbol}
                        {Number(displayPrice).toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                        })}{" "}
                        / {billingCycle.toLowerCase()}
                    </p>
                </div>

                {/* Right: action buttons */}
                <div className="flex items-center gap-2 shrink-0">
                    <Button
                        variant="primary"
                        size="sm"
                        className="rounded-lg"
                        onClick={() => router.visit(route("hosting"))}
                    >
                        Change plan
                    </Button>
                </div>
            </div>
        </div>
    );
}

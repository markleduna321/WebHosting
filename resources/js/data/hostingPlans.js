// Shared utilities for pricing formatting

export const BILLING_PERIODS = [1, 3, 6, 12, 24, 48];

export const PERIOD_LABELS = {
    1: "",
    12: "",
    24: "",
    48: "Best Value",
};

export const BILLING_PERIOD_LABELS = {
    1: "Monthly",
    3: "3 Months",
    6: "6 Months",
    12: "1 Year",
    24: "2 Years",
    48: "4 Years",
};

export function getPeriodLabel(period) {
    return PERIOD_LABELS[period] ?? "";
}

export function getPlanPeriodPrice(plan, months) {
    if (plan?.monthlyPrice == null) {
        return null;
    }

    const monthlyPrice = Number(plan.monthlyPrice);
    const discount = plan.periodDiscounts?.[months];

    if (discount != null) {
        return Math.round(
            monthlyPrice * months * (100 - Number(discount)),
        ) / 100;
    }

    const configuredPrice = plan.prices?.[months];
    if (configuredPrice != null) {
        return Number(configuredPrice);
    }

    return Math.round(monthlyPrice * months * 100) / 100;
}

export function getPlanPeriodDiscountPercent(plan, months) {
    if (months <= 1 || plan?.monthlyPrice == null) {
        return 0;
    }

    const configuredDiscount = plan.periodDiscounts?.[months];
    if (configuredDiscount != null) {
        return Number(configuredDiscount);
    }

    const regularPrice = Number(plan.monthlyPrice) * months;
    const periodPrice = getPlanPeriodPrice(plan, months);

    return periodPrice < regularPrice
        ? Math.round(((regularPrice - periodPrice) / regularPrice) * 100)
        : 0;
}

export function getPlanBillingPeriods(plan) {
    if (plan?.monthlyPrice == null) {
        return [1];
    }

    const configuredPeriods = [
        ...Object.keys(plan?.prices ?? {}),
        ...Object.keys(plan?.periodDiscounts ?? {}),
    ]
        .map(Number)
        .filter((months) => BILLING_PERIODS.includes(months));

    return [...new Set([...BILLING_PERIODS, ...configuredPeriods])]
        .sort((a, b) => a - b);
}

export function formatCurrency(amount) {
    return `₱${amount.toLocaleString()}`;
}

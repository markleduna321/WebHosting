// Shared utilities for pricing formatting

/** Month-keyed maps only; a list would turn its indexes into billing periods. */
function periodMap(value) {
    return value && typeof value === "object" && !Array.isArray(value)
        ? value
        : {};
}

export function formatBillingPeriod(months) {
    if (months === 1) {
        return "Monthly";
    }

    if (months === 12) {
        return "Yearly";
    }

    return `${months} Months`;
}

export function getPlanPeriodPrice(plan, months) {
    if (plan?.monthlyPrice == null) {
        return null;
    }

    const monthlyPrice = Number(plan.monthlyPrice);
    if (months === 1) {
        return monthlyPrice;
    }

    const discount = periodMap(plan.periodDiscounts)[months];

    if (discount != null) {
        if (!Number.isFinite(Number(discount)) || discount < 0 || discount > 100) {
            return null;
        }

        return Math.round(
            monthlyPrice * months * (100 - Number(discount)),
        ) / 100;
    }

    const configuredPrice = periodMap(plan.prices)[months];
    if (configuredPrice != null) {
        return Number(configuredPrice);
    }

    return null;
}

export function getPlanPeriodDiscountPercent(plan, months) {
    if (months <= 1 || plan?.monthlyPrice == null) {
        return 0;
    }

    const configuredDiscount = periodMap(plan.periodDiscounts)[months];
    if (configuredDiscount != null) {
        const discountPercent = Number(configuredDiscount);

        return Number.isFinite(discountPercent) &&
            discountPercent >= 0 &&
            discountPercent <= 100
            ? discountPercent
            : 0;
    }

    const regularPrice = Number(plan.monthlyPrice) * months;
    const periodPrice = getPlanPeriodPrice(plan, months);

    return periodPrice != null && periodPrice < regularPrice
        ? Math.round(((regularPrice - periodPrice) / regularPrice) * 100)
        : 0;
}

export function getPlanBillingPeriods(plan) {
    if (plan?.monthlyPrice == null) {
        return [];
    }

    const configuredPeriods = [
        1,
        ...Object.keys(periodMap(plan.prices)).map(Number),
        ...Object.keys(periodMap(plan.periodDiscounts)).map(Number),
    ]
        .filter((months) => Number.isSafeInteger(months) && months > 0)
        .filter((months) => getPlanPeriodPrice(plan, months) > 0);

    return [...new Set(configuredPeriods)].sort((a, b) => a - b);
}

export function formatCurrency(amount, currency = "PHP") {
    return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(amount);
}

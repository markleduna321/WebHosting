// Shared utilities for pricing formatting

export const PERIOD_LABELS = {
    1: "",
    12: "",
    24: "",
    48: "Best Value",
};

export function getPeriodLabel(period) {
    return PERIOD_LABELS[period] ?? "";
}


export function formatCurrency(amount) {
    return `₱${amount.toLocaleString()}`;
}


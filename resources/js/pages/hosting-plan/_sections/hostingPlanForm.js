import {
    getPlanBillingPeriods,
    getPlanPeriodDiscountPercent,
    getPlanPeriodPrice,
} from "@/data/hostingPlans";

export const MAX_MONTHS = 120;

export const JSON_FIELDS = {
    prices: { label: "Period prices", minMonths: 1, maxValue: null, valueLabel: "Total" },
    period_discounts: { label: "Period discounts (%)", minMonths: 2, maxValue: 100, valueLabel: "Discount %" },
};

export const LIMIT_FIELDS = [
    { name: "max_websites", label: "Websites", helper: "Sites a subscriber can host" },
    { name: "max_databases", label: "Databases", helper: "MySQL databases" },
    { name: "disk_space_mb", label: "Storage (MB)", helper: "e.g. 50 or 200" },
    { name: "db_size_mb", label: "Database size (MB)", helper: "Per database" },
];

const EMPTY_PLAN = {
    name: "",
    subtitle: "",
    monthly_price: "",
    currency: "PHP",
    sort_order: "0",
    is_popular: false,
    is_active: true,
    max_websites: "1",
    max_databases: "1",
    disk_space_mb: "50",
    db_size_mb: "50",
    prices: {},
    period_discounts: {},
    features: [],
};

export function formatJson(value) {
    return JSON.stringify(value ?? {}, null, 2);
}

/** Converts an admin plan resource into editable form state. JSON fields are kept as text. */
export function planToForm(plan, { copy = false } = {}) {
    const source = { ...EMPTY_PLAN, ...(plan ?? {}) };

    return {
        name: copy ? `${source.name} (Copy)` : source.name ?? "",
        subtitle: source.subtitle ?? "",
        monthly_price: source.monthly_price == null ? "" : String(source.monthly_price),
        currency: source.currency ?? "PHP",
        sort_order: String(source.sort_order ?? 0),
        is_popular: copy ? false : Boolean(source.is_popular),
        is_active: copy ? false : Boolean(source.is_active),
        max_websites: String(source.max_websites ?? 1),
        max_databases: String(source.max_databases ?? 1),
        disk_space_mb: String(source.disk_space_mb ?? 50),
        db_size_mb: String(source.db_size_mb ?? 50),
        pricesText: formatJson(source.prices),
        discountsText: formatJson(source.period_discounts),
        featuresText: formatJson(source.features ?? []),
    };
}

/** Parses a month-keyed JSON map, mirroring the server rules in ValidatesPlanPricing. */
export function parseMonthMap(text, { minMonths = 1, maxValue = null } = {}) {
    if (!String(text ?? "").trim()) {
        return { value: {}, error: null };
    }

    let parsed;
    try {
        parsed = JSON.parse(text);
    } catch (error) {
        return { value: null, error: `Invalid JSON: ${error.message}` };
    }

    if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
        return {
            value: null,
            error: 'Use an object keyed by months, e.g. {"12": 2200}. Lists like [249, 2200] are not allowed.',
        };
    }

    const value = {};
    for (const [key, raw] of Object.entries(parsed)) {
        const months = Number(key);
        if (!/^\d+$/.test(key) || months < minMonths || months > MAX_MONTHS) {
            return { value: null, error: `Key "${key}" must be a month count from ${minMonths} to ${MAX_MONTHS}.` };
        }

        const amount = typeof raw === "string" && raw.trim() !== "" ? Number(raw) : raw;
        if (typeof amount !== "number" || !Number.isFinite(amount) || amount < 0) {
            return { value: null, error: `Value for "${key}" must be a number of 0 or more.` };
        }
        if (maxValue != null && amount > maxValue) {
            return { value: null, error: `Value for "${key}" must be ${maxValue} or less.` };
        }

        value[months] = amount;
    }

    return { value, error: null };
}

export function parseFeatures(text) {
    if (!String(text ?? "").trim()) {
        return { value: [], error: null };
    }

    let parsed;
    try {
        parsed = JSON.parse(text);
    } catch (error) {
        return { value: null, error: `Invalid JSON: ${error.message}` };
    }

    if (!Array.isArray(parsed) || parsed.some((item) => typeof item !== "string")) {
        return { value: null, error: 'Use a list of text values, e.g. ["3 Sites", "Free SSL"].' };
    }

    const value = parsed.map((item) => item.trim()).filter(Boolean);
    if (value.some((item) => item.length > 255)) {
        return { value: null, error: "Each feature must be 255 characters or fewer." };
    }

    return { value, error: null };
}

export function parseJsonFields(form) {
    const prices = parseMonthMap(form.pricesText, JSON_FIELDS.prices);
    const discounts = parseMonthMap(form.discountsText, JSON_FIELDS.period_discounts);
    const features = parseFeatures(form.featuresText);

    return {
        prices,
        period_discounts: discounts,
        features,
        hasErrors: Boolean(prices.error || discounts.error || features.error),
    };
}

/** Same period/discount math as checkout, so the preview matches what customers are charged. */
export function previewBillingPeriods(monthlyPrice, prices, discounts) {
    if (monthlyPrice === "" || monthlyPrice == null || !Number.isFinite(Number(monthlyPrice))) {
        return [];
    }

    const plan = {
        monthlyPrice: Number(monthlyPrice),
        prices: prices ?? {},
        periodDiscounts: discounts ?? {},
    };

    return getPlanBillingPeriods(plan).map((months) => ({
        months,
        total: getPlanPeriodPrice(plan, months),
        discountPercent: getPlanPeriodDiscountPercent(plan, months),
        source: months === 1 ? "monthly" : plan.periodDiscounts[months] != null ? "discount" : "price",
    }));
}

export function buildPayload(form, parsed) {
    return {
        name: form.name.trim(),
        subtitle: form.subtitle.trim() || null,
        monthly_price: form.monthly_price === "" ? null : Number(form.monthly_price),
        currency: form.currency.trim().toUpperCase(),
        sort_order: Number(form.sort_order || 0),
        is_popular: form.is_popular,
        is_active: form.is_active,
        max_websites: Number(form.max_websites || 0),
        max_databases: Number(form.max_databases || 0),
        disk_space_mb: Number(form.disk_space_mb || 0),
        db_size_mb: Number(form.db_size_mb || 0),
        prices: parsed.prices.value,
        period_discounts: parsed.period_discounts.value,
        features: parsed.features.value,
    };
}

/** Groups Laravel 422 keys such as "period_discounts.48" or "features.0" under their form field. */
export function groupServerErrors(errors = {}) {
    return Object.entries(errors).reduce((grouped, [key, messages]) => {
        const field = key.split(".")[0];
        grouped[field] = grouped[field] ?? messages?.[0];
        return grouped;
    }, {});
}
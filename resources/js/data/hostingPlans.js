// Single source of truth for hosting plan data — shared by the home page
// pricing carousel and the registration flow so both stay in sync.
export const PLANS = [
    {
        name: "Student",
        slug: "student",
        subtitle: "For your very first site",
        price: "₱129",
        monthlyPrice: 129,
        prices: {
            1: 129,
            12: 1000,
            24: 1800,
            48: 3000,
        },
        billingNote: "/month",
        annualNote: "or ₱1,000 billed annually",
        features: [
            "1 Site",
            "1 Free Subdomain",
            "50MB NVMe Storage",
            "1 MySQL Database (50MB)",
            "Automated Git Push Sync",
            "Free SSL",
        ],
        popular: false,
        cta: "Choose Plan",
    },
    {
        name: "Pro",
        slug: "pro",
        subtitle: "For growing student projects",
        price: "₱249",
        monthlyPrice: 249,
        prices: {
            1: 249,
            12: 2200,
            24: 4000,
            48: 7000,
        },
        billingNote: "/month",
        annualNote: "or ₱2,200 billed annually",
        features: [
            "3 Sites",
            "1 Free Subdomain",
            "200MB NVMe Storage",
            "1 MySQL Database (100MB)",
            "Automated Git Push Sync",
            "VS Code AI Extension (BYOK)",
            "Free SSL",
        ],
        popular: true,
        cta: "Choose Plan",
    },
    {
        name: "Enterprise",
        slug: "enterprise",
        subtitle: "For organizations and capstone teams",
        price: "Custom",
        monthlyPrice: null,
        prices: {},
        billingNote: "",
        annualNote: "Contact for pricing",
        features: ["Free Domain (1 Year)", "Automated Git + Priority Sync"],
        popular: false,
        cta: "Contact Sales",
    },
];

export const PERIOD_LABELS = {
    1: "",
    12: "",
    24: "",
    48: "Best Value",
};

export function getPeriodLabel(period) {
    return PERIOD_LABELS[period] ?? "";
}

export function getPlanByName(name) {
    return PLANS.find((plan) => plan.name === name);
}

export function formatCurrency(amount) {
    return `₱${amount.toLocaleString()}`;
}


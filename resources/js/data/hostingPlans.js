// Single source of truth for hosting plan data — shared by the home page
// pricing carousel and the registration flow so both stay in sync.
export const PLANS = [
    {
        name: "Student",
        slug: "student",
        subtitle: "For your very first site",
        price: "₱129",
        monthlyPrice: 129,
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
        billingNote: "",
        annualNote: "Contact for pricing",
        features: ["Free Domain (1 Year)", "Automated Git + Priority Sync"],
        popular: false,
        cta: "Contact Sales",
    },
];

// Discount tiers applied to the monthly price based on the selected billing
// period — shared by the registration plan panel's period selector.
export const PERIOD_DISCOUNTS = {
    1: { percent: 0, label: "" },
    12: { percent: 10, label: "Save 10%" },
    24: { percent: 15, label: "Save 15%" },
    48: { percent: 20, label: "Save 20% · Best Value" },
};

export function getPeriodDiscount(period) {
    return PERIOD_DISCOUNTS[period] ?? { percent: 0, label: "" };
}

export function getPlanByName(name) {
    return PLANS.find((plan) => plan.name === name);
}

export function formatCurrency(amount) {
    return `₱${amount.toLocaleString()}`;
}


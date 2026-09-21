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

// Shared add-on catalog — used by both the plan details panel (to select
// add-ons) and the checkout summary (to price them).
export const ADD_ONS = [

    {
        id: "extra-storage",
        label: "Extra 10 GB Storage",
        price: 50,
        period: "month",
        description: [
            "Room for bigger media libraries, datasets, or multiple projects.",
            "Upgrade anytime without migrating your existing site.",
        ],
    },
    
  
    {
        id: "website-security",
        label: "Website Security",
        price: 199,
        period: "month",
        description: [
            "Web Application Firewall (WAF) blocks common attacks.",
            "Malware scanning and alerts with cleanup support.",
        ],
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

export function getAddOnById(id) {
    return ADD_ONS.find((addOn) => addOn.id === id);
}

export function formatCurrency(amount) {
    return `₱${amount.toLocaleString()}`;
}


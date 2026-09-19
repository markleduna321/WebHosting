// Single source of truth for hosting plan data — shared by the home page
// pricing carousel and the registration flow so both stay in sync.
export const PLANS = [
    {
        name: "Student",
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
        id: "professional-email",
        label: "Professional Email",
        price: 49,
        period: "month",
        description: [
            "A custom @yourdomain inbox instead of a free webmail address.",
            "Looks more credible on resumes, portfolios, and client work.",
        ],
    },
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
        id: "daily-backup",
        label: "Daily Website Backup",
        price: 149,
        period: "month",
        description: [
            "Automatic daily snapshots of your files and database.",
            "Restore in one click if something breaks during a deploy.",
        ],
    },
    {
        id: "website-maintenance",
        label: "Website Maintenance",
        price: 499,
        period: "month",
        description: [
            "We monitor uptime and apply routine updates for you.",
            "Frees you up to focus on coursework, not server upkeep.",
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
    {
        id: "premium-ssl",
        label: "Premium SSL Certificate",
        price: 999,
        period: "year",
        description: [
            "Extended-validation HTTPS encryption for your domain.",
            "Boosts visitor trust and search ranking signals.",
        ],
    },
];

export function getPlanByName(name) {
    return PLANS.find((plan) => plan.name === name);
}

export function getAddOnById(id) {
    return ADD_ONS.find((addOn) => addOn.id === id);
}

export function formatCurrency(amount) {
    return `₱${amount.toLocaleString()}`;
}


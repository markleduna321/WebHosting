// Single source of truth for hosting plan data — shared by the home page
// pricing carousel and the registration flow so both stay in sync.
export const PLANS = [
    {
        name: "Student",
        subtitle: "For your very first site",
        price: "₱129",
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
        billingNote: "",
        annualNote: "Contact for pricing",
        features: ["Free Domain (1 Year)", "Automated Git + Priority Sync"],
        popular: false,
        cta: "Contact Sales",
    },
];

export function getPlanByName(name) {
    return PLANS.find((plan) => plan.name === name);
}

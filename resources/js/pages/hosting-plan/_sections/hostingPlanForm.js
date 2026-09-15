import { useEffect } from "react";
import { useForm } from "@inertiajs/react";

export const PLAN_STATUS_OPTIONS = [
    { label: "Active", value: "active" },
    { label: "Draft", value: "draft" },
    { label: "Archived", value: "archived" },
];

export const SUPPORT_LEVEL_OPTIONS = [
    { label: "Student", value: "student" },
    { label: "Standard", value: "standard" },
    { label: "Priority", value: "priority" },
];

export const DEFAULT_VALUES = {
    plan_name: "",
    tagline: "",
    description: "",
    monthly_price: "99",
    yearly_price: "990",
    promotional_price: "",
    student_discount: "0",
    trial_period: "14",
    plan_status: "active",
    storage_cap: "10240",
    bandwidth: "100",
    websites: "1",
    domains: "1",
    databases: "1",
    email_accounts: "1",
    support_level: "student",
    ssl_included: true,
    git_access: false,
    deployment_access: true,
};

export const REQUIRED_FIELDS = [
    ["plan_name", "Plan name"],
    ["tagline", "Tagline"],
    ["description", "Description"],
    ["monthly_price", "Monthly price"],
    ["yearly_price", "Yearly price"],
    ["student_discount", "Student discount"],
    ["trial_period", "Trial period"],
    ["storage_cap", "Storage cap"],
    ["bandwidth", "Bandwidth"],
    ["websites", "Websites"],
    ["domains", "Domains"],
    ["databases", "Databases"],
    ["email_accounts", "Email accounts"],
    ["support_level", "Support level"],
];

export const FIELD_GROUPS = [
    {
        title: "Pricing controls",
        columns: "grid-cols-1 md:grid-cols-3",
        fields: [
            { name: "monthly_price", label: "Monthly price (₱)", placeholder: "99", helper: "e.g. 129" },
            { name: "yearly_price", label: "Yearly price (₱)", placeholder: "990", helper: "e.g. 1,000" },
            { name: "promotional_price", label: "Promotional price (₱)", placeholder: "None" },
            { name: "student_discount", label: "Student discount (%)", placeholder: "0" },
            { name: "trial_period", label: "Trial period (days)", placeholder: "14" },
            { name: "plan_status", label: "Plan status", type: "select", options: PLAN_STATUS_OPTIONS },
        ],
    },
    {
        title: "Limits — use -1 for unlimited",
        columns: "grid-cols-1 md:grid-cols-3",
        fields: [
            { name: "storage_cap", label: "Storage cap (MB)", placeholder: "10240", helper: "e.g. 50 or 200" },
            { name: "bandwidth", label: "Bandwidth (GB)", placeholder: "100" },
            { name: "websites", label: "Websites", placeholder: "1" },
            { name: "domains", label: "Domains", placeholder: "1" },
            { name: "databases", label: "Databases", placeholder: "1" },
            { name: "email_accounts", label: "Email accounts", placeholder: "1" },
        ],
    },
];

export function createInitialValues(plan) {
    if (!plan) return DEFAULT_VALUES;

    return {
        ...DEFAULT_VALUES,
        plan_name: plan.plan_name ?? plan.name ?? "",
        tagline: plan.tagline ?? plan.subtitle ?? "",
        description: plan.description ?? plan.subtitle ?? "",
        monthly_price: String(plan.monthly_price ?? plan.monthlyPrice ?? "99"),
        yearly_price: String(plan.yearly_price ?? plan.annual_price ?? plan.annualPrice ?? "990"),
        promotional_price: String(plan.promotional_price ?? ""),
        student_discount: String(plan.student_discount ?? "0"),
        trial_period: String(plan.trial_period ?? "14"),
        plan_status: plan.plan_status ?? "active",
        storage_cap: String(plan.storage_cap ?? "10240"),
        bandwidth: String(plan.bandwidth ?? "100"),
        websites: String(plan.websites ?? "1"),
        domains: String(plan.domains ?? "1"),
        databases: String(plan.databases ?? "1"),
        email_accounts: String(plan.email_accounts ?? "1"),
        support_level: plan.support_level ?? "student",
        ssl_included: Boolean(plan.ssl_included ?? true),
        git_access: Boolean(plan.git_access ?? false),
        deployment_access: Boolean(plan.deployment_access ?? true),
    };
}

export function normalizeFeatures(features) {
    if (!Array.isArray(features)) {
        return [];
    }

    return features
        .map((feature) => {
            if (typeof feature === "string") return feature;
            if (feature?.label) return feature.label;
            if (feature?.name) return feature.name;
            return null;
        })
        .filter(Boolean);
}

export function useHostingPlanForm(plan, open) {
    const form = useForm(createInitialValues(plan));

    useEffect(() => {
        if (!open) return;

        form.setData(createInitialValues(plan));
        form.clearErrors();
    }, [open, plan]);

    return form;
}

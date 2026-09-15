import React, { useState } from "react";
import { Input, Select, Switch } from "antd";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import {
    SUPPORT_LEVEL_OPTIONS,
    FIELD_GROUPS,
    REQUIRED_FIELDS,
    useHostingPlanForm,
} from "./hostingPlanForm";

function FieldLabel({ children }) {
    return <label className="text-sm font-medium text-slate-700">{children}</label>;
}

function SectionTitle({ children }) {
    return <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{children}</p>;
}

function FieldError({ message }) {
    if (!message) return null;

    return <p className="text-xs text-red-500">{message}</p>;
}

export default function CreatePlanSection({ open = false, onCancel, onCreate }) {
    const form = useHostingPlanForm(null, open);
    const [features, setFeatures] = useState([]);
    const [featureInput, setFeatureInput] = useState("");

    const updateField = (field) => (event) => {
        form.setData(field, event.target.value);
        form.clearErrors(field);
    };

    const updateSelect = (field) => (value) => {
        form.setData(field, value);
        form.clearErrors(field);
    };

    const addFeature = () => {
        const value = featureInput.trim();
        if (!value) return;

        setFeatures((current) => [...current, value]);
        setFeatureInput("");
    };

    const validateForm = () => {
        const nextErrors = {};

        REQUIRED_FIELDS.forEach(([field, label]) => {
            if (!String(form.data[field] ?? "").trim()) {
                nextErrors[field] = `${label} is required.`;
            }
        });

        form.clearErrors();
        Object.entries(nextErrors).forEach(([field, message]) => form.setError(field, message));
        return Object.keys(nextErrors).length === 0;
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!validateForm()) return;

        onCreate?.({ ...form.data, features });
        form.reset();
        setFeatures([]);
        setFeatureInput("");
    };

    return (
        <Modal
            open={open}
            onCancel={onCancel}
            width={720}
            title="Create hosting plan"
            subtitle="Pricing, limits and features sync to the public website when the plan is active."
        >
            <form onSubmit={handleSubmit} className="flex flex-col max-h-[75vh]">
                <div className="flex-1 h-[400px] overflow-y-auto space-y-6 pr-2 mb-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <FieldLabel>Plan name</FieldLabel>
                            <Input value={form.data.plan_name} onChange={updateField("plan_name")} status={form.errors.plan_name ? "error" : ""} placeholder="Starter" />
                            <FieldError message={form.errors.plan_name} />
                        </div>
                        <div className="space-y-1.5">
                            <FieldLabel>Tagline</FieldLabel>
                            <Input value={form.data.tagline} onChange={updateField("tagline")} status={form.errors.tagline ? "error" : ""} placeholder="For your very first site" />
                            <FieldError message={form.errors.tagline} />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <FieldLabel>Description</FieldLabel>
                        <Input.TextArea value={form.data.description} onChange={updateField("description")} status={form.errors.description ? "error" : ""} placeholder="Describe who this plan is for and what it includes." autoSize={{ minRows: 4, maxRows: 5 }} />
                        <FieldError message={form.errors.description} />
                    </div>

                    {FIELD_GROUPS.map((group) => (
                        <div className="space-y-2.5" key={group.title}>
                            <SectionTitle>{group.title}</SectionTitle>
                            <div className={`grid ${group.columns} gap-4`}>
                                {group.fields.map((field) => (
                                    <div className="space-y-1.5" key={field.name}>
                                        <FieldLabel>{field.label}</FieldLabel>
                                        {field.type === "select" ? (
                                            <>
                                                <Select value={form.data[field.name]} onChange={updateSelect(field.name)} options={field.options} className="w-full" status={form.errors[field.name] ? "error" : ""} />
                                                <FieldError message={form.errors[field.name]} />
                                            </>
                                        ) : (
                                            <>
                                                <Input value={form.data[field.name]} onChange={updateField(field.name)} status={form.errors[field.name] ? "error" : ""} placeholder={field.placeholder} />
                                                <FieldError message={form.errors[field.name]} />
                                                {field.helper && <p className="text-xs text-slate-400">{field.helper}</p>}
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="rounded-xl border border-slate-200 px-4 py-3 flex items-center justify-between gap-4">
                            <span className="text-sm font-medium text-slate-700">SSL included</span>
                            <Switch checked={form.data.ssl_included} onChange={(checked) => form.setData("ssl_included", checked)} />
                        </div>
                        <div className="rounded-xl border border-slate-200 px-4 py-3 flex items-center justify-between gap-4">
                            <span className="text-sm font-medium text-slate-700">Git access</span>
                            <Switch checked={form.data.git_access} onChange={(checked) => form.setData("git_access", checked)} />
                        </div>
                        <div className="rounded-xl border border-slate-200 px-4 py-3 flex items-center justify-between gap-4">
                            <span className="text-sm font-medium text-slate-700">Deployment access</span>
                            <Switch checked={form.data.deployment_access} onChange={(checked) => form.setData("deployment_access", checked)} />
                        </div>
                        <div className="space-y-1.5">
                            <FieldLabel>Support level</FieldLabel>
                            <Select value={form.data.support_level} onChange={updateSelect("support_level")} options={SUPPORT_LEVEL_OPTIONS} className="w-full" status={form.errors.support_level ? "error" : ""} />
                            <FieldError message={form.errors.support_level} />
                        </div>
                    </div>

                    <div className="space-y-2.5">
                        <SectionTitle>Plan features</SectionTitle>
                        <div className="text-sm text-slate-500">{features.length === 0 ? "No features added yet." : features.join(" · ")}</div>
                        <div className="flex flex-col gap-2 sm:flex-row">
                            <Input
                                value={featureInput}
                                onChange={(event) => setFeatureInput(event.target.value)}
                                placeholder="e.g. 30 GB SSD Storage"
                                onKeyDown={(event) => {
                                    if (event.key === "Enter") {
                                        event.preventDefault();
                                        addFeature();
                                    }
                                }}
                            />
                            <Button type="button" variant="light" outlined className="shrink-0 px-4" onClick={addFeature}>
                                Add feature
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="sticky bottom-0 bg-white border-t pt-4 mt-6 flex flex-col-reverse sm:flex-row justify-end gap-3 pb-2 px-1 sm:px-3">
                    <Button variant="secondary" type="button" outlined className="w-full sm:w-auto" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button type="submit" className="w-full sm:w-auto">
                        Create plan
                    </Button>
                </div>
            </form>
        </Modal>
    );
}

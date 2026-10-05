import React, { useEffect, useMemo, useState } from "react";
import { Switch, message } from "antd";
import { AlertTriangle, Braces, List, Minus, Plus } from "lucide-react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { formatBillingPeriod, formatCurrency } from "@/data/hostingPlans";
import {
    useCreatePlanMutation,
    useUpdatePlanMutation,
} from "@/features/plans/plansApi";
import {
    JSON_FIELDS,
    LIMIT_FIELDS,
    buildPayload,
    groupServerErrors,
    parseFeatures,
    parseJsonFields,
    parseMonthMap,
    planToForm,
    previewBillingPeriods,
} from "./hostingPlanForm";

const TEXT_FIELDS = {
    prices: "pricesText",
    period_discounts: "discountsText",
    features: "featuresText",
};

const inputClass = (hasError) =>
    `w-full rounded-lg border px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 ${
        hasError
            ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
            : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
    }`;

function FieldError({ id, message: text }) {
    if (!text) return null;

    return (
        <p id={id} className="mt-1 text-xs text-red-600">
            {text}
        </p>
    );
}

function TextField({ id, label, value, onChange, error, helper, type = "text", ...props }) {
    return (
        <div>
            <label htmlFor={id} className="text-sm font-medium text-slate-700">
                {label}
            </label>
            <input
                id={id}
                type={type}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? `${id}-error` : undefined}
                className={`mt-1.5 ${inputClass(error)}`}
                {...props}
            />
            {helper && !error && <p className="mt-1 text-xs text-slate-400">{helper}</p>}
            <FieldError id={`${id}-error`} message={error} />
        </div>
    );
}

function SectionTitle({ children }) {
    return <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{children}</p>;
}

function textToRows(field, text) {
    if (field === "features") {
        const parsed = parseFeatures(text);
        return parsed.error ? { error: parsed.error } : { rows: parsed.value.map((value) => ({ value })) };
    }

    const parsed = parseMonthMap(text, JSON_FIELDS[field]);
    return parsed.error
        ? { error: parsed.error }
        : {
              rows: Object.entries(parsed.value).map(([key, value]) => ({
                  key,
                  value: String(value),
              })),
          };
}

function rowsToText(field, rows) {
    if (field === "features") {
        return JSON.stringify(rows.map((row) => row.value.trim()).filter(Boolean), null, 2);
    }

    const map = {};
    rows.forEach(({ key, value }) => {
        if (String(key).trim() === "" || String(value).trim() === "") return;
        const numeric = Number(value);
        map[String(key).trim()] = Number.isFinite(numeric) ? numeric : value;
    });

    return JSON.stringify(map, null, 2);
}

function JsonField({ field, label, helper, valueLabel, mode, onModeChange, text, onTextChange, rows, onRowsChange, error }) {
    const id = `plan-${field}`;
    const isList = field === "features";

    const updateRow = (index, key, value) =>
        onRowsChange(rows.map((row, i) => (i === index ? { ...row, [key]: value } : row)));

    return (
        <div>
            <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                    <p id={`${id}-label`} className="text-sm font-medium text-slate-700">
                        {label}
                    </p>
                    {helper && <p className="text-xs text-slate-400">{helper}</p>}
                </div>
                <div role="group" aria-label={`${label} editor mode`} className="inline-flex rounded-lg border border-slate-200 p-0.5">
                    {[
                        ["rows", "Rows", List],
                        ["json", "JSON", Braces],
                    ].map(([value, text, Icon]) => (
                        <button
                            key={value}
                            type="button"
                            aria-pressed={mode === value}
                            onClick={() => onModeChange(value)}
                            className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                                mode === value ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-50"
                            }`}
                        >
                            <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                            {text}
                        </button>
                    ))}
                </div>
            </div>

            {mode === "json" ? (
                <textarea
                    id={id}
                    aria-labelledby={`${id}-label`}
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? `${id}-error` : undefined}
                    value={text}
                    onChange={(event) => onTextChange(event.target.value)}
                    spellCheck={false}
                    rows={Math.min(10, Math.max(4, text.split("\n").length))}
                    className={`mt-2 font-mono text-xs leading-relaxed ${inputClass(error)}`}
                />
            ) : (
                <div className="mt-2 space-y-2">
                    {rows.length === 0 && (
                        <p className="rounded-lg border border-dashed border-slate-200 px-3 py-2 text-xs text-slate-400">
                            Nothing added yet.
                        </p>
                    )}
                    {rows.map((row, index) => (
                        <div key={index} className="flex items-center gap-2">
                            {!isList && (
                                <>
                                    <input
                                        type="number"
                                        min={JSON_FIELDS[field].minMonths}
                                        aria-label={`${label} row ${index + 1} months`}
                                        value={row.key}
                                        onChange={(event) => updateRow(index, "key", event.target.value)}
                                        placeholder="Months"
                                        className={`w-28 ${inputClass(false)}`}
                                    />
                                    <span className="text-xs text-slate-400" aria-hidden="true">→</span>
                                </>
                            )}
                            <input
                                type={isList ? "text" : "number"}
                                min={isList ? undefined : 0}
                                step={isList ? undefined : "0.01"}
                                aria-label={`${label} row ${index + 1} ${isList ? "feature" : valueLabel}`}
                                value={row.value}
                                onChange={(event) => updateRow(index, "value", event.target.value)}
                                placeholder={isList ? "e.g. Free SSL" : valueLabel}
                                className={`flex-1 ${inputClass(false)}`}
                            />
                            <button
                                type="button"
                                onClick={() => onRowsChange(rows.filter((_, i) => i !== index))}
                                aria-label={`Remove ${label} row ${index + 1}`}
                                className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                            >
                                <Minus className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => onRowsChange([...rows, isList ? { value: "" } : { key: "", value: "" }])}
                        className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 focus:outline-none focus-visible:underline"
                    >
                        <Plus className="h-3.5 w-3.5" />
                        {isList ? "Add feature" : "Add period"}
                    </button>
                </div>
            )}
            <FieldError id={`${id}-error`} message={error} />
        </div>
    );
}

export default function PlanFormModal({ open, mode = "edit", plan, onClose, onSaved }) {
    const isEdit = mode === "edit";
    const [form, setForm] = useState(() => planToForm(plan));
    const [modes, setModes] = useState({ prices: "rows", period_discounts: "rows", features: "rows" });
    const [rows, setRows] = useState({ prices: [], period_discounts: [], features: [] });
    const [serverErrors, setServerErrors] = useState({});
    const [modeErrors, setModeErrors] = useState({});
    const [createPlan, { isLoading: creating }] = useCreatePlanMutation();
    const [updatePlan, { isLoading: updating }] = useUpdatePlanMutation();
    const saving = creating || updating;

    useEffect(() => {
        if (!open) return;

        const next = planToForm(plan);
        const nextRows = {};
        const nextModes = {};
        Object.entries(TEXT_FIELDS).forEach(([field, textKey]) => {
            const converted = textToRows(field, next[textKey]);
            nextRows[field] = converted.rows ?? [];
            // Invalid stored data (e.g. a list) opens in JSON mode so it can be fixed.
            nextModes[field] = converted.error ? "json" : "rows";
        });

        setForm(next);
        setRows(nextRows);
        setModes(nextModes);
        setServerErrors({});
        setModeErrors({});
    }, [open, plan, mode]);

    const parsed = useMemo(() => parseJsonFields(form), [form]);
    const preview = useMemo(
        () =>
            parsed.prices.error || parsed.period_discounts.error
                ? []
                : previewBillingPeriods(form.monthly_price, parsed.prices.value, parsed.period_discounts.value),
        [form.monthly_price, parsed],
    );

    const setField = (field) => (value) => {
        setForm((current) => ({ ...current, [field]: value }));
        setServerErrors((current) => ({ ...current, [field]: undefined }));
    };

    const setJsonText = (field, text) => {
        setForm((current) => ({ ...current, [TEXT_FIELDS[field]]: text }));
        setServerErrors((current) => ({ ...current, [field]: undefined }));
    };

    const setFieldRows = (field, nextRows) => {
        setRows((current) => ({ ...current, [field]: nextRows }));
        setJsonText(field, rowsToText(field, nextRows));
    };

    const changeMode = (field, nextMode) => {
        if (nextMode === "rows") {
            const converted = textToRows(field, form[TEXT_FIELDS[field]]);
            if (converted.error) {
                setModeErrors((current) => ({ ...current, [field]: `Fix the JSON before switching to rows. ${converted.error}` }));
                return;
            }
            setRows((current) => ({ ...current, [field]: converted.rows }));
        }

        setModeErrors((current) => ({ ...current, [field]: undefined }));
        setModes((current) => ({ ...current, [field]: nextMode }));
    };

    const incompleteRows = (field) =>
        modes[field] === "rows" &&
        rows[field].some((row) =>
            field === "features"
                ? false
                : (String(row.key).trim() === "") !== (String(row.value).trim() === ""),
        );

    const fieldError = (field) =>
        modeErrors[field] ??
        (incompleteRows(field) ? "Fill in both months and value, or remove the row." : null) ??
        parsed[field]?.error ??
        serverErrors[field];

    const canSubmit =
        form.name.trim() !== "" &&
        !parsed.hasErrors &&
        !Object.keys(TEXT_FIELDS).some(incompleteRows) &&
        !saving;

    const submit = async (event) => {
        event.preventDefault();
        if (!canSubmit) return;

        const payload = buildPayload(form, parsed);

        try {
            if (isEdit) {
                await updatePlan({ slug: plan.slug, ...payload }).unwrap();
                message.success("Plan updated");
            } else {
                await createPlan(payload).unwrap();
                message.success("Plan created");
            }
            onSaved?.();
            onClose();
        } catch (error) {
            if (error?.status === 422 && error?.data?.errors) {
                setServerErrors(groupServerErrors(error.data.errors));
            } else {
                message.error(error?.data?.message ?? "The plan could not be saved. Please try again.");
            }
        }
    };

    const title = isEdit ? `Edit ${plan?.name ?? "plan"}` : "Create plan";

    return (
        <Modal
            open={open}
            onCancel={onClose}
            width={760}
            title={title}
            subtitle="Every field here is saved to the plans table and used by registration and checkout."
        >
            <form onSubmit={submit} className="flex max-h-[75vh] flex-col">
                <div className="flex-1 space-y-6 overflow-y-auto pr-2">
                    {plan?.has_invalid_pricing && isEdit && (
                        <div role="alert" className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                            <p>
                                The stored pricing is a list instead of a month-keyed object, so checkout only offers monthly billing.
                                Replace the 0-based keys with month counts, e.g. {'{"12": 2200}'}.
                            </p>
                        </div>
                    )}

                    <div className="space-y-3">
                        <SectionTitle>Basics</SectionTitle>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <TextField id="plan-name" label="Name" value={form.name} onChange={setField("name")} error={serverErrors.name} placeholder="Pro" required />
                            <TextField id="plan-subtitle" label="Subtitle" value={form.subtitle} onChange={setField("subtitle")} error={serverErrors.subtitle} placeholder="For growing student projects" />
                            <TextField id="plan-currency" label="Currency" value={form.currency} onChange={setField("currency")} error={serverErrors.currency} maxLength={3} helper="ISO code, e.g. PHP" />
                            <TextField id="plan-sort-order" label="Sort order" type="number" min="0" value={form.sort_order} onChange={setField("sort_order")} error={serverErrors.sort_order} helper="Lower shows first" />
                        </div>
                        <div className="flex flex-wrap gap-6">
                            <label className="flex items-center gap-2 text-sm text-slate-700">
                                <Switch checked={form.is_active} onChange={setField("is_active")} aria-label="Active" />
                                Active (shown in public pricing)
                            </label>
                            <label className="flex items-center gap-2 text-sm text-slate-700">
                                <Switch checked={form.is_popular} onChange={setField("is_popular")} aria-label="Popular" />
                                Popular badge
                            </label>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <SectionTitle>Pricing</SectionTitle>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <TextField
                                id="plan-monthly-price"
                                label={`Monthly price (${form.currency || "PHP"})`}
                                type="number"
                                min="0"
                                step="0.01"
                                value={form.monthly_price}
                                onChange={setField("monthly_price")}
                                error={serverErrors.monthly_price}
                                helper="Leave empty for a quote-only plan"
                            />
                        </div>
                        {Object.entries(JSON_FIELDS).map(([field, config]) => (
                            <JsonField
                                key={field}
                                field={field}
                                label={config.label}
                                helper={
                                    field === "prices"
                                        ? 'Total charged per term, keyed by months: {"12": 2200, "48": 7000}'
                                        : 'Percent off monthly × months; overrides a period price: {"48": 30}'
                                }
                                valueLabel={config.valueLabel}
                                mode={modes[field]}
                                onModeChange={(next) => changeMode(field, next)}
                                text={form[TEXT_FIELDS[field]]}
                                onTextChange={(text) => setJsonText(field, text)}
                                rows={rows[field]}
                                onRowsChange={(next) => setFieldRows(field, next)}
                                error={fieldError(field)}
                            />
                        ))}

                        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                            <p className="text-xs font-semibold text-slate-700">Checkout will charge</p>
                            {preview.length === 0 ? (
                                <p className="mt-1 text-xs text-slate-500">
                                    {form.monthly_price === "" ? "Quote-only — no online checkout." : "Fix the pricing errors above to see the preview."}
                                </p>
                            ) : (
                                <ul className="mt-2 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                                    {preview.map((row) => (
                                        <li key={row.months} className="flex items-center justify-between gap-2 rounded-md bg-white px-2.5 py-1.5 text-xs">
                                            <span className="text-slate-600">{formatBillingPeriod(row.months)}</span>
                                            <span className="font-semibold text-slate-900">
                                                {formatCurrency(row.total, form.currency || "PHP")}
                                                {row.discountPercent > 0 && (
                                                    <span className="ml-1 font-medium text-emerald-600">−{row.discountPercent}%</span>
                                                )}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <SectionTitle>Limits</SectionTitle>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
                            {LIMIT_FIELDS.map((limit) => (
                                <TextField
                                    key={limit.name}
                                    id={`plan-${limit.name}`}
                                    label={limit.label}
                                    type="number"
                                    min="0"
                                    value={form[limit.name]}
                                    onChange={setField(limit.name)}
                                    error={serverErrors[limit.name]}
                                    helper={limit.helper}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <SectionTitle>Features</SectionTitle>
                        <JsonField
                            field="features"
                            label="Feature list"
                            helper='Shown on pricing cards: ["3 Sites", "Free SSL"]'
                            mode={modes.features}
                            onModeChange={(next) => changeMode("features", next)}
                            text={form.featuresText}
                            onTextChange={(text) => setJsonText("features", text)}
                            rows={rows.features}
                            onRowsChange={(next) => setFieldRows("features", next)}
                            error={fieldError("features")}
                        />
                    </div>
                </div>

                <div className="mt-4 flex flex-col-reverse gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
                    <Button type="button" variant="light" outlined onClick={onClose} disabled={saving}>
                        Cancel
                    </Button>
                    <Button type="submit" loading={saving} disabled={!canSubmit}>
                        {isEdit ? "Save changes" : "Create plan"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
import React, { useEffect, useState } from "react";
import { message } from "antd";
import { Copy, Info } from "lucide-react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { useCreatePlanMutation } from "@/features/plans/plansApi";
import { buildPayload, parseJsonFields, planToForm } from "./hostingPlanForm";

export default function DuplicatePlanSection({ open = false, plan, onCancel, onDone }) {
    const [createPlan, { isLoading }] = useCreatePlanMutation();
    const [error, setError] = useState(null);
    const planName = plan?.name ?? "this plan";

    useEffect(() => {
        if (open) setError(null);
    }, [open]);

    const confirm = async () => {
        setError(null);
        const form = planToForm(plan, { copy: true });
        const parsed = parseJsonFields(form);

        if (parsed.hasErrors) {
            setError("This plan's stored pricing is invalid. Edit and fix it before duplicating.");
            return;
        }

        try {
            await createPlan(buildPayload(form, parsed)).unwrap();
            message.success(`Created "${form.name}" as an inactive copy`);
            onDone?.();
        } catch (err) {
            const errors = err?.data?.errors;
            setError(
                errors?.name?.[0] ??
                    errors?.slug?.[0] ??
                    err?.data?.message ??
                    "The plan could not be duplicated. Please try again.",
            );
        }
    };

    return (
        <Modal open={open} onCancel={onCancel} width={520} title={`Duplicate ${planName}?`}>
            <div className="space-y-6">
                <div className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-blue-500 shadow-sm">
                        <Info className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <p className="text-sm leading-relaxed text-slate-600">
                        "{planName} (Copy)" will be created with the same pricing, limits and features. It starts inactive, so it
                        stays hidden from customers until you enable it.
                    </p>
                </div>

                {error && (
                    <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                        {error}
                    </p>
                )}

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <Button type="button" variant="light" outlined onClick={onCancel} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button type="button" variant="primary" onClick={confirm} loading={isLoading}>
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicate plan
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
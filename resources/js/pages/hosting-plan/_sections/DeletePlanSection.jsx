import React, { useEffect, useState } from "react";
import { message } from "antd";
import { Trash2, TriangleAlert } from "lucide-react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { useDeletePlanMutation } from "@/features/plans/plansApi";

export default function DeletePlanSection({ open = false, plan, onCancel, onDone }) {
    const [deletePlan, { isLoading }] = useDeletePlanMutation();
    const [error, setError] = useState(null);
    const planName = plan?.name ?? "this plan";
    const subscriberCount = plan?.subscriptions_count ?? 0;

    useEffect(() => {
        if (open) setError(null);
    }, [open]);

    const confirm = async () => {
        setError(null);
        try {
            await deletePlan(plan.slug).unwrap();
            message.success("Plan deleted");
            onDone?.();
        } catch (err) {
            setError(
                err?.data?.errors?.plan?.[0] ??
                    err?.data?.message ??
                    "The plan could not be deleted. Please try again.",
            );
        }
    };

    return (
        <Modal open={open} onCancel={onCancel} width={520} title={`Delete ${planName}?`}>
            <div className="space-y-6">
                <div className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-red-500 shadow-sm">
                        <TriangleAlert className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <p className="text-sm leading-relaxed text-slate-600">
                        {subscriberCount > 0
                            ? `${subscriberCount} subscription(s) use this plan, so it cannot be deleted. Disable it instead.`
                            : "This permanently removes the plan. This cannot be undone."}
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
                    <Button type="button" variant="danger" onClick={confirm} loading={isLoading} disabled={subscriberCount > 0}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete plan
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
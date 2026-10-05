import React, { useEffect, useState } from "react";
import { message } from "antd";
import { Power, TriangleAlert } from "lucide-react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { useUpdatePlanMutation } from "@/features/plans/plansApi";

export default function DisablePlanSection({ open = false, plan, onCancel, onDone }) {
    const [updatePlan, { isLoading }] = useUpdatePlanMutation();
    const [error, setError] = useState(null);
    const planName = plan?.name ?? "this plan";
    const subscriberCount = plan?.subscriptions_count ?? 0;
    const enabling = plan ? !plan.is_active : false;

    useEffect(() => {
        if (open) setError(null);
    }, [open]);

    const confirm = async () => {
        setError(null);
        try {
            await updatePlan({ slug: plan.slug, name: plan.name, is_active: enabling }).unwrap();
            message.success(enabling ? "Plan enabled" : "Plan disabled");
            onDone?.();
        } catch (err) {
            setError(err?.data?.message ?? "The plan could not be updated. Please try again.");
        }
    };

    return (
        <Modal open={open} onCancel={onCancel} width={520} title={`${enabling ? "Enable" : "Disable"} ${planName}?`}>
            <div className="space-y-6">
                <div className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white shadow-sm ${enabling ? "text-blue-500" : "text-red-500"}`}>
                        <TriangleAlert className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <p className="text-sm leading-relaxed text-slate-600">
                        {enabling
                            ? "The plan will appear in public pricing, registration and checkout again."
                            : `The plan disappears from public pricing immediately. ${subscriberCount} existing subscriber(s) keep their plan until renewal.`}
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
                    <Button type="button" variant={enabling ? "primary" : "danger"} onClick={confirm} loading={isLoading}>
                        <Power className="mr-2 h-4 w-4" />
                        {enabling ? "Enable plan" : "Disable plan"}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
import React from "react";
import { Power, TriangleAlert } from "lucide-react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

export default function DisablePlanSection({ open = false, plan, onCancel, onDisable }) {
    const planName = plan?.plan_name ?? plan?.name ?? "this plan";
    const subscriberCount = plan?.subscribers ?? plan?.subscriber_count ?? 0;

    return (
        <Modal open={open} onCancel={onCancel} width={520} title={`Disable ${planName}?`}>
            <div className="space-y-6">
                <div className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-red-500 shadow-sm">
                        <TriangleAlert className="h-5 w-5" />
                    </div>
                    <p className="text-sm leading-relaxed text-slate-600">
                        The plan disappears from public pricing immediately. {subscriberCount} existing subscriber(s) keep their plan until renewal.
                    </p>
                </div>

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <Button type="button" variant="light" outlined onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button type="button" variant="primary" className="bg-rose-600 hover:bg-rose-700" onClick={onDisable}>
                        <Power className="mr-2 h-4 w-4" />
                        Disable plan
                    </Button>
                </div>
            </div>
        </Modal>
    );
}

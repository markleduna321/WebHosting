import React from "react";
import { Trash2, TriangleAlert } from "lucide-react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

export default function DeletePlanSection({ open = false, plan, onCancel, onDelete }) {
    const planName = plan?.plan_name ?? plan?.name ?? "this plan";
    const subscriberCount = plan?.subscribers ?? plan?.subscriber_count ?? 0;

    return (
        <Modal open={open} onCancel={onCancel} width={520} title={`Delete ${planName}?`}>
            <div className="space-y-6">
                <div className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-red-500 shadow-sm">
                        <TriangleAlert className="h-5 w-5" />
                    </div>
                    <p className="text-sm leading-relaxed text-slate-600">
                        {subscriberCount} student(s) are on this plan. Deleting it removes it from pricing and reporting.
                    </p>
                </div>

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <Button type="button" variant="light" outlined onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button type="button" variant="primary" className="bg-red-600 hover:bg-red-700" onClick={onDelete}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete plan
                    </Button>
                </div>
            </div>
        </Modal>
    );
}

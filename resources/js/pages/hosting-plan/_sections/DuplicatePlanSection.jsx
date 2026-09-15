import React from "react";
import { Copy, TriangleAlert } from "lucide-react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

export default function DuplicatePlanSection({ open = false, plan, onCancel, onDuplicate }) {
    const planName = plan?.plan_name ?? plan?.name ?? "this plan";

    return (
        <Modal open={open} onCancel={onCancel} width={520} title={`Duplicate ${planName}?`}>
            <div className="space-y-6">
                <div className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-red-500 shadow-sm">
                        <TriangleAlert className="h-5 w-5" />
                    </div>
                    <p className="text-sm leading-relaxed text-slate-600">
                        A copy of {planName} will be created with the same pricing, limits and feature flags.
                    </p>
                </div>

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <Button type="button" variant="light" outlined onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button type="button" variant="primary" className="bg-blue-600 hover:bg-blue-700" onClick={onDuplicate}>
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicate plan
                    </Button>
                </div>
            </div>
        </Modal>
    );
}

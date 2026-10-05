import { Modal, message } from "antd";
import { TriangleAlert } from "lucide-react";
import React, { useState } from "react";
import Button from "@/components/ui/Button";
import { useDeletePlanMutation } from "@/features/plans/plansApi";

export default function DeletePlanModal({ plan, onClose }) {
	const [deletePlan, { isLoading }] = useDeletePlanMutation();
	const [serverError, setServerError] = useState(null);

	const confirmDelete = async () => {
		setServerError(null);

		try {
			await deletePlan(plan.slug).unwrap();
			message.success("Plan deleted");
			onClose();
		} catch (err) {
			setServerError(
				err?.data?.errors?.plan?.[0] ||
					err?.data?.message ||
					"Failed to delete plan",
			);
		}
	};

	return (
		<Modal
			title="Delete plan"
			open={Boolean(plan)}
			onCancel={onClose}
			footer={null}
			destroyOnClose
		>
			<div className="space-y-4 pt-2">
				<div className="flex items-start gap-3">
					<TriangleAlert className="h-5 w-5 shrink-0 text-red-500" />
					<p className="text-sm text-gray-700">
						You are about to permanently delete the plan{" "}
						<span className="font-semibold">{plan?.name}</span>.
						{plan?.subscriptions_count > 0 && (
							<span className="mt-1 block text-red-600">
								This plan has {plan.subscriptions_count} active
								subscription(s) and cannot be deleted.
								Deactivate it instead.
							</span>
						)}
					</p>
				</div>

				{serverError && (
					<p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
						{serverError}
					</p>
				)}

				<div className="flex justify-end gap-2">
					<Button variant="light" outlined size="sm" onClick={onClose}>
						Cancel
					</Button>
					<Button
						variant="danger"
						size="sm"
						onClick={confirmDelete}
						loading={isLoading}
						disabled={
							isLoading || plan?.subscriptions_count > 0
						}
					>
						Delete plan
					</Button>
				</div>
			</div>
		</Modal>
	);
}

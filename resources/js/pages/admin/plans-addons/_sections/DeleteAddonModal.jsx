import { Modal, message } from "antd";
import { TriangleAlert } from "lucide-react";
import React, { useState } from "react";
import Button from "@/components/ui/Button";
import { useDeleteAddonMutation } from "@/features/addons/addonsApi";

export default function DeleteAddonModal({ addon, onClose }) {
	const [deleteAddon, { isLoading }] = useDeleteAddonMutation();
	const [serverError, setServerError] = useState(null);

	const confirmDelete = async () => {
		setServerError(null);

		try {
			await deleteAddon(addon.id).unwrap();
			message.success("Add-on deleted");
			onClose();
		} catch (err) {
			setServerError(
				err?.data?.errors?.addon?.[0] ||
					err?.data?.message ||
					"Failed to delete add-on",
			);
		}
	};

	return (
		<Modal
			title="Delete add-on"
			open={Boolean(addon)}
			onCancel={onClose}
			footer={null}
			destroyOnClose
		>
			<div className="space-y-4 pt-2">
				<div className="flex items-start gap-3">
					<TriangleAlert className="h-5 w-5 shrink-0 text-red-500" />
					<p className="text-sm text-gray-700">
						You are about to permanently delete the add-on{" "}
						<span className="font-semibold">{addon?.name}</span>.
						This action cannot be undone.
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
						disabled={isLoading}
					>
						Delete add-on
					</Button>
				</div>
			</div>
		</Modal>
	);
}

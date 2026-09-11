import { Modal, message } from "antd";
import { TriangleAlert } from "lucide-react";
import React, { useState } from "react";
import Button from "@/components/ui/Button";
import { useDeletePermissionMutation } from "@/features/permissions/permissionsApi";

export default function DeletePermissionModal({ permission, onClose }) {
    const [deletePermission, { isLoading }] = useDeletePermissionMutation();
    const [serverError, setServerError] = useState(null);

    const confirmDelete = async () => {
        setServerError(null);

        try {
            await deletePermission(permission.id).unwrap();
            message.success("Permission deleted");
            onClose();
        } catch (err) {
            setServerError(
                err?.data?.errors?.permission?.[0] ||
                    err?.data?.message ||
                    "Failed to delete permission",
            );
        }
    };

    return (
        <Modal
            title="Delete permission"
            open={Boolean(permission)}
            onCancel={onClose}
            footer={null}
            destroyOnClose
        >
            <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                    <TriangleAlert className="h-5 w-5 shrink-0 text-red-500" />
                    <p className="text-sm text-gray-700">
                        You are about to permanently delete the permission{" "}
                        <span className="font-semibold">
                            {permission?.name}
                        </span>
                        .
                        {permission?.roles_count > 0 && (
                            <span className="mt-1 block text-red-600">
                                It is attached to {permission.roles_count}{" "}
                                role(s) and cannot be deleted until detached.
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
                        disabled={isLoading || permission?.roles_count > 0}
                    >
                        Delete permission
                    </Button>
                </div>
            </div>
        </Modal>
    );
}

import { Modal, message } from "antd";
import { TriangleAlert } from "lucide-react";
import React, { useState } from "react";
import Button from "@/components/ui/Button";
import { useDeleteRoleMutation } from "@/features/roles/rolesApi";

export default function DeleteRoleModal({ role, onClose }) {
    const [deleteRole, { isLoading }] = useDeleteRoleMutation();
    const [serverError, setServerError] = useState(null);

    const confirmDelete = async () => {
        setServerError(null);

        try {
            await deleteRole(role.id).unwrap();
            message.success("Role deleted");
            onClose();
        } catch (err) {
            setServerError(
                err?.data?.errors?.role?.[0] ||
                    err?.data?.message ||
                    "Failed to delete role",
            );
        }
    };

    return (
        <Modal
            title="Delete role"
            open={Boolean(role)}
            onCancel={onClose}
            footer={null}
            destroyOnClose
        >
            <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                    <TriangleAlert className="h-5 w-5 shrink-0 text-red-500" />
                    <p className="text-sm text-gray-700">
                        You are about to permanently delete the role{" "}
                        <span className="font-semibold">{role?.name}</span>.
                        {role?.users_count > 0 && (
                            <span className="mt-1 block text-red-600">
                                This role is assigned to {role.users_count}{" "}
                                user(s) and cannot be deleted until they are
                                reassigned.
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
                        disabled={isLoading || role?.users_count > 0}
                    >
                        Delete role
                    </Button>
                </div>
            </div>
        </Modal>
    );
}

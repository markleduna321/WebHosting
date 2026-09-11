import { Modal, message } from "antd";
import React, { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import {
    useCreatePermissionMutation,
    useUpdatePermissionMutation,
} from "@/features/permissions/permissionsApi";

export default function PermissionFormModal({ open, permission, onClose }) {
    const isEdit = Boolean(permission);
    const [name, setName] = useState("");
    const [errors, setErrors] = useState({});

    const [createPermission, { isLoading: creating }] =
        useCreatePermissionMutation();
    const [updatePermission, { isLoading: updating }] =
        useUpdatePermissionMutation();
    const saving = creating || updating;

    useEffect(() => {
        if (open) {
            setName(permission?.name ?? "");
            setErrors({});
        }
    }, [open, permission]);

    const submit = async () => {
        setErrors({});

        try {
            if (isEdit) {
                await updatePermission({ id: permission.id, name }).unwrap();
                message.success("Permission updated");
            } else {
                await createPermission({ name }).unwrap();
                message.success("Permission created");
            }

            onClose();
        } catch (err) {
            if (err?.status === 422 && err?.data?.errors) {
                setErrors(err.data.errors);
            } else {
                message.error(err?.data?.message || "Something went wrong");
            }
        }
    };

    return (
        <Modal
            title={
                isEdit
                    ? `Edit permission: ${permission?.name}`
                    : "Create new permission"
            }
            open={open}
            onCancel={onClose}
            footer={null}
            destroyOnClose
        >
            <div className="space-y-5 pt-2">
                <div>
                    <label
                        htmlFor="permission-name"
                        className="mb-1.5 block text-sm font-medium text-gray-700"
                    >
                        Permission name
                    </label>
                    <input
                        id="permission-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. invoice-create"
                        aria-invalid={Boolean(errors.name)}
                        className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                            errors.name
                                ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                                : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        }`}
                    />
                    <p className="mt-1 text-xs text-gray-500">
                        Use kebab-case: module name, then the action (e.g.
                        "invoice-create").
                    </p>
                    {errors.name && (
                        <p className="mt-1 text-xs text-red-600">
                            {errors.name[0]}
                        </p>
                    )}
                </div>

                <div className="flex justify-end gap-2 pt-1">
                    <Button variant="light" outlined size="sm" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        size="sm"
                        onClick={submit}
                        loading={saving}
                        disabled={saving || !name.trim()}
                    >
                        {isEdit ? "Save changes" : "Create permission"}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}

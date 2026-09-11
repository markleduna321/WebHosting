import { Modal, message } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import { useGetPermissionsQuery } from "@/features/permissions/permissionsApi";
import {
    useCreateRoleMutation,
    useUpdateRoleMutation,
} from "@/features/roles/rolesApi";

function groupByModule(permissions = []) {
    return permissions.reduce((groups, permission) => {
        const idx = permission.name.lastIndexOf("-");
        const moduleName = idx > 0 ? permission.name.slice(0, idx) : "other";
        (groups[moduleName] = groups[moduleName] || []).push(permission);
        return groups;
    }, {});
}

export default function RoleFormModal({ open, role, onClose }) {
    const isEdit = Boolean(role);
    const [name, setName] = useState("");
    const [selected, setSelected] = useState([]);
    const [errors, setErrors] = useState({});

    const { data: permissionData, isLoading: loadingPermissions } =
        useGetPermissionsQuery({ perPage: 100 }, { skip: !open });

    const [createRole, { isLoading: creating }] = useCreateRoleMutation();
    const [updateRole, { isLoading: updating }] = useUpdateRoleMutation();
    const saving = creating || updating;

    useEffect(() => {
        if (open) {
            setName(role?.name ?? "");
            setSelected(role?.permissions ?? []);
            setErrors({});
        }
    }, [open, role]);

    const grouped = useMemo(
        () => groupByModule(permissionData?.data),
        [permissionData],
    );

    const togglePermission = (permissionName) => {
        setSelected((prev) =>
            prev.includes(permissionName)
                ? prev.filter((p) => p !== permissionName)
                : [...prev, permissionName],
        );
    };

    const submit = async () => {
        setErrors({});

        try {
            const payload = { name, permissions: selected };

            if (isEdit) {
                await updateRole({ id: role.id, ...payload }).unwrap();
                message.success("Role updated");
            } else {
                await createRole(payload).unwrap();
                message.success("Role created");
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
            title={isEdit ? `Edit role: ${role?.name}` : "Create new role"}
            open={open}
            onCancel={onClose}
            footer={null}
            destroyOnClose
        >
            <div className="space-y-5 pt-2">
                <div>
                    <label
                        htmlFor="role-name"
                        className="mb-1.5 block text-sm font-medium text-gray-700"
                    >
                        Role name
                    </label>
                    <input
                        id="role-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. support-agent"
                        aria-invalid={Boolean(errors.name)}
                        className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                            errors.name
                                ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                                : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        }`}
                    />
                    {errors.name && (
                        <p className="mt-1 text-xs text-red-600">
                            {errors.name[0]}
                        </p>
                    )}
                </div>

                <div>
                    <p className="mb-2 text-sm font-medium text-gray-700">
                        Permissions
                    </p>
                    {loadingPermissions ? (
                        <p className="text-sm text-gray-500">
                            Loading permissions...
                        </p>
                    ) : (
                        <div className="max-h-64 space-y-4 overflow-y-auto rounded-md border border-gray-200 p-3">
                            {Object.entries(grouped).map(
                                ([moduleName, permissions]) => (
                                    <fieldset key={moduleName}>
                                        <legend className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                            {moduleName}
                                        </legend>
                                        <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                                            {permissions.map((permission) => (
                                                <label
                                                    key={permission.id}
                                                    className="flex items-center gap-2 text-sm text-gray-700 select-none"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={selected.includes(
                                                            permission.name,
                                                        )}
                                                        onChange={() =>
                                                            togglePermission(
                                                                permission.name,
                                                            )
                                                        }
                                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                    />
                                                    {permission.name}
                                                </label>
                                            ))}
                                        </div>
                                    </fieldset>
                                ),
                            )}
                        </div>
                    )}
                    {errors.permissions && (
                        <p className="mt-1 text-xs text-red-600">
                            {errors.permissions[0]}
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
                        {isEdit ? "Save changes" : "Create role"}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}

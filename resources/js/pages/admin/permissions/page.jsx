import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import PermissionsTableSection from "./_sections/PermissionsTableSection";
import PermissionFormModal from "./_sections/PermissionFormModal";
import DeletePermissionModal from "./_sections/DeletePermissionModal";
import { useGetPermissionsQuery } from "@/features/permissions/permissionsApi";

export default function Page() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [formOpen, setFormOpen] = useState(false);
    const [editingPermission, setEditingPermission] = useState(null);
    const [deletingPermission, setDeletingPermission] = useState(null);

    const { data, isLoading, isFetching } = useGetPermissionsQuery({
        page,
        search,
    });

    const openCreate = () => {
        setEditingPermission(null);
        setFormOpen(true);
    };

    const openEdit = (permission) => {
        setEditingPermission(permission);
        setFormOpen(true);
    };

    const handleSearch = (value) => {
        setSearch(value);
        setPage(1);
    };

    return (
        <div className="space-y-6">
            <PermissionsTableSection
                permissions={data?.data}
                meta={data?.meta}
                isLoading={isLoading}
                isFetching={isFetching}
                search={search}
                onSearch={handleSearch}
                onPageChange={setPage}
                onCreate={openCreate}
                onEdit={openEdit}
                onDelete={setDeletingPermission}
            />

            <PermissionFormModal
                open={formOpen}
                permission={editingPermission}
                onClose={() => setFormOpen(false)}
            />

            <DeletePermissionModal
                permission={deletingPermission}
                onClose={() => setDeletingPermission(null)}
            />
        </div>
    );
}

Page.layout = (page) => (
    <MainLayout
        title="Permissions"
        subtitle="Define the actions roles can be granted"
    >
        {page}
    </MainLayout>
);

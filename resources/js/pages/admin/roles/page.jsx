import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import RolesTableSection from "./_sections/RolesTableSection";
import RoleFormModal from "./_sections/RoleFormModal";
import DeleteRoleModal from "./_sections/DeleteRoleModal";
import { useGetRolesQuery } from "@/features/roles/rolesApi";

export default function Page() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [formOpen, setFormOpen] = useState(false);
    const [editingRole, setEditingRole] = useState(null);
    const [deletingRole, setDeletingRole] = useState(null);

    const { data, isLoading, isFetching } = useGetRolesQuery({ page, search });

    const openCreate = () => {
        setEditingRole(null);
        setFormOpen(true);
    };

    const openEdit = (role) => {
        setEditingRole(role);
        setFormOpen(true);
    };

    const handleSearch = (value) => {
        setSearch(value);
        setPage(1);
    };

    return (
        <div className="space-y-6">
            <RolesTableSection
                roles={data?.data}
                meta={data?.meta}
                isLoading={isLoading}
                isFetching={isFetching}
                search={search}
                onSearch={handleSearch}
                onPageChange={setPage}
                onCreate={openCreate}
                onEdit={openEdit}
                onDelete={setDeletingRole}
            />

            <RoleFormModal
                open={formOpen}
                role={editingRole}
                onClose={() => setFormOpen(false)}
            />

            <DeleteRoleModal
                role={deletingRole}
                onClose={() => setDeletingRole(null)}
            />
        </div>
    );
}

Page.layout = (page) => (
    <MainLayout title="Roles" subtitle="Create roles and assign permissions">
        {page}
    </MainLayout>
);

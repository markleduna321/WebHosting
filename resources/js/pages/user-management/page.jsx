import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import AdminHeaderSection from "@/Layouts/AdminHeaderSection";
import UsersTableSection from "./_sections/UsersTableSection";

export default function Page() {
    return (
        <div className="space-y-4">
            <AdminHeaderSection href="/admin/user-management" />
            <UsersTableSection />
        </div>
    );
}

Page.layout = (page) => (
    <MainLayout title="User Management" subtitle={page.props.auth?.user?.name}>
        {page}
    </MainLayout>
);
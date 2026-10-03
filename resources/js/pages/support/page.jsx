import { Head } from "@inertiajs/react";
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import SupportHomeSection from "./_sections/SupportHomeSection";

export default function Page({ auth }) {
    return (
        <>
            <Head title="Support" />
            <SupportHomeSection isAuthenticated={Boolean(auth?.user)} />
        </>
    );
}

Page.layout = (page) =>
    page.props.auth?.user ? (
        <MainLayout title="Support" subtitle="Caleho Host customer support">{page}</MainLayout>
    ) : page;

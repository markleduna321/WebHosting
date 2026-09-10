import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import FileDatabaseLayout from "@/components/layout/FileDatabaseLayout";
import SearchSection from "./sections/search-section";
import TableSection from "./sections/table-section";

export default function Page() {
    return (
        <div className="space-y-4">
            <SearchSection />
            <TableSection />
        </div>
    );
}

Page.layout = (page) => (
    <MainLayout title="File Manager">
        <FileDatabaseLayout>{page}</FileDatabaseLayout>
    </MainLayout>
);

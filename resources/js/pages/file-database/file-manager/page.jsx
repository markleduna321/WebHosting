import React from "react";
import FileDatabaseLayout from "../layout";
import SearchSection from "./sections/search-section";
import TableSection from "./sections/table-section";

export default function Page() {
    return (
        <FileDatabaseLayout>
            <div className="space-y-4">
             <SearchSection/>
             <TableSection/>
            </div>
        </FileDatabaseLayout>
    );
}

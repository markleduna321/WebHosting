import React from "react";
import Layout from "../layout";
import TabsSection from "./sections/tabs-section";

export default function AccountBillingLayout({ children }) {
    return (
        <Layout>
            <div className="p-6 bg-slate-50 min-h-screen">
                <TabsSection />
                <div className="mt-4">{children}</div>
            </div>
        </Layout>
    );
}

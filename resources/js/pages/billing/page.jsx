import React from "react";
import Layout from "../layout";

export default function Page() {
    return (
        <Layout title="Billing" subtitle="Manage your subscription and payments">
            <div className="rounded-xl border border-gray-200 bg-white p-6 text-center">
                <p className="text-sm font-semibold text-slate-900">
                    Billing
                </p>
                <p className="mt-1 text-sm text-slate-500">
                    This section is coming soon.
                </p>
            </div>
        </Layout>
    );
}

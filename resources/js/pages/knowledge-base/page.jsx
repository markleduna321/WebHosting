import React from "react";
import Layout from "../layout";

export default function Page() {
    return (
        <Layout title="Knowledge Base" subtitle="Guides and documentation">
            <div className="rounded-xl border border-gray-200 bg-white p-6 text-center">
                <p className="text-sm font-semibold text-slate-900">
                    Knowledge Base
                </p>
                <p className="mt-1 text-sm text-slate-500">
                    This section is coming soon.
                </p>
            </div>
        </Layout>
    );
}

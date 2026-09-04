import React from "react";
import SiteDomainLayout from "../layout";

export default function Page() {
    return (
        <SiteDomainLayout>
            <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
                <h2 className="text-lg font-semibold mb-2">
                    Domains & SSL Certificates
                </h2>
                <p className="text-gray-600 text-sm">
                    Configure custom domains, DNS records, and SSL
                    certificates.
                </p>
            </div>
        </SiteDomainLayout>
    );
}

import React from "react";
import SiteDomainLayout from "../layout";
import SiteDomainCardSection from "./sections/site-domain-card-section";

export default function Page() {
    return (
        <SiteDomainLayout>
            <SiteDomainCardSection />
        </SiteDomainLayout>
    );
}

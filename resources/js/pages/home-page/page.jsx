import { Head } from '@inertiajs/react';
import NavBarSection from './_sections/NavBarSection';
import HeroSection from './_sections/HeroSection';
import HostPlanSection from './_sections/HostPlanSection';
import FeatureSection from './_sections/FeatureSection';
import UseCasesSection from './_sections/UseCasesSection';
import TestimonialSection from './_sections/TestimonialSection';
import AboutUsSection from './_sections/AboutUsSection';
import FooterSection from './_sections/FooterSection';
import FaqsSection from './_sections/FaqsSection';

export default function HomePage({ plans }) {
    return (
        <>
            <Head title="CALEHO Host — Simple & Reliable Web Hosting" />
            <NavBarSection />
            <main>
                <HeroSection />
                <HostPlanSection plans={plans} />
                <FeatureSection />
                <UseCasesSection />
                <TestimonialSection />
                <FaqsSection/>
                <AboutUsSection />
            </main>
            <FooterSection />
        </>
    );
}

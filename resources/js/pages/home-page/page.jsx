import { Head } from '@inertiajs/react';
import Navbar from './_sections/Navbar';
import HeroSection from './_sections/HeroSection';
import StatsBar from './_sections/StatsBar';
import PricingSection from './_sections/PricingSection';
import PartnersSection from './_sections/PartnersSection';
import ReviewsSection from './_sections/ReviewsSection';
import Footer from './_sections/Footer';

export default function HomePage() {
    return (
        <>
            <Head title="Home" />
            <Navbar />
            <main>
                <HeroSection />
                <StatsBar />
                <PricingSection />
                <PartnersSection />
                <ReviewsSection />
            </main>
            <Footer />
        </>
    );
}

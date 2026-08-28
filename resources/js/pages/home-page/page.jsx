import React from 'react'
import NavBarSection from './sections/nav-bar-section'
import HeroSection from './sections/hero-section'
import HostPlan from './sections/host-plan'
import FeatureSection from './sections/feature-section'
import UseCasesSection from './sections/use-cases-section'
import TestimonialSection from './sections/testimonial-section'
import AboutUsSection from './sections/about-us-section'
import FooterSection from './sections/footer-section'

export default function Page() {
  return (
    <div className="bg-white dark:bg-slate-950">
      <div className="sticky top-0 z-50">
         <NavBarSection />
      </div>
       
        <HeroSection /> 
        <HostPlan />
        <FeatureSection/>
        <UseCasesSection />
        <TestimonialSection />
        <AboutUsSection />
        <FooterSection />
    </div>
  )
}

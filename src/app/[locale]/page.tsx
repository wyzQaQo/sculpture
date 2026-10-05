'use client';

import dynamic from 'next/dynamic';

const Hero = dynamic(() => import('@/components/sections/Hero'));
const SculptureCategories = dynamic(() => import('@/components/sections/SculptureCategories'));
const WhyUs = dynamic(() => import('@/components/sections/WhyUs'));
const CaseStudiesSection = dynamic(() => import('@/components/sections/CaseStudiesSection'));
const Process = dynamic(() => import('@/components/sections/Process'));
const CTASection = dynamic(() => import('@/components/sections/CTASection'));

export default function HomePage() {
  return (
    <>
      <Hero />
      <SculptureCategories />
      <WhyUs />
      <CaseStudiesSection />
      <Process />
      <CTASection />
    </>
  );
}

export const dynamicParams = false;
'use client';

import { Link } from '@/i18n/navigation';
import FadeContent from '@/components/react-bits/Animations/FadeContent';
import ScrollReveal from '@/components/react-bits/TextAnimations/ScrollReveal';
import SpotlightCard from '@/components/react-bits/Components/SpotlightCard';
import { installationServices } from '@/data/content';

export default function InstallationPage() {
  return (
    <div className="min-h-screen pt-32 pb-32 bg-black">
      <div className="max-w-7xl mx-auto px-6">
        <FadeContent blur={true} duration={1000} className="text-center mb-20">
          <ScrollReveal containerClassName="text-5xl sm:text-6xl font-bold text-white mb-6 tracking-tight" textClassName="block">
            Global Installation Services
          </ScrollReveal>
          <p className="text-white/40 text-lg max-w-3xl mx-auto">
            Professional on-site installation teams with experience in over 40 countries. 
            We handle everything from customs clearance to final alignment.
          </p>
        </FadeContent>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {installationServices.map((service, i) => (
            <FadeContent key={service.title} blur={true} duration={800} delay={i * 100}>
              <SpotlightCard className="h-full">
                <span className="text-2xl font-black text-white/10 mb-4 block">{(i + 1).toString().padStart(2, '0')}</span>
                <h3 className="text-lg font-bold text-white mb-3">{service.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{service.description}</p>
              </SpotlightCard>
            </FadeContent>
          ))}
        </div>

        <FadeContent blur={true} duration={1000} className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Planning a Large-Scale Installation?</h2>
          <p className="text-white/40 mb-8">Contact our logistics team for a site assessment.</p>
          <Link
            href="/contact"
            className="inline-flex px-10 py-5 bg-white text-black text-lg font-bold rounded-full hover:bg-slate-200 transition-all"
          >
            Request Installation Support &rarr;
          </Link>
        </FadeContent>
      </div>
    </div>
  );
}

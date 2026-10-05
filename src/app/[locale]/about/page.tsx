export const dynamicParams = false;
'use client';

import { useTranslations } from 'next-intl';
import FadeContent from '@/components/react-bits/Animations/FadeContent';
import ScrollReveal from '@/components/react-bits/TextAnimations/ScrollReveal';
import { whyUsStats, processSteps } from '@/data/content';

export default function AboutPage() {
  const t = useTranslations('why_us');

  return (
    <div className="min-h-screen pt-32 pb-32 bg-black">
      <div className="max-w-7xl mx-auto px-6">
        <FadeContent blur={true} duration={1000} className="text-center mb-20">
          <ScrollReveal containerClassName="text-5xl sm:text-6xl font-bold text-white mb-6 tracking-tight" textClassName="block">
            Global Public Art Engineering
          </ScrollReveal>
          <p className="text-white/40 text-lg max-w-3xl mx-auto">
            For over 20 years, ArtisanSteel has been engineering landmark stainless steel sculptures that define city skylines, 
            hotel entrances, and commercial spaces across 40+ countries.
          </p>
        </FadeContent>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {whyUsStats.map((stat, i) => (
            <FadeContent key={stat.label} blur={true} duration={800} delay={i * 100}>
              <div className="text-center p-8 rounded-2xl border border-white/5 bg-white/[0.02]">
                <div className="text-4xl sm:text-5xl font-black text-white mb-2">
                  {stat.value}<span className="text-2xl text-white/40">{stat.suffix}</span>
                </div>
                <p className="text-white/40 text-sm uppercase tracking-wider">{stat.label}</p>
              </div>
            </FadeContent>
          ))}
        </div>

        <FadeContent blur={true} duration={1000} className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-8">Our Process</h2>
        </FadeContent>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {processSteps.map((step, i) => (
            <FadeContent key={step.step} blur={true} duration={800} delay={i * 100}>
              <div className="p-8 rounded-2xl border border-white/5 hover:border-white/10 transition-all duration-500 bg-white/[0.02]">
                <span className="text-5xl font-black text-white/5 mb-4 block">{step.step}</span>
                <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{step.description}</p>
              </div>
            </FadeContent>
          ))}
        </div>
      </div>
    </div>
  );
}

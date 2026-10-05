'use client';

import { useTranslations } from 'next-intl';
import FadeContent from '@/components/react-bits/Animations/FadeContent';
import ScrollReveal from '@/components/react-bits/TextAnimations/ScrollReveal';
import Counter from '@/components/react-bits/Components/Counter';
import { whyUsStats } from '@/data/content';

export default function WhyUs() {
  const t = useTranslations('why_us');

  return (
    <section className="relative py-32 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6">
        <FadeContent blur={true} duration={1000} className="text-center mb-20">
          <ScrollReveal containerClassName="text-5xl sm:text-6xl font-bold text-white mb-6 tracking-tight" textClassName="block">
            {t('title')}
          </ScrollReveal>
        </FadeContent>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {whyUsStats.map((stat, i) => (
            <FadeContent key={stat.label} blur={true} duration={800} delay={i * 150}>
              <div className="text-center group">
                <div className="mb-3 text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/30">
                  <Counter from={0} to={parseInt(stat.value)} />
                  <span className="text-3xl">{stat.suffix}</span>
                </div>
                <p className="text-white/40 text-sm uppercase tracking-widest">{stat.label}</p>
              </div>
            </FadeContent>
          ))}
        </div>
      </div>
    </section>
  );
}

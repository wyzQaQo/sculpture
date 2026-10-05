'use client';

import { useTranslations } from 'next-intl';
import FadeContent from '@/components/react-bits/Animations/FadeContent';
import ScrollReveal from '@/components/react-bits/TextAnimations/ScrollReveal';
import { processSteps } from '@/data/content';

export default function Process() {
  const t = useTranslations('process');

  return (
    <section className="relative py-32 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6">
        <FadeContent blur={true} duration={1000} className="text-center mb-20">
          <ScrollReveal containerClassName="text-5xl sm:text-6xl font-bold text-white mb-6 tracking-tight" textClassName="block">
            {t('title')}
          </ScrollReveal>
          <p className="text-white/40 text-lg">{t('subtitle')}</p>
        </FadeContent>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {processSteps.map((step, i) => (
            <FadeContent key={step.step} blur={true} duration={800} delay={i * 100}>
              <div className="relative group p-8 rounded-2xl border border-white/5 hover:border-white/10 transition-all duration-500 bg-white/[0.02] hover:bg-white/[0.04]">
                <span className="text-6xl font-black text-white/5 absolute top-4 right-6 group-hover:text-white/10 transition-colors">{step.step}</span>
                <h3 className="text-xl font-bold text-white mb-3 relative z-10">{step.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed relative z-10">{step.description}</p>
              </div>
            </FadeContent>
          ))}
        </div>
      </div>
    </section>
  );
}

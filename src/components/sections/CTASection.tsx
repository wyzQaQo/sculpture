'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import FadeContent from '@/components/react-bits/Animations/FadeContent';
import GradientText from '@/components/react-bits/TextAnimations/GradientText';

export default function CTASection() {
  const t = useTranslations('cta');

  return (
    <section className="relative py-40 bg-black overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03),transparent)]" />
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <FadeContent blur={true} duration={1200}>
          <GradientText
            colors={['#e2e8f0', '#ffffff', '#cbd5e1', '#94a3b8']}
            animationSpeed={6}
            showBorder={false}
            direction="horizontal"
            className="text-5xl sm:text-6xl md:text-7xl font-bold mb-8 tracking-tight"
          >
            {t('title')}
          </GradientText>
          <p className="text-white/40 text-xl mb-12 max-w-2xl mx-auto">{t('subtitle')}</p>
          <Link
            href="/contact"
            className="inline-flex px-10 py-5 bg-white text-black text-lg font-bold rounded-full hover:bg-slate-200 transition-all shadow-2xl shadow-white/20 hover:shadow-white/30"
          >
            {t('button')} &rarr;
          </Link>
        </FadeContent>
      </div>
    </section>
  );
}

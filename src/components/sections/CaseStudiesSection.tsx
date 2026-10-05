'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import FadeContent from '@/components/react-bits/Animations/FadeContent';
import ScrollReveal from '@/components/react-bits/TextAnimations/ScrollReveal';
import SpotlightCard from '@/components/react-bits/Components/SpotlightCard';
import { ArrowUpRight } from 'lucide-react';
import { caseStudies } from '@/data/content';

export default function CaseStudiesSection() {
  const t = useTranslations('case_studies');

  return (
    <section className="relative py-32 bg-black">
      <div className="max-w-7xl mx-auto px-6">
        <FadeContent blur={true} duration={1000} className="text-center mb-20">
          <ScrollReveal containerClassName="text-5xl sm:text-6xl font-bold text-white mb-6 tracking-tight" textClassName="block">
            {t('title')}
          </ScrollReveal>
          <p className="text-white/40 text-lg">{t('subtitle')}</p>
        </FadeContent>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {caseStudies.slice(0, 4).map((study, i) => (
            <FadeContent key={study.id} blur={true} duration={800} delay={i * 150}>
              <Link href={`/case-studies/${study.id}`} className="block group">
                <SpotlightCard className="h-full">
                  <div className="aspect-[16/10] rounded-xl overflow-hidden mb-6">
                    <img src={study.image} alt={study.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs text-white/30 uppercase tracking-wider">{study.location}</span>
                    <span className="text-xs text-white/10">|</span>
                    <span className="text-xs text-white/30">{study.year}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-slate-300 transition-colors">{study.title}</h3>
                  <p className="text-white/40 text-sm line-clamp-2">{study.description}</p>
                  <div className="mt-4 flex items-center gap-1 text-white/30 group-hover:text-white transition-colors text-sm">
                    View Case Study <ArrowUpRight size={14} />
                  </div>
                </SpotlightCard>
              </Link>
            </FadeContent>
          ))}
        </div>

        <FadeContent className="text-center mt-12">
          <Link
            href="/case-studies"
            className="inline-flex px-8 py-4 border border-white/10 text-white rounded-full hover:bg-white/5 transition-all text-sm font-semibold"
          >
            View All Projects &rarr;
          </Link>
        </FadeContent>
      </div>
    </section>
  );
}

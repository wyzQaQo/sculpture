'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import FadeContent from '@/components/react-bits/Animations/FadeContent';
import ScrollReveal from '@/components/react-bits/TextAnimations/ScrollReveal';
import SpotlightCard from '@/components/react-bits/Components/SpotlightCard';
import { ArrowUpRight } from 'lucide-react';
import { caseStudies } from '@/data/content';

export default function CaseStudiesPage() {
  const t = useTranslations('case_studies');

  return (
    <div className="min-h-screen pt-32 pb-32 bg-black">
      <div className="max-w-7xl mx-auto px-6">
        <FadeContent blur={true} duration={1000} className="text-center mb-20">
          <ScrollReveal containerClassName="text-5xl sm:text-6xl font-bold text-white mb-6 tracking-tight" textClassName="block">
            {t('title')}
          </ScrollReveal>
          <p className="text-white/40 text-lg">{t('subtitle')}</p>
        </FadeContent>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {caseStudies.map((study, i) => (
            <FadeContent key={study.id} blur={true} duration={800} delay={i * 150}>
              <Link href={`/case-studies/${study.id}`} className="block group">
                <SpotlightCard className="h-full p-0 overflow-hidden">
                  <div className="aspect-[16/9] overflow-hidden">
                    <img src={study.image} alt={study.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className="p-8">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs px-2 py-1 rounded-full bg-white/5 text-white/50 border border-white/5">{study.location}</span>
                      <span className="text-xs text-white/30">{study.year}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-slate-300 transition-colors">{study.title}</h3>
                    <p className="text-white/40 text-sm leading-relaxed mb-6">{study.description}</p>
                    <div className="flex items-center gap-1 text-white/30 group-hover:text-white transition-colors text-sm font-semibold">
                      Read Full Case Study <ArrowUpRight size={16} />
                    </div>
                  </div>
                </SpotlightCard>
              </Link>
            </FadeContent>
          ))}
        </div>
      </div>
    </div>
  );
}

export const dynamicParams = false;
'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import FadeContent from '@/components/react-bits/Animations/FadeContent';
import ScrollReveal from '@/components/react-bits/TextAnimations/ScrollReveal';
import SpotlightCard from '@/components/react-bits/Components/SpotlightCard';
import { sculptures } from '@/data/content';

export default function SculpturesPage() {
  const t = useTranslations('sculptures');

  return (
    <div className="min-h-screen pt-32 pb-32 bg-black">
      <div className="max-w-7xl mx-auto px-6">
        <FadeContent blur={true} duration={1000} className="text-center mb-20">
          <ScrollReveal containerClassName="text-5xl sm:text-6xl font-bold text-white mb-6 tracking-tight" textClassName="block">
            {t('title')}
          </ScrollReveal>
          <p className="text-white/40 text-lg">{t('subtitle')}</p>
        </FadeContent>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sculptures.map((sculpture, i) => (
            <FadeContent key={sculpture.id} blur={true} duration={800} delay={i * 100}>
              <SpotlightCard className="h-full p-0 overflow-hidden">
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={sculpture.image} alt={sculpture.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{sculpture.name}</h3>
                  <p className="text-white/40 text-sm mb-4">{sculpture.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {sculpture.applications.map((app) => (
                      <span key={app} className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-white/50 border border-white/5">{app}</span>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/5 flex gap-4 text-xs text-white/30">
                    <span>{sculpture.material}</span>
                    <span>{sculpture.finish}</span>
                    <span>H: {sculpture.height}</span>
                  </div>
                </div>
              </SpotlightCard>
            </FadeContent>
          ))}
        </div>
      </div>
    </div>
  );
}

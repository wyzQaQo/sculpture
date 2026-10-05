'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { motion } from 'motion/react';
import FadeContent from '@/components/react-bits/Animations/FadeContent';
import TiltedCard from '@/components/react-bits/Components/TiltedCard';
import ScrollReveal from '@/components/react-bits/TextAnimations/ScrollReveal';

const categories = [
  { key: 'abstract', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&q=80' },
  { key: 'modern_art', image: 'https://images.unsplash.com/photo-1566913491783-4dfb5c04b243?w=600&q=80' },
  { key: 'landmark', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&q=80' },
  { key: 'mirror_polished', image: 'https://images.unsplash.com/photo-1494145904049-0dca59b4bbad?w=600&q=80' },
  { key: 'ring', image: 'https://images.unsplash.com/photo-1518546305927-5a4bbfe3a78a?w=600&q=80' },
  { key: 'public_art', image: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=600&q=80' },
];

export default function SculptureCategories() {
  const t = useTranslations('sculptures');

  return (
    <section className="relative py-32 bg-black">
      <div className="max-w-7xl mx-auto px-6">
        <FadeContent blur={true} duration={1000} className="text-center mb-20">
          <ScrollReveal containerClassName="text-5xl sm:text-6xl font-bold text-white mb-6 tracking-tight" textClassName="block">
            {t('title')}
          </ScrollReveal>
          <p className="text-white/40 text-lg">{t('subtitle')}</p>
        </FadeContent>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, i) => (
            <FadeContent key={cat.key} blur={true} duration={1000} delay={i * 100}>
              <Link href={`/sculptures#${cat.key}`} className="block group">
                <div className="relative h-80 rounded-2xl overflow-hidden">
                  <TiltedCard
                    imageSrc={cat.image}
                    altText={t(`categories.${cat.key}`)}
                    containerHeight="100%"
                    containerWidth="100%"
                    imageHeight="100%"
                    imageWidth="100%"
                    scaleOnHover={1.05}
                    rotateAmplitude={8}
                    showTooltip={false}
                    showMobileWarning={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <motion.h3
                      className="text-xl font-bold text-white"
                      initial={{ opacity: 0, y: 10 }}
                      whileHover={{ y: -2 }}
                    >
                      {t(`categories.${cat.key}`)}
                    </motion.h3>
                  </div>
                </div>
              </Link>
            </FadeContent>
          ))}
        </div>
      </div>
    </section>
  );
}

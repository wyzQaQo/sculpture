'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ArrowDown } from 'lucide-react';
import { motion } from 'motion/react';
import dynamic from 'next/dynamic';
import BlurText from '@/components/react-bits/TextAnimations/BlurText';
import ShinyText from '@/components/react-bits/TextAnimations/ShinyText';

const LiquidChrome = dynamic(() => import('@/components/react-bits/Backgrounds/LiquidChrome'), { ssr: false });

export default function Hero() {
  const t = useTranslations('hero');

  return (
    <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <LiquidChrome
          baseColor={[0.03, 0.06, 0.12]}
          speed={0.1}
          amplitude={0.2}
          frequencyX={2}
          frequencyY={2}
          interactive={true}
        />
      </div>

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <ShinyText speed={3} className="text-lg sm:text-xl mb-6 font-light tracking-[0.3em] uppercase text-slate-400">
            Stainless Steel Sculpture Engineering
          </ShinyText>
        </motion.div>

        <BlurText
          text="We Engineer Landmark Art"
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-[0.9] mb-8 tracking-tight"
          delay={150}
          animateBy="words"
          direction="top"
          stepDuration={0.5}
        />

        <motion.p
          className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto mb-12 font-light"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          {t('subheadline')}
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.8 }}
        >
          <Link
            href="/contact"
            className="group px-8 py-4 bg-white text-black font-semibold rounded-full text-lg hover:bg-slate-200 transition-all shadow-2xl shadow-white/20 hover:shadow-white/30 flex items-center gap-2"
          >
            {t('cta_primary')}
            <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
          </Link>
          <Link
            href="/case-studies"
            className="px-8 py-4 border border-white/20 text-white font-semibold rounded-full text-lg hover:bg-white/10 transition-all backdrop-blur-sm"
          >
            {t('cta_secondary')}
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ArrowDown className="text-white/30" size={24} />
      </motion.div>
    </section>
  );
}

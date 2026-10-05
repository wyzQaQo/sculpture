'use client';

import FadeContent from '@/components/react-bits/Animations/FadeContent';
import ScrollReveal from '@/components/react-bits/TextAnimations/ScrollReveal';
import SpotlightCard from '@/components/react-bits/Components/SpotlightCard';
import { materials } from '@/data/content';

export default function MaterialsPage() {
  return (
    <div className="min-h-screen pt-32 pb-32 bg-black">
      <div className="max-w-7xl mx-auto px-6">
        <FadeContent blur={true} duration={1000} className="text-center mb-20">
          <ScrollReveal containerClassName="text-5xl sm:text-6xl font-bold text-white mb-6 tracking-tight" textClassName="block">
            Materials & Finishes
          </ScrollReveal>
          <p className="text-white/40 text-lg max-w-3xl mx-auto">
            We use only premium-grade stainless steel with precision finishing techniques to ensure 
            decades of beauty and structural integrity.
          </p>
        </FadeContent>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {materials.map((material, i) => (
            <FadeContent key={material.name} blur={true} duration={800} delay={i * 100}>
              <SpotlightCard className="h-full">
                <div className="mb-4">
                  <span className="text-xs px-3 py-1 rounded-full bg-white/5 text-white/50 border border-white/10">{material.grade}</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{material.name}</h3>
                <p className="text-white/40 text-sm leading-relaxed mb-4">{material.properties}</p>
                <div className="pt-4 border-t border-white/5">
                  <p className="text-xs text-white/30 uppercase tracking-wider mb-1">Best For</p>
                  <p className="text-white/50 text-sm">{material.applications}</p>
                </div>
              </SpotlightCard>
            </FadeContent>
          ))}
        </div>
      </div>
    </div>
  );
}

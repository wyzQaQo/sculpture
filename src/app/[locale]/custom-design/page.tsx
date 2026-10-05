export const dynamicParams = false;
'use client';

import { Link } from '@/i18n/navigation';
import FadeContent from '@/components/react-bits/Animations/FadeContent';
import ScrollReveal from '@/components/react-bits/TextAnimations/ScrollReveal';
import SpotlightCard from '@/components/react-bits/Components/SpotlightCard';
import { PenTool, Ruler, Cog, Truck } from 'lucide-react';

const designServices = [
  { icon: PenTool, title: 'Concept Development', description: 'From sketch to 3D model — we collaborate with architects and designers to develop the perfect concept for your space.' },
  { icon: Ruler, title: 'Engineering Design', description: 'Structural analysis, wind load calculations, and fabrication-ready technical drawings with full material specifications.' },
  { icon: Cog, title: 'Custom Fabrication', description: 'Bespoke manufacturing in our 25,000 m² facility using CNC cutting, robotic welding, and precision forming.' },
  { icon: Truck, title: 'Turnkey Delivery', description: 'Complete project management from design through installation with single-point accountability.' },
];

export default function CustomDesignPage() {
  return (
    <div className="min-h-screen pt-32 pb-32 bg-black">
      <div className="max-w-7xl mx-auto px-6">
        <FadeContent blur={true} duration={1000} className="text-center mb-20">
          <ScrollReveal containerClassName="text-5xl sm:text-6xl font-bold text-white mb-6 tracking-tight" textClassName="block">
            Custom Sculpture Design
          </ScrollReveal>
          <p className="text-white/40 text-lg max-w-3xl mx-auto">
            Every landmark begins with a vision. Our engineering team transforms your concept into a 
            structurally sound, visually stunning stainless steel sculpture.
          </p>
        </FadeContent>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          {designServices.map((service, i) => {
            const Icon = service.icon;
            return (
              <FadeContent key={service.title} blur={true} duration={800} delay={i * 100}>
                <SpotlightCard className="h-full">
                  <Icon className="text-white/60 mb-4" size={32} />
                  <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{service.description}</p>
                </SpotlightCard>
              </FadeContent>
            );
          })}
        </div>

        <FadeContent blur={true} duration={1000} className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Your Project?</h2>
          <p className="text-white/40 mb-8">Share your vision with our engineering team.</p>
          <Link
            href="/contact"
            className="inline-flex px-10 py-5 bg-white text-black text-lg font-bold rounded-full hover:bg-slate-200 transition-all"
          >
            Start Your Custom Project &rarr;
          </Link>
        </FadeContent>
      </div>
    </div>
  );
}

'use client';

import { useParams } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { ArrowLeft } from 'lucide-react';
import FadeContent from '@/components/react-bits/Animations/FadeContent';
import ScrollReveal from '@/components/react-bits/TextAnimations/ScrollReveal';
import { caseStudies } from '@/data/content';

export default function CaseStudyDetailPage() {
  const params = useParams();
  const study = caseStudies.find((s) => s.id === params.id);

  if (!study) {
    return (
      <div className="min-h-screen pt-32 pb-32 bg-black flex items-center justify-center">
        <p className="text-white/40">Case study not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-32 bg-black">
      <div className="max-w-5xl mx-auto px-6">
        <FadeContent>
          <Link href="/case-studies" className="inline-flex items-center gap-2 text-white/40 hover:text-white mb-12 transition-colors text-sm">
            <ArrowLeft size={16} /> Back to Case Studies
          </Link>
        </FadeContent>

        <FadeContent blur={true} duration={1000}>
          <div className="aspect-[21/9] rounded-2xl overflow-hidden mb-12">
            <img src={study.image} alt={study.title} className="w-full h-full object-cover" />
          </div>
        </FadeContent>

        <FadeContent delay={200}>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-xs px-3 py-1.5 rounded-full bg-white/5 text-white/60 border border-white/10">{study.location}</span>
            <span className="text-sm text-white/40">{study.client}</span>
            <span className="text-sm text-white/40">{study.year}</span>
          </div>
        </FadeContent>

        <ScrollReveal containerClassName="text-4xl sm:text-5xl font-bold text-white mb-8 tracking-tight" textClassName="block">
          {study.title}
        </ScrollReveal>

        <FadeContent delay={300}>
          <p className="text-white/40 text-lg leading-relaxed mb-12">{study.description}</p>
        </FadeContent>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <FadeContent delay={400}>
            <div className="p-8 rounded-2xl border border-white/5 bg-white/[0.02]">
              <h3 className="text-white font-bold mb-3 uppercase tracking-wider text-xs">Engineering Challenge</h3>
              <p className="text-white/40 text-sm leading-relaxed">{study.challenge}</p>
            </div>
          </FadeContent>
          <FadeContent delay={500}>
            <div className="p-8 rounded-2xl border border-white/5 bg-white/[0.02]">
              <h3 className="text-white font-bold mb-3 uppercase tracking-wider text-xs">Result & Impact</h3>
              <p className="text-white/40 text-sm leading-relaxed">{study.result}</p>
            </div>
          </FadeContent>
        </div>

        <FadeContent delay={600}>
          <div className="text-center">
            <Link
              href="/contact"
              className="inline-flex px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-slate-200 transition-all"
            >
              Start a Similar Project &rarr;
            </Link>
          </div>
        </FadeContent>
      </div>
    </div>
  );
}

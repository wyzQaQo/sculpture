'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import FadeContent from '@/components/react-bits/Animations/FadeContent';
import ScrollReveal from '@/components/react-bits/TextAnimations/ScrollReveal';
import SpotlightCard from '@/components/react-bits/Components/SpotlightCard';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function ContactPage() {
  const t = useTranslations('contact');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen pt-32 pb-32 bg-black">
      <div className="max-w-5xl mx-auto px-6">
        <FadeContent blur={true} duration={1000} className="text-center mb-20">
          <ScrollReveal containerClassName="text-5xl sm:text-6xl font-bold text-white mb-6 tracking-tight" textClassName="block">
            {t('title')}
          </ScrollReveal>
          <p className="text-white/40 text-lg">{t('subtitle')}</p>
        </FadeContent>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <SpotlightCard>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Mail className="text-white/40 mt-0.5" size={18} />
                  <div>
                    <p className="text-white text-sm font-semibold">Email</p>
                    <a href="mailto:info@artisansteel.com" className="text-white/40 text-sm hover:text-white transition-colors">info@artisansteel.com</a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Phone className="text-white/40 mt-0.5" size={18} />
                  <div>
                    <p className="text-white text-sm font-semibold">Phone</p>
                    <p className="text-white/40 text-sm">+86 138 0000 0000</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <MapPin className="text-white/40 mt-0.5" size={18} />
                  <div>
                    <p className="text-white text-sm font-semibold">Headquarters</p>
                    <p className="text-white/40 text-sm">No. 88 Industrial Avenue, Foshan, Guangdong, China</p>
                  </div>
                </div>
              </div>
            </SpotlightCard>
          </div>

          <div className="lg:col-span-3">
            <SpotlightCard>
              {submitted ? (
                <div className="py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
                    <Send className="text-green-400" size={28} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{t('success')}</h3>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm text-white/60 mb-2">{t('name')}</label>
                      <input type="text" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors text-sm" placeholder="John Smith" />
                    </div>
                    <div>
                      <label className="block text-sm text-white/60 mb-2">{t('company')}</label>
                      <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors text-sm" placeholder="Company Ltd." />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm text-white/60 mb-2">{t('email')}</label>
                      <input type="email" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors text-sm" placeholder="john@company.com" />
                    </div>
                    <div>
                      <label className="block text-sm text-white/60 mb-2">{t('phone')}</label>
                      <input type="tel" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors text-sm" placeholder="+1 234 567 8900" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-white/60 mb-2">{t('country')}</label>
                    <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors text-sm" placeholder="United Arab Emirates" />
                  </div>
                  <div>
                    <label className="block text-sm text-white/60 mb-2">{t('message')}</label>
                    <textarea required rows={5} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors text-sm resize-none" placeholder="Tell us about your project..." />
                  </div>
                  <button type="submit" className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-slate-200 transition-all flex items-center justify-center gap-2">
                    <Send size={18} /> {t('submit')}
                  </button>
                </form>
              )}
            </SpotlightCard>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ArrowUpRight } from 'lucide-react';

export default function Footer() {
  const t = useTranslations('footer');
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-black border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-300 via-slate-400 to-slate-600 flex items-center justify-center text-black font-bold text-lg">
                A
              </div>
              <span className="text-white font-bold text-xl tracking-wider">ArtisanSteel</span>
            </div>
            <p className="text-white/40 text-sm max-w-md leading-relaxed">
              Engineering landmark art for cities, hotels, and commercial spaces worldwide. 
              Custom stainless steel sculptures that define architectural spaces.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
            <div className="flex flex-col gap-2">
              {['sculptures', 'case-studies', 'custom-design', 'materials', 'installation', 'about'].map((path) => (
                <Link key={path} href={`/${path}`} className="text-white/40 hover:text-white text-sm transition-colors capitalize">
                  {path.replace('-', ' ')}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contact</h4>
            <div className="flex flex-col gap-2 text-white/40 text-sm">
              <a href="mailto:info@artisansteel.com" className="hover:text-white transition-colors flex items-center gap-1">
                info@artisansteel.com <ArrowUpRight size={12} />
              </a>
              <a href="https://wa.me/8613800000000" target="_blank" className="hover:text-white transition-colors">
                WhatsApp
              </a>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-white/30 text-sm">
            &copy; {currentYear} ArtisanSteel. {t('rights')}
          </p>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="text-white/30 hover:text-white/60 text-sm transition-colors">{t('privacy')}</Link>
            <Link href="/terms-of-service" className="text-white/30 hover:text-white/60 text-sm transition-colors">{t('terms')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

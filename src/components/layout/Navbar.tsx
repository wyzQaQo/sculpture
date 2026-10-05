'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { Link, usePathname } from '@/i18n/navigation';
import { useLocale, useTranslations } from 'next-intl';

const locales = [
  { code: 'en', label: 'EN', flag: '🇬🇧' },
  { code: 'ar', label: 'AR', flag: '🇸🇦' },
  { code: 'es', label: 'ES', flag: '🇪🇸' },
  { code: 'fr', label: 'FR', flag: '🇫🇷' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('nav');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems = [
    { href: '/', label: t('home') },
    { href: '/sculptures', label: t('sculptures') },
    { href: '/case-studies', label: t('case_studies') },
    { href: '/custom-design', label: t('custom_design') },
    { href: '/materials', label: t('materials') },
    { href: '/installation', label: t('installation') },
    { href: '/about', label: t('about') },
    { href: '/contact', label: t('contact') },
  ];

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled ? 'bg-black/80 backdrop-blur-xl border-b border-white/5' : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-300 via-slate-400 to-slate-600 flex items-center justify-center text-black font-bold text-lg shadow-lg shadow-slate-500/20 group-hover:shadow-slate-500/40 transition-shadow">
              A
            </div>
            <span className="text-white font-bold text-xl tracking-wider hidden sm:block">ArtisanSteel</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 text-sm rounded-lg transition-all duration-300 ${
                  pathname === item.href
                    ? 'text-white bg-white/10'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {/* Language switcher */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="px-3 py-2 text-sm text-white/60 hover:text-white rounded-lg hover:bg-white/5 transition-all flex items-center gap-1"
              >
                {locales.find(l => l.code === locale)?.flag} {locale.toUpperCase()}
              </button>
              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute top-full right-0 mt-2 bg-zinc-900 border border-white/10 rounded-xl p-1 shadow-2xl min-w-[120px]"
                  >
                    {locales.map((l) => (
                      <Link
                        key={l.code}
                        href={pathname}
                        locale={l.code}
                        className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-all ${
                          locale === l.code ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'
                        }`}
                        onClick={() => setLangOpen(false)}
                      >
                        <span>{l.flag}</span> {l.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              href="/contact"
              className="hidden sm:inline-flex px-5 py-2.5 bg-white text-black text-sm font-semibold rounded-full hover:bg-slate-200 transition-all shadow-lg shadow-white/10"
            >
              {t('get_quote')}
            </Link>

            <button className="lg:hidden text-white p-2" onClick={() => setMobileOpen(true)}>
              <Menu size={24} />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl lg:hidden"
          >
            <div className="flex justify-end p-6">
              <button onClick={() => setMobileOpen(false)} className="text-white/60 hover:text-white p-2">
                <X size={28} />
              </button>
            </div>
            <div className="flex flex-col items-center gap-4 px-6 pt-10">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`text-2xl font-light ${
                      pathname === item.href ? 'text-white' : 'text-white/40'
                    } hover:text-white transition-colors`}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <Link
                  href="/contact"
                  onClick={() => setMobileOpen(false)}
                  className="mt-6 inline-flex px-8 py-3 bg-white text-black text-lg font-semibold rounded-full hover:bg-slate-200 transition-all"
                >
                  {t('get_quote')}
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

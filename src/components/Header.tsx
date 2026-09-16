import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calculator, Menu, X, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../../fotos/Denralogo.png';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '../i18n/useLanguage';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { t } = useLanguage();
  const navLinks = [
    { label: t('nav.home'), path: '/' },
    { label: t('nav.bathroom'), path: '/badkamerrenovatie' },
    { label: t('nav.toilet'), path: '/wc-renovatie' },
    { label: t('nav.interior'), path: '/binnenrenovatie' },
    { label: t('nav.projects'), path: '/projecten' },
    { label: t('nav.reviews'), path: '/ervaringen' },
    { label: t('nav.about'), path: '/over-ons' },
    { label: t('nav.contact'), path: '/contact' },
  ];

  useEffect(() => {
    const onScroll = () => {
      const nextIsScrolled = window.scrollY > 12;
      setIsScrolled((currentIsScrolled) => currentIsScrolled === nextIsScrolled ? currentIsScrolled : nextIsScrolled);
    };
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileOpen) return undefined;
    const originalOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileOpen(false);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [mobileOpen]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 h-[74px] border-b backdrop-blur-md transition-[background-color,border-color,box-shadow] duration-200 ${isScrolled ? 'border-[#5c5147]/22 bg-[#eae2d6]/90 shadow-[0_10px_26px_rgba(29,23,18,0.1)]' : 'border-[#5c5147]/10 bg-[#eae2d6]/60'}`}
    >
      <div className="mx-auto h-full max-w-[1728px] px-[clamp(1rem,2vw,3rem)]">
        <div className="grid h-full min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 min-[1440px]:grid-cols-[auto_minmax(0,1fr)_auto] min-[1440px]:gap-[clamp(1.5rem,2.5vw,4rem)]">
          <Link 
            to="/" 
            className="group flex min-w-0 items-center"
          >
            <img src={logo} alt="DENRA Badkamers" className="h-14 w-auto max-w-[8rem] object-contain sm:h-16 sm:max-w-none" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden min-w-0 items-center justify-center gap-[clamp(0.7rem,1.1vw,1.45rem)] min-[1440px]:flex" aria-label={t('nav.primaryNav')}>
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`group relative whitespace-nowrap text-[clamp(0.7rem,0.72vw,0.78rem)] font-medium uppercase tracking-[0.1em] transition-colors duration-200 ${
                    isActive ? 'text-[#12100d]' : 'text-[#4a4037] hover:text-[#12100d]'
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute -bottom-2 left-0 h-px bg-[#12100d] transition-all duration-300 ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Desktop controls */}
          <div className="hidden shrink-0 items-center gap-[clamp(0.65rem,1vw,1rem)] min-[1440px]:flex">
            <LanguageSwitcher />
            <a
              href="https://wa.me/31614966756"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-[#4a4037] hover:text-[#12100d] transition-colors duration-200"
              aria-label={t('common.whatsappDenra')}
            >
              <MessageCircle size={16} />
            </a>
            <Link
              to="/configurator"
              className="denra-button-primary min-h-11 min-w-[10.5rem] whitespace-nowrap px-5 py-2.5 text-[13px]"
            >
              {t('common.calculatePrice')}
            </Link>
          </div>

          {/* Compact controls */}
          <div className="flex shrink-0 items-center gap-2 min-[1440px]:hidden">
            <Link
              to="/configurator"
              className="denra-button-primary flex h-11 min-h-11 items-center justify-center whitespace-nowrap px-3 text-xs sm:min-w-[9.5rem] sm:px-4"
              aria-label={t('common.calculatePrice')}
            >
              <Calculator size={18} className="sm:hidden" aria-hidden="true" />
              <span className="hidden sm:inline">{t('common.calculatePrice')}</span>
            </Link>
            <button
              className="flex h-11 w-11 shrink-0 items-center justify-center border border-[#5c5147]/20 text-[#12100d] transition-colors duration-200 hover:bg-[#231A12] hover:text-[#f6f0e8]"
              onClick={() => setMobileOpen((isOpen) => !isOpen)}
              aria-label={mobileOpen ? t('nav.closeMenu') : t('nav.openMenu')}
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              id="mobile-navigation"
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-x-0 top-[74px] z-50 h-[calc(100dvh-74px)] overflow-y-auto overscroll-contain border-t border-[#cbb9a5]/50 bg-[#f6f0e8] shadow-[0_18px_36px_rgba(35,26,18,0.16)] min-[1440px]:hidden"
              role="dialog"
              aria-modal="true"
              aria-label={t('nav.menu')}
            >
            <nav className="mx-auto flex min-h-full w-full max-w-2xl flex-col gap-1 px-[clamp(1.5rem,6vw,4rem)] py-8 sm:py-10" aria-label={t('nav.navigation')}>
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex min-h-12 items-center whitespace-nowrap border-b border-[#cbb9a5]/30 py-2 text-xl font-serif font-medium transition-colors duration-200 ${
                        isActive ? 'text-[#12100d]' : 'text-[#4f4338] hover:text-[#12100d]'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="mt-auto pt-8 flex flex-col gap-3">
                <div className="flex min-h-11 items-center justify-between border-y border-[#cbb9a5]/50 py-3">
                  <span className="denra-label">{t('common.language')}</span>
                  <LanguageSwitcher />
                </div>
                <Link
                  to="/configurator"
                  className="denra-button-primary w-full"
                >
                  {t('common.calculatePrice')}
                </Link>
                <a
                  href="https://wa.me/31614966756"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="denra-button-secondary w-full"
                >
                  <MessageCircle size={18} />
                  {t('common.whatsappUs')}
                </a>
              </div>
            </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
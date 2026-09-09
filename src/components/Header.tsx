import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../../fotos/Denralogo.png';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Badkamerrenovatie', path: '/badkamerrenovatie' },
  { label: 'WC-renovatie', path: '/wc-renovatie' },
  { label: 'Binnenrenovatie', path: '/binnenrenovatie' },
  { label: 'Projecten', path: '/projecten' },
  { label: 'Ervaringen', path: '/ervaringen' },
  { label: 'Over ons', path: '/over-ons' },
  { label: 'Contact', path: '/contact' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

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
      <div className="max-w-7xl mx-auto px-4 lg:px-6 h-full">
        <div className="flex h-full items-center justify-between">
          <Link 
            to="/" 
            className="group -ml-2 flex items-center gap-3 lg:-ml-3"
          >
            <img src={logo} alt="DENRA Badkamers" className="h-16 lg:h-[4.75rem] w-auto max-w-none object-contain" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-6" aria-label="Hoofdnavigatie">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`group relative text-[12px] font-medium uppercase tracking-[0.1em] transition-colors duration-200 ${
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

          {/* CTA */}
          <div className="hidden items-center gap-3 lg:flex">
            <a
              href="https://wa.me/31614966756"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-[#4a4037] hover:text-[#12100d] transition-colors duration-200"
              aria-label="WhatsApp DENRA"
            >
              <MessageCircle size={16} />
            </a>
            <Link
              to="/configurator"
              className="denra-button-primary min-h-0 px-5 py-2.5 text-[13px]"
            >
              Prijs berekenen
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden flex h-11 w-11 items-center justify-center text-[#12100d] hover:text-[#4a4037] transition-colors duration-200"
            onClick={() => setMobileOpen((isOpen) => !isOpen)}
            aria-label={mobileOpen ? 'Menu sluiten' : 'Menu openen'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.button type="button" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="fixed inset-x-0 bottom-0 top-[74px] z-40 bg-[#231A12]/30 lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Menu sluiten" />
            <motion.div
              id="mobile-navigation"
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-x-0 z-50 max-h-[calc(100dvh-74px)] overflow-y-auto overscroll-contain border-b border-[#cbb9a5]/50 bg-[#f6f0e8] shadow-[0_18px_36px_rgba(35,26,18,0.16)] lg:hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Mobiel menu"
              style={{ top: '74px' }}
            >
            <nav className="flex flex-col gap-1 px-6 py-8" aria-label="Mobiele navigatie">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`min-h-12 flex items-center text-xl font-serif font-medium transition-colors duration-200 ${
                        isActive ? 'text-[#12100d]' : 'text-[#4f4338] hover:text-[#12100d]'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="mt-5 pt-6 border-t border-[#cbb9a5]/50 flex flex-col gap-3">
                <Link
                  to="/configurator"
                    className="denra-button-primary w-full"
                >
                  Prijs berekenen
                </Link>
                <a
                  href="https://wa.me/31614966756"
                  target="_blank"
                  rel="noopener noreferrer"
                    className="denra-button-secondary w-full"
                >
                  <MessageCircle size={18} />
                  WhatsApp ons
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
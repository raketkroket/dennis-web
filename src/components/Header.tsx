import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Badkamerrenovatie', path: '/badkamerrenovatie' },
  { label: 'WC-renovatie', path: '/wc-renovatie' },
  { label: 'Binnenrenovatie', path: '/binnenrenovatie' },
  { label: 'Projecten', path: '/projecten' },
  { label: 'Over ons', path: '/over-ons' },
  { label: 'Contact', path: '/contact' },
];

export default function Header() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => {
      // Calculate scroll progress (0 to 1) over 200px
      const progress = Math.min(window.scrollY / 200, 1);
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        backgroundColor: `rgba(250, 248, 245, ${scrollProgress * 0.95})`,
        backdropFilter: `blur(${4 + scrollProgress * 8}px)`,
        boxShadow: scrollProgress > 0.1 ? `0 ${4 + scrollProgress * 16}px ${12 + scrollProgress * 28}px rgba(44, 36, 22, ${0.08 + scrollProgress * 0.12})` : 'none',
        borderBottom: `1px solid rgba(212, 197, 169, ${scrollProgress * 0.3})`,
        transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        height: `${80 - scrollProgress * 8}px`
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full"
          style={{
            opacity: 1 - scrollProgress * 0.05,
          }}>
          {/* Logo */}
          <Link 
            to="/" 
            className="flex flex-col leading-none group"
            style={{
              transform: `scale(${1 - scrollProgress * 0.08})`,
              transformOrigin: 'left center',
              transition: 'transform 0.3s ease-out'
            }}
          >
            <span className="font-serif text-2xl font-semibold text-[#2C2416] tracking-wide group-hover:text-[#D5C0A7] transition-colors duration-300">
              NIVORA
            </span>
            <span className="text-[10px] tracking-[0.25em] text-[#D5C0A7] uppercase font-sans font-medium"
              style={{
                opacity: 1 - scrollProgress * 0.3,
                transition: 'opacity 0.3s ease-out'
              }}>
              Luxe Renovaties
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8" aria-label="Hoofdnavigatie">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative text-sm font-medium transition-colors duration-200 group ${
                    isActive ? 'text-[#D5C0A7]' : 'text-[#1a1410] hover:text-[#D5C0A7]'
                  }`}
                  style={{
                    letterSpacing: `${0.05 + scrollProgress * 0.02}em`,
                    transition: 'letter-spacing 0.3s ease-out'
                  }}
                >
                  {link.label}
                  <span
                    className={`absolute -bottom-1 left-0 h-px bg-[#D5C0A7] transition-all duration-300 ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3"
            style={{
              transform: `scale(${1 - scrollProgress * 0.05})`,
              transformOrigin: 'right center',
              transition: 'transform 0.3s ease-out'
            }}>
            <a
              href="https://wa.me/31612345678"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-[#1a1410] hover:text-[#D5C0A7] transition-colors duration-200"
              aria-label="WhatsApp Nivora"
              style={{
                opacity: 1 - scrollProgress * 0.1,
                transition: 'opacity 0.3s ease-out'
              }}
            >
              <MessageCircle size={16} />
            </a>
            <Link
              to="/configurator"
              className="text-[#2C2416] text-sm font-medium rounded-full hover:scale-105 transition-all duration-200 tracking-wide"
              style={{
                background: 'linear-gradient(90deg, rgba(255,255,255,0.95) 0%, #D5C0A7 100%)',
                padding: `${10 + scrollProgress * 2.5}px ${24 - scrollProgress * 6}px`,
                transition: 'padding 0.3s ease-out'
              }}
            >
              Prijs berekenen
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden p-2 text-[#2C2416] hover:text-[#D5C0A7] transition-colors duration-200"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Menu sluiten' : 'Menu openen'}
            style={{
              opacity: 1 - scrollProgress * 0.08,
              transition: 'opacity 0.3s ease-out'
            }}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed inset-0 top-20 bg-white z-40 lg:hidden min-h-screen"
            role="dialog"
            aria-modal="true"
            aria-label="Mobiel menu"
            style={{ backgroundColor: '#FFFFFF' }}
          >
            <nav className="flex flex-col px-8 py-10 gap-6" aria-label="Mobiele navigatie">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`text-xl font-serif font-medium transition-colors duration-200 ${
                      isActive ? 'text-[#D5C0A7]' : 'text-[#2C2416] hover:text-[#D5C0A7]'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="pt-6 border-t border-[#D4C5A9]/40 flex flex-col gap-4">
                <Link
                  to="/configurator"
                  className="bg-[#D5C0A7] text-[#2C2416] text-center font-medium px-6 py-3.5 rounded-full hover:bg-[#C7AF94] transition-all duration-200"
                >
                  Prijs berekenen
                </Link>
                <a
                  href="https://wa.me/31612345678"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 border border-[#D5C0A7] text-[#D5C0A7] font-medium px-6 py-3.5 rounded-full hover:bg-[#D5C0A7]/10 transition-all duration-200"
                >
                  <MessageCircle size={18} />
                  WhatsApp ons
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
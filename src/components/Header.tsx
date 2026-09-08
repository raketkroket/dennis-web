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
        backgroundColor: `rgba(234, 226, 214, ${0.5 + scrollProgress * 0.3})`,
        backdropFilter: `blur(${10 + scrollProgress * 10}px)`,
        boxShadow: scrollProgress > 0.1 ? `0 ${6 + scrollProgress * 10}px ${20 + scrollProgress * 18}px rgba(29, 23, 18, ${0.05 + scrollProgress * 0.05})` : 'none',
        borderBottom: `1px solid rgba(92, 81, 71, ${0.1 + scrollProgress * 0.12})`,
        transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        height: `${82 - scrollProgress * 8}px`
      }}
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-6 h-full">
        <div className="flex items-center justify-between h-full"
          style={{
            opacity: 1 - scrollProgress * 0.05,
          }}>
          <Link 
            to="/" 
            className="flex items-center gap-3 group -ml-2 lg:-ml-3"
            style={{
              transform: `scale(${1 - scrollProgress * 0.08})`,
              transformOrigin: 'left center',
              transition: 'transform 0.3s ease-out'
            }}
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
                  className={`relative text-[12px] font-medium uppercase transition-colors duration-200 group ${
                    isActive ? 'text-[#12100d]' : 'text-[#4a4037] hover:text-[#12100d]'
                  }`}
                  style={{
                    letterSpacing: `${0.1 + scrollProgress * 0.02}em`,
                    transition: 'letter-spacing 0.3s ease-out'
                  }}
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
          <div className="hidden lg:flex items-center gap-3"
            style={{
              transform: `scale(${1 - scrollProgress * 0.05})`,
              transformOrigin: 'right center',
              transition: 'transform 0.3s ease-out'
            }}>
            <a
              href="https://wa.me/31614966756"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-[#4a4037] hover:text-[#12100d] transition-colors duration-200"
              aria-label="WhatsApp DENRA"
              style={{
                opacity: 1 - scrollProgress * 0.1,
                transition: 'opacity 0.3s ease-out'
              }}
            >
              <MessageCircle size={16} />
            </a>
            <Link
              to="/configurator"
              className="denra-button-primary min-h-0 px-5 py-2.5 text-[13px]"
              style={{
                background: 'rgba(18, 16, 13, 0.98)',
                padding: `${10 + scrollProgress * 2.5}px ${22 - scrollProgress * 4}px`,
                transition: 'padding 0.3s ease-out'
              }}
            >
              Prijs berekenen
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden flex h-11 w-11 items-center justify-center text-[#12100d] hover:text-[#4a4037] transition-colors duration-200"
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
            className="fixed inset-0 top-[74px] bg-[#f6f0e8] z-40 lg:hidden min-h-[calc(100vh-74px)] shadow-[-12px_0_36px_rgba(35,26,18,0.1)]"
            role="dialog"
            aria-modal="true"
            aria-label="Mobiel menu"
            style={{ backgroundColor: '#f6f0e8' }}
          >
            <nav className="flex flex-col px-6 py-8 gap-1" aria-label="Mobiele navigatie">
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
        )}
      </AnimatePresence>
    </header>
  );
}
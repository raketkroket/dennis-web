import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ArrowRight, Menu, MessageCircle, Phone, X } from 'lucide-react';
import logo from '../assets/denra-logo.png';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '../i18n/useLanguage';
import { useSiteContent } from '../content/SiteContentProvider';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { t } = useLanguage();
  const { business } = useSiteContent();

  const navLinks = [
    { label: t('site.bathrooms'), path: '/badkamerrenovatie' },
    { label: t('site.toilets'), path: '/wc-renovatie' },
    { label: t('site.interior'), path: '/binnenrenovatie' },
    { label: t('nav.projects'), path: '/projecten' },
    { label: t('nav.reviews'), path: '/ervaringen' },
    { label: t('nav.about'), path: '/over-ons' },
    { label: t('nav.contact'), path: '/contact' },
  ];

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    menuRef.current?.querySelector<HTMLElement>('a, button')?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
      if (event.key === 'Tab' && menuRef.current) {
        const focusable = ([menuButtonRef.current, ...menuRef.current.querySelectorAll<HTMLElement>('a, button')].filter(Boolean) as HTMLElement[]).filter((element) => element.getClientRects().length > 0);
        const index = focusable.indexOf(document.activeElement as HTMLElement);
        if (event.shiftKey && index <= 0) {
          event.preventDefault();
          focusable[focusable.length - 1].focus();
        } else if (!event.shiftKey && index === focusable.length - 1) {
          event.preventDefault();
          focusable[0].focus();
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [menuOpen]);

  const solid = isScrolled || menuOpen;

  return (
    <>
      <a href="#main" className="sr-only z-[80] bg-denra-ink px-4 py-3 text-denra-ivory focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        {t('site.skipToContent')}
      </a>
      <header
        className={`fixed inset-x-0 top-0 z-50 h-[var(--header-height)] transition-[background-color,border-color] duration-200 ${solid ? 'border-b border-denra-line bg-denra-ivory/95 backdrop-blur-md' : 'border-b border-transparent bg-denra-ivory/80 backdrop-blur-sm'}`}
      >
        <div className="shell flex h-full items-center justify-between gap-6">
          <Link to="/" className="flex shrink-0 items-center" aria-label={`${business.companyName} – home`}>
            <img src={logo} alt="Denra Badkamers" width={445} height={120} className="h-9 w-auto lg:h-10" />
          </Link>

          <nav className="hidden min-w-0 items-center gap-7 xl:flex" aria-label={t('nav.primaryNav')}>
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) => `relative whitespace-nowrap py-2 text-[14px] transition-colors ${isActive ? 'text-denra-ink after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:bg-denra-ink' : 'text-denra-muted hover:text-denra-ink'}`}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-3">
            <div className="hidden xl:block"><LanguageSwitcher /></div>
            <Link to="/configurator" className="hidden whitespace-nowrap text-[14px] text-denra-muted underline-offset-4 hover:text-denra-ink hover:underline lg:inline xl:hidden 2xl:inline">
              {t('common.calculatePrice')}
            </Link>
            <Link to="/contact" className="btn-primary hidden min-h-11 px-5 lg:inline-flex">
              {t('site.quote')}
            </Link>
            <button
              ref={menuButtonRef}
              type="button"
              className="flex h-11 items-center gap-2 border border-denra-ink/20 px-3 text-sm font-medium text-denra-ink xl:hidden"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="site-menu"
            >
              {menuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
              <span>{menuOpen ? t('site.closeMenu') : t('site.menu')}</span>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div
            id="site-menu"
            ref={menuRef}
            className="fixed inset-x-0 bottom-0 top-[var(--header-height)] z-50 overflow-y-auto overscroll-contain border-t border-denra-line bg-denra-ivory xl:hidden"
          >
            <nav className="shell flex min-h-full flex-col py-6 pb-[calc(var(--action-bar-height)+2rem)]" aria-label={t('nav.navigation')}>
              <ul>
                {[{ label: t('nav.home'), path: '/' }, ...navLinks].map((link) => (
                  <li key={link.path} className="border-b border-denra-line">
                    <NavLink
                      to={link.path}
                      end={link.path === '/'}
                      className={({ isActive }) => `flex min-h-14 items-center justify-between font-serif text-[1.65rem] leading-none ${isActive ? 'text-denra-ink' : 'text-denra-ink/75'}`}
                    >
                      {link.label}
                      <ArrowRight size={18} className="text-denra-bronze" aria-hidden="true" />
                    </NavLink>
                  </li>
                ))}
              </ul>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <Link to="/contact" className="btn-primary">{t('site.quote')}</Link>
                <Link to="/configurator" className="btn-secondary">{t('common.calculatePrice')}</Link>
              </div>
              <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-denra-line pt-6 text-sm">
                <div className="flex flex-col gap-2">
                  <a href={`tel:${business.phoneLink}`} className="inline-flex items-center gap-2 text-denra-ink"><Phone size={16} aria-hidden="true" />{business.phoneDisplay}</a>
                  <a href={`https://wa.me/${business.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-denra-ink"><MessageCircle size={16} aria-hidden="true" />{t('site.whatsapp')}</a>
                </div>
                <div className="flex items-center gap-3">
                  <span className="eyebrow-plain">{t('common.language')}</span>
                  <LanguageSwitcher />
                </div>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}

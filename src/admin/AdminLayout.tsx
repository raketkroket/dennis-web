import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Calculator, ExternalLink, FileText, Home, Image, Inbox, LayoutGrid, LogOut, Menu, Star, Building2, X } from 'lucide-react';
import logo from '../assets/denra-logo.png';
import { useAuth } from './auth';
import { useGuard } from './ui';

const adminNav = [
  { to: '/admin', label: 'Overzicht', icon: Home, end: true },
  { to: '/admin/projecten', label: 'Projecten', icon: LayoutGrid },
  { to: '/admin/fotos', label: "Foto's", icon: Image },
  { to: '/admin/reviews', label: 'Reviews', icon: Star },
  { to: '/admin/aanvragen', label: 'Aanvragen', icon: Inbox },
  { to: '/admin/website', label: 'Website aanpassen', icon: FileText },
  { to: '/admin/calculator', label: 'Calculator en prijzen', icon: Calculator },
  { to: '/admin/bedrijf', label: 'Bedrijfsgegevens', icon: Building2 },
];

export default function AdminLayout() {
  const { signOut, state } = useAuth();
  const { confirmLeave } = useGuard();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const email = state.status === 'admin' ? state.session.user.email : '';

  useEffect(() => setMenuOpen(false), [location.pathname]);
  useEffect(() => {
    document.title = 'Beheer | Denra Badkamers';
    const robots = document.querySelector('meta[name="robots"]');
    const previous = robots?.getAttribute('content');
    robots?.setAttribute('content', 'noindex, nofollow');
    return () => { if (previous) robots?.setAttribute('content', previous); };
  }, []);

  const nav = (
    <nav aria-label="Beheer">
      <ul className="space-y-1">
        {adminNav.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              end={item.end}
              onClick={(event) => { if (!confirmLeave()) event.preventDefault(); }}
              className={({ isActive }) => `flex min-h-12 items-center gap-3 px-3 text-[16px] transition-colors ${isActive ? 'bg-denra-ink text-denra-ivory' : 'text-denra-ink hover:bg-denra-stone'}`}
            >
              <item.icon size={19} aria-hidden="true" />
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
      <div className="mt-8 space-y-1 border-t border-denra-line pt-4">
        <a href="/" target="_blank" rel="noopener noreferrer" className="flex min-h-12 items-center gap-3 px-3 text-[16px] text-denra-ink hover:bg-denra-stone">
          <ExternalLink size={19} aria-hidden="true" />Bekijk de website
        </a>
        <button type="button" onClick={() => { if (confirmLeave()) void signOut(); }} className="flex min-h-12 w-full items-center gap-3 px-3 text-left text-[16px] text-denra-ink hover:bg-denra-stone">
          <LogOut size={19} aria-hidden="true" />Uitloggen
        </button>
        {email && <p className="px-3 pt-2 text-[13px] text-denra-muted">Ingelogd als {email}</p>}
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-denra-ivory text-denra-ink">
      <a href="#admin-main" className="sr-only z-50 bg-denra-ink px-4 py-3 text-denra-ivory focus:not-sr-only focus:fixed focus:left-4 focus:top-4">Direct naar de inhoud</a>
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-denra-line bg-denra-ivory/95 px-4 backdrop-blur lg:hidden">
        <img src={logo} alt="Denra Badkamers – beheer" className="h-8 w-auto" />
        <button type="button" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-controls="admin-menu" className="flex h-12 items-center gap-2 border border-denra-ink/20 px-4 text-[16px]">
          {menuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}Menu
        </button>
      </header>
      {menuOpen && <div id="admin-menu" className="fixed inset-x-0 bottom-0 top-16 z-30 overflow-y-auto bg-denra-ivory p-4 lg:hidden">{nav}</div>}

      <div className="lg:grid lg:grid-cols-[17rem_1fr]">
        <aside className="sticky top-0 hidden h-screen overflow-y-auto border-r border-denra-line bg-denra-paper p-5 lg:block">
          <img src={logo} alt="Denra Badkamers – beheer" className="mb-8 h-9 w-auto" />
          {nav}
        </aside>
        <main id="admin-main" className="min-w-0 px-4 pb-6 pt-6 sm:px-8 sm:pt-10">
          <div className="mx-auto max-w-5xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

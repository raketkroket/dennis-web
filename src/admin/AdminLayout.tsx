import { useCallback, useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Building2, Calculator, ExternalLink, FileText, Home, Image, Inbox, LayoutGrid, LogOut, Menu, Palette, RefreshCw, Star, X } from 'lucide-react';
import logo from '../assets/denra-logo.png';
import { useAdminClient, useAuth } from './auth';
import { formatDate, useGuard } from './ui';

const adminNav = [
  { group: '', items: [{ to: '/admin', label: 'Overzicht', icon: Home, end: true }] },
  {
    group: 'Website',
    items: [
      { to: '/admin/uitstraling', label: 'Uitstraling', icon: Palette },
      { to: '/admin/website', label: 'Teksten', icon: FileText },
      { to: '/admin/projecten', label: 'Projecten', icon: LayoutGrid },
      { to: '/admin/fotos', label: "Foto's", icon: Image },
    ],
  },
  {
    group: 'Klanten',
    items: [
      { to: '/admin/aanvragen', label: 'Aanvragen', icon: Inbox, count: 'requests' as const },
      { to: '/admin/reviews', label: 'Reviews', icon: Star, count: 'reviews' as const },
    ],
  },
  {
    group: 'Instellingen',
    items: [
      { to: '/admin/calculator', label: 'Calculator en prijzen', icon: Calculator },
      { to: '/admin/bedrijf', label: 'Bedrijfsgegevens', icon: Building2 },
    ],
  },
];

type Counts = { requests: number; reviews: number };

export default function AdminLayout() {
  const { signOut, state } = useAuth();
  const client = useAdminClient();
  const { confirmLeave } = useGuard();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [counts, setCounts] = useState<Counts>({ requests: 0, reviews: 0 });
  const email = state.status === 'admin' ? state.session.user.email : '';

  useEffect(() => setMenuOpen(false), [location.pathname]);
  useEffect(() => {
    document.title = 'Beheer | Denra Badkamers';
    const robots = document.querySelector('meta[name="robots"]');
    const previous = robots?.getAttribute('content');
    robots?.setAttribute('content', 'noindex, nofollow');
    return () => { if (previous) robots?.setAttribute('content', previous); };
  }, []);

  // What is waiting: new quote requests and reviews to approve, refreshed on every page change.
  useEffect(() => {
    let active = true;
    Promise.all([
      client.from('quote_requests').select('id', { count: 'exact', head: true }).eq('status', 'nieuw'),
      client.from('reviews').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    ]).then(([requests, reviews]) => {
      if (active) setCounts({ requests: requests.count ?? 0, reviews: reviews.count ?? 0 });
    });
    return () => { active = false; };
  }, [client, location.pathname]);

  const nav = (
    <nav aria-label="Beheer" className="flex h-full flex-col">
      <div className="space-y-6">
        {adminNav.map((section) => (
          <div key={section.group || 'start'}>
            {section.group && <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-denra-ivory/45">{section.group}</p>}
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const count = 'count' in item && item.count ? counts[item.count] : 0;
                return (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      end={'end' in item ? item.end : false}
                      onClick={(event) => { if (!confirmLeave()) event.preventDefault(); }}
                      className={({ isActive }) => `relative flex min-h-11 items-center gap-3 px-3 text-[15px] transition-colors ${isActive ? 'bg-denra-ivory/15 font-medium text-denra-ivory before:absolute before:inset-y-2 before:left-0 before:w-0.5 before:bg-denra-greige' : 'text-denra-ivory/75 hover:bg-denra-ivory/5 hover:text-denra-ivory'}`}
                    >
                      <item.icon size={18} aria-hidden="true" />
                      <span className="flex-1">{item.label}</span>
                      {count > 0 && <span className="min-w-6 bg-denra-greige px-1.5 text-center text-[12px] font-semibold leading-6 text-denra-night" aria-label={`${count} nieuw`}>{count}</span>}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-8 space-y-4 border-t border-denra-ivory/10 pt-5 lg:mt-auto">
        <PublishControl />
        <div className="space-y-0.5">
          <a href="/" target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center gap-3 px-3 text-[15px] text-denra-ivory/75 hover:bg-denra-ivory/5 hover:text-denra-ivory">
            <ExternalLink size={18} aria-hidden="true" />Bekijk de website
          </a>
          <button type="button" onClick={() => { if (confirmLeave()) void signOut(); }} className="flex min-h-11 w-full items-center gap-3 px-3 text-left text-[15px] text-denra-ivory/75 hover:bg-denra-ivory/5 hover:text-denra-ivory">
            <LogOut size={18} aria-hidden="true" />Uitloggen
          </button>
          {email && <p className="px-3 pt-2 text-[12px] text-denra-ivory/45">Ingelogd als {email}</p>}
        </div>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-denra-ivory text-denra-ink">
      <a href="#admin-main" className="sr-only z-50 bg-denra-ink px-4 py-3 text-denra-ivory focus:not-sr-only focus:fixed focus:left-4 focus:top-4">Direct naar de inhoud</a>
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between bg-denra-night px-4 lg:hidden">
        <img src={logo} alt="Denra Badkamers – beheer" className="h-7 w-auto brightness-0 invert" />
        <button type="button" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-controls="admin-menu" className="flex h-11 items-center gap-2 border border-denra-ivory/25 px-4 text-[15px] text-denra-ivory">
          {menuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}Menu
          {!menuOpen && counts.requests + counts.reviews > 0 && <span className="bg-denra-greige px-1.5 text-[12px] font-semibold leading-5 text-denra-night">{counts.requests + counts.reviews}</span>}
        </button>
      </header>
      {menuOpen && <div id="admin-menu" className="fixed inset-x-0 bottom-0 top-16 z-30 overflow-y-auto bg-denra-night p-4 lg:hidden">{nav}</div>}

      <div className="lg:grid lg:grid-cols-[17rem_1fr]">
        <aside className="sticky top-0 hidden h-screen flex-col overflow-y-auto bg-denra-night px-4 py-7 lg:flex">
          <img src={logo} alt="Denra Badkamers – beheer" className="mb-2 ml-3 h-9 w-auto self-start brightness-0 invert" />
          <p className="mb-8 ml-3 text-[11px] uppercase tracking-[0.24em] text-denra-ivory/45">Beheer</p>
          <div className="flex-1">{nav}</div>
        </aside>
        <main id="admin-main" className="min-w-0 px-4 pb-10 pt-6 sm:px-8 sm:pt-10 lg:px-12">
          <div className="mx-auto max-w-5xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

/**
 * "Website bijwerken": rebuilds the website so the latest changes are part of
 * every page (faster for visitors, and what Google reads). Changes are already
 * visible on the website before this.
 */
function PublishControl() {
  const client = useAdminClient();
  const { state } = useAuth();
  const [lastAt, setLastAt] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'busy' | 'done' | 'error'>('idle');
  const [note, setNote] = useState('');

  const loadLast = useCallback(async () => {
    const { data } = await client.from('site_content').select('value_nl').eq('key', 'publish.lastAt').maybeSingle();
    setLastAt(data?.value_nl || null);
  }, [client]);
  useEffect(() => { void loadLast(); }, [loadLast]);

  const publish = async () => {
    if (state.status !== 'admin') return;
    setStatus('busy');
    setNote('');
    const response = await fetch('/api/publish', { method: 'POST', headers: { Authorization: `Bearer ${state.session.access_token}` } }).catch(() => null);
    const body = (await response?.json().catch(() => null)) as { startedAt?: string; alreadyRunning?: boolean; error?: string } | null;
    if (!response?.ok) {
      setStatus('error');
      setNote(body?.error ?? 'Bijwerken is niet gelukt. Controleer de internetverbinding en probeer het opnieuw.');
      return;
    }
    if (body?.startedAt) setLastAt(body.startedAt);
    setStatus('done');
    setNote(body?.alreadyRunning ? 'De website wordt al bijgewerkt. Over ongeveer twee minuten is alles klaar.' : 'Gestart. Over ongeveer twee minuten staat alles klaar.');
  };

  return (
    <div className="border border-denra-ivory/15 p-3">
      <button type="button" onClick={publish} disabled={status === 'busy'} className="flex min-h-11 w-full items-center justify-center gap-2 bg-denra-ivory px-3 text-[15px] font-semibold text-denra-night hover:bg-denra-limestone disabled:opacity-60">
        <RefreshCw size={17} aria-hidden="true" className={status === 'busy' ? 'animate-spin motion-reduce:animate-none' : ''} />
        {status === 'busy' ? 'Bezig…' : 'Website bijwerken'}
      </button>
      <p className="mt-2 text-[12px] leading-snug text-denra-ivory/55" role="status">
        {note || (lastAt ? `Laatst bijgewerkt: ${formatDate(lastAt)}` : 'Zet uw wijzigingen vast in de website, zodat ook Google ze leest.')}
      </p>
    </div>
  );
}

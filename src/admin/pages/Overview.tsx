import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calculator, FileText, Image, Inbox, LayoutGrid, Palette, Star } from 'lucide-react';
import { useAdminClient, useAuth } from '../auth';
import { formatDate, friendlyError, Notice, PageHeader, StatusBadge } from '../ui';

interface Counts { newRequests: number; pendingReviews: number; published: number; hidden: number; photos: number }
interface RecentRequest { id: string; created_at: string; name: string; service: string; status: string; estimate_total: number | null }

export default function Overview() {
  const client = useAdminClient();
  const [counts, setCounts] = useState<Counts | null>(null);
  const [recent, setRecent] = useState<RecentRequest[]>([]);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const { state } = useAuth();
  const userId = state.status === 'admin' ? state.session.user.id : '';

  useEffect(() => {
    if (!userId) return;
    client.from('admin_users').select('display_name').eq('user_id', userId).maybeSingle().then(({ data }) => setName(data?.display_name ?? ''));
  }, [client, userId]);

  useEffect(() => {
    const count = async (table: string, apply: (query: any) => any) => {
      const { count: total, error: countError } = await apply(client.from(table).select('id', { count: 'exact', head: true }));
      if (countError) throw countError;
      return total ?? 0;
    };
    Promise.all([
      count('quote_requests', (query) => query.eq('status', 'nieuw')),
      count('reviews', (query) => query.eq('status', 'pending')),
      count('projects', (query) => query.eq('status', 'published')),
      count('projects', (query) => query.eq('status', 'hidden')),
      count('media', (query) => query),
      client.from('quote_requests').select('id, created_at, name, service, status, estimate_total').order('created_at', { ascending: false }).limit(5),
    ]).then(([newRequests, pendingReviews, published, hidden, photos, latest]) => {
      setCounts({ newRequests, pendingReviews, published, hidden, photos });
      if (latest.error) throw latest.error;
      setRecent(latest.data as RecentRequest[]);
    }).catch((loadError) => setError(friendlyError(loadError)));
  }, [client]);

  const tiles = [
    { to: '/admin/aanvragen', icon: Inbox, label: 'Nieuwe aanvragen', value: counts?.newRequests, attention: Boolean(counts?.newRequests) },
    { to: '/admin/reviews', icon: Star, label: 'Reviews te beoordelen', value: counts?.pendingReviews, attention: Boolean(counts?.pendingReviews) },
    { to: '/admin/projecten', icon: LayoutGrid, label: 'Projecten op de website', value: counts?.published, note: counts?.hidden ? `${counts.hidden} verborgen` : undefined },
    { to: '/admin/fotos', icon: Image, label: 'Foto’s in de bibliotheek', value: counts?.photos },
  ];
  const tasks = [
    { to: '/admin/projecten/nieuw', icon: LayoutGrid, label: 'Nieuw project toevoegen', text: 'Foto’s uploaden, titel en omschrijving invullen en publiceren.' },
    { to: '/admin/uitstraling', icon: Palette, label: 'Kleuren en foto’s', text: 'De kleuren van de website en de grote foto’s op de pagina’s.' },
    { to: '/admin/website', icon: FileText, label: 'Teksten aanpassen', text: 'Homepage, dienstenpagina’s en veelgestelde vragen.' },
    { to: '/admin/calculator', icon: Calculator, label: 'Prijzen bijwerken', text: 'Basisprijzen en opties van de prijscalculator.' },
  ];

  return (
    <div className="space-y-10">
      <PageHeader title={`${greeting()}${name ? `, ${name.split(' ')[0]}` : ''}`} description="Welkom in het beheer van uw website. Hier ziet u wat er op u wacht en wat u kunt aanpassen." />
      {error && <Notice tone="error">{error}</Notice>}

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map((tile) => (
          <li key={tile.to}>
            <Link to={tile.to} className={`flex h-full flex-col border p-5 transition-colors hover:border-denra-ink ${tile.attention ? 'border-denra-ink bg-white' : 'border-denra-line bg-white/60'}`}>
              <tile.icon size={20} className="text-denra-bronze" aria-hidden="true" />
              <span className="mt-4 font-serif text-4xl">{tile.value ?? '–'}</span>
              <span className="mt-1 text-[15px]">{tile.label}</span>
              {tile.note && <span className="text-[13px] text-denra-muted">{tile.note}</span>}
            </Link>
          </li>
        ))}
      </ul>

      <section aria-labelledby="recent-heading">
        <div className="flex items-end justify-between gap-4">
          <h2 id="recent-heading" className="font-serif text-2xl">Laatste aanvragen</h2>
          <Link to="/admin/aanvragen" className="text-[15px] underline underline-offset-4">Alle aanvragen</Link>
        </div>
        {recent.length ? (
          <ul className="mt-4 divide-y divide-denra-line border-y border-denra-line">
            {recent.map((request) => (
              <li key={request.id}>
                <Link to={`/admin/aanvragen/${request.id}`} className="flex min-h-16 flex-wrap items-center justify-between gap-3 py-3 hover:bg-white/60">
                  <span className="min-w-0">
                    <span className="block text-[16px] font-medium">{request.name}</span>
                    <span className="block text-[14px] text-denra-muted">{formatDate(request.created_at)} · {request.service}</span>
                  </span>
                  <span className="flex items-center gap-3"><StatusBadge status={request.status} /><ArrowRight size={16} aria-hidden="true" /></span>
                </Link>
              </li>
            ))}
          </ul>
        ) : <p className="mt-4 text-denra-muted">{counts ? 'Er zijn nog geen aanvragen binnengekomen via de website.' : 'Laden…'}</p>}
      </section>

      <section aria-labelledby="tasks-heading">
        <h2 id="tasks-heading" className="font-serif text-2xl">Snel naar</h2>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {tasks.map((task) => (
            <li key={task.to}>
              <Link to={task.to} className="flex h-full flex-col border border-denra-line bg-white/60 p-5 hover:border-denra-ink">
                <task.icon size={20} className="text-denra-bronze" aria-hidden="true" />
                <span className="mt-3 text-[17px] font-medium">{task.label}</span>
                <span className="mt-1 text-[14px] text-denra-muted">{task.text}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

const greeting = () => {
  const hour = new Date().getHours();
  return hour < 6 ? 'Goedenacht' : hour < 12 ? 'Goedemorgen' : hour < 18 ? 'Goedemiddag' : 'Goedenavond';
};

import { useCallback, useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { reviews as builtInReviews } from '../../data/reviews';
import { useAdminClient } from '../auth';
import { formatDate, friendlyError, LoadingBlock, Notice, PageHeader, StatusBadge } from '../ui';

interface ReviewRow {
  id: string;
  name: string;
  email: string;
  city: string;
  rating: number;
  project: string;
  text: string;
  status: 'pending' | 'approved' | 'deleted';
  created_at: string;
  approved_at: string | null;
}

const tabs = [
  { status: 'pending', label: 'Te beoordelen' },
  { status: 'approved', label: 'Gepubliceerd' },
  { status: 'deleted', label: 'Verwijderd' },
] as const;

export default function Reviews() {
  const client = useAdminClient();
  const [rows, setRows] = useState<ReviewRow[] | null>(null);
  const [tab, setTab] = useState<ReviewRow['status']>('pending');
  const [message, setMessage] = useState<{ tone: 'success' | 'error'; text: string } | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data, error } = await client.from('reviews').select('id, name, email, city, rating, project, text, status, created_at, approved_at').order('created_at', { ascending: false });
    if (error) setMessage({ tone: 'error', text: friendlyError(error) });
    else setRows(data as ReviewRow[]);
  }, [client]);
  useEffect(() => { void load(); }, [load]);

  const moderate = async (review: ReviewRow, status: ReviewRow['status']) => {
    if (status === 'deleted' && !window.confirm(`De review van ${review.name} van de website halen?`)) return;
    setBusyId(review.id);
    const now = new Date().toISOString();
    const { error } = await client.from('reviews').update({ status, moderated_at: now, ...(status === 'approved' ? { approved_at: now } : {}) }).eq('id', review.id);
    setBusyId(null);
    if (error) return setMessage({ tone: 'error', text: friendlyError(error) });
    setRows((current) => current?.map((row) => (row.id === review.id ? { ...row, status, approved_at: status === 'approved' ? now : row.approved_at } : row)) ?? null);
    setMessage({ tone: 'success', text: status === 'approved' ? `De review van ${review.name} staat nu op de website.` : status === 'deleted' ? `De review van ${review.name} is van de website gehaald.` : `De review van ${review.name} staat weer bij “Te beoordelen”.` });
  };

  const visible = (rows ?? []).filter((row) => row.status === tab);

  return (
    <div className="space-y-8">
      <PageHeader title="Reviews" description="Reviews die klanten via de website sturen, verschijnen pas nadat u ze heeft goedgekeurd. De knoppen in de e-mail blijven ook werken." />
      <div className="flex flex-wrap gap-2" role="group" aria-label="Welke reviews tonen">
        {tabs.map((option) => (
          <button key={option.status} type="button" aria-pressed={tab === option.status} onClick={() => setTab(option.status)} className={`min-h-11 px-4 text-[15px] ${tab === option.status ? 'bg-denra-ink text-denra-ivory' : 'border border-denra-ink/20'}`}>
            {option.label} ({(rows ?? []).filter((row) => row.status === option.status).length})
          </button>
        ))}
      </div>
      {message && <Notice tone={message.tone}>{message.text}</Notice>}
      {!rows ? <LoadingBlock /> : visible.length === 0 ? <p className="text-denra-muted">{tab === 'pending' ? 'Er wachten geen reviews op beoordeling.' : 'Geen reviews in deze lijst.'}</p> : (
        <ul className="space-y-4">
          {visible.map((review) => (
            <li key={review.id} className="border border-denra-line bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-[18px] font-medium">{review.name} <span className="font-normal text-denra-muted">· {review.city}</span></p>
                  <p className="text-[14px] text-denra-muted">{formatDate(review.created_at)} · {review.project} · <a href={`mailto:${review.email}`} className="underline">{review.email}</a></p>
                </div>
                <StatusBadge status={review.status} />
              </div>
              <p className="mt-3 flex items-center gap-1 text-denra-bronze" aria-label={`${review.rating} van 5 sterren`}>
                {[1, 2, 3, 4, 5].map((star) => <Star key={star} size={18} fill={star <= review.rating ? 'currentColor' : 'none'} aria-hidden="true" />)}
              </p>
              <p className="mt-3 whitespace-pre-line text-[17px] leading-relaxed">{review.text}</p>
              <div className="mt-5 flex flex-wrap gap-3">
                {review.status !== 'approved' && review.status !== 'deleted' && <button type="button" disabled={busyId === review.id} onClick={() => moderate(review, 'approved')} className="btn-primary min-h-12">Publiceren op de website</button>}
                {review.status !== 'deleted' && <button type="button" disabled={busyId === review.id} onClick={() => moderate(review, 'deleted')} className="btn-secondary min-h-12">{review.status === 'approved' ? 'Van de website halen' : 'Niet publiceren'}</button>}
                {review.status === 'deleted' && <button type="button" disabled={busyId === review.id} onClick={() => moderate(review, 'pending')} className="btn-secondary min-h-12">Terugzetten naar “Te beoordelen”</button>}
              </div>
            </li>
          ))}
        </ul>
      )}

      <section className="border-t border-denra-line pt-8" aria-labelledby="builtin-reviews">
        <h2 id="builtin-reviews" className="font-serif text-2xl">Vaste reviews ({builtInReviews.length})</h2>
        <p className="mt-2 max-w-2xl text-denra-muted">Deze reviews stonden al op de vorige website en zijn vast in de code opgenomen. Ze worden altijd getoond. Wilt u er een aanpassen of weghalen, vraag dat dan aan de websitebouwer.</p>
        <ul className="mt-4 divide-y divide-denra-line border-y border-denra-line text-[15px]">
          {builtInReviews.map((review) => <li key={review.id} className="flex justify-between gap-4 py-2.5"><span>{review.name}{review.city ? `, ${review.city}` : ''} – {review.project}</span><span className="shrink-0 text-denra-muted">{review.date}</span></li>)}
        </ul>
      </section>
    </div>
  );
}

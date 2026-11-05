import { useCallback, useEffect, useState } from 'react';
import { Eye, EyeOff, Star } from 'lucide-react';
import { hiddenReviewsKey, parseHiddenReviews, parseReviewDates, reviewDatesKey, serializeReviewDates } from '../../hooks/usePublishedReviews';
import { reviews as builtInReviews, reviewIsoDate } from '../../data/reviews';
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
  work_date: string | null;
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
  const [hiddenBuiltIn, setHiddenBuiltIn] = useState<string[]>([]);

  const [dates, setDates] = useState<Record<string, string>>({});

  useEffect(() => {
    client.from('site_content').select('value_nl').eq('key', hiddenReviewsKey).maybeSingle().then(({ data }) => setHiddenBuiltIn(parseHiddenReviews(data?.value_nl)));
    client.from('site_content').select('value_nl').eq('key', reviewDatesKey).maybeSingle().then(({ data }) => setDates(parseReviewDates(data?.value_nl)));
  }, [client]);

  const saveDate = async (id: string, name: string, date: string | null) => {
    const next = { ...dates };
    if (date) next[id] = date;
    else delete next[id];
    setBusyId(id);
    const { error } = Object.keys(next).length
      ? await client.from('site_content').upsert({ key: reviewDatesKey, value_nl: serializeReviewDates(next), value_en: '' })
      : await client.from('site_content').delete().eq('key', reviewDatesKey);
    setBusyId(null);
    if (error) return setMessage({ tone: 'error', text: friendlyError(error) });
    setDates(next);
    setMessage({ tone: 'success', text: date ? `De datum van de review van ${name} is aangepast.` : `De review van ${name} heeft weer de oorspronkelijke datum.` });
  };

  const toggleBuiltIn = async (id: string, name: string) => {
    const next = hiddenBuiltIn.includes(id) ? hiddenBuiltIn.filter((candidate) => candidate !== id) : [...hiddenBuiltIn, id];
    setBusyId(id);
    const { error } = next.length
      ? await client.from('site_content').upsert({ key: hiddenReviewsKey, value_nl: next.join(','), value_en: '' })
      : await client.from('site_content').delete().eq('key', hiddenReviewsKey);
    setBusyId(null);
    if (error) return setMessage({ tone: 'error', text: friendlyError(error) });
    setHiddenBuiltIn(next);
    setMessage({ tone: 'success', text: next.includes(id) ? `De review van ${name} staat niet meer op de website.` : `De review van ${name} staat weer op de website.` });
  };

  const load = useCallback(async () => {
    const { data, error } = await client.from('reviews').select('id, name, email, city, rating, project, text, status, created_at, approved_at, work_date').order('created_at', { ascending: false });
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
              <div className="mt-4">
                <ReviewDateField id={review.id} name={review.name} original={review.work_date ?? review.created_at.slice(0, 10)} changed={dates[review.id]} busy={busyId === review.id} onSave={saveDate} />
              </div>
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
        <p className="mt-2 max-w-2xl text-denra-muted">Deze reviews stonden al op de vorige website. De tekst kunt u niet aanpassen, de datum wel. U kunt ze ook van de website halen en later weer tonen.</p>
        <ul className="mt-4 divide-y divide-denra-line border-y border-denra-line text-[15px]">
          {builtInReviews.map((review) => {
            const hidden = hiddenBuiltIn.includes(review.id);
            return (
              <li key={review.id} className={`flex flex-wrap items-center justify-between gap-3 py-2.5 ${hidden ? 'text-denra-muted' : ''}`}>
                <span className="min-w-0">{review.name}{review.city ? `, ${review.city}` : ''} – {review.project} <span className="text-denra-muted">· {review.rating}/5</span>{hidden && <span className="ml-2 bg-denra-stone px-2 py-0.5 text-[12px]">Verborgen</span>}</span>
                <span className="flex flex-wrap items-center gap-3">
                <ReviewDateField id={review.id} name={review.name} original={reviewIsoDate(review)} changed={dates[review.id]} busy={busyId === review.id} onSave={saveDate} />
                <button type="button" disabled={busyId === review.id} onClick={() => toggleBuiltIn(review.id, review.name)} className="inline-flex min-h-10 items-center gap-2 border border-denra-ink/20 px-3 text-[14px] text-denra-ink hover:bg-denra-stone">
                  {hidden ? <Eye size={16} aria-hidden="true" /> : <EyeOff size={16} aria-hidden="true" />}{hidden ? 'Weer tonen' : 'Verbergen'}
                </button>
                </span>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

/** The date a review shows on the website, with a way back to its original date. */
function ReviewDateField({ id, name, original, changed, busy, onSave }: { id: string; name: string; original: string; changed?: string; busy: boolean; onSave: (id: string, name: string, date: string | null) => void }) {
  const current = changed ?? original;
  const [draft, setDraft] = useState(current);
  useEffect(() => setDraft(current), [current]);
  const today = new Date().toISOString().slice(0, 10);
  const valid = /^\d{4}-\d{2}-\d{2}$/.test(draft) && draft >= '2010-01-01' && draft <= today;

  return (
    <span className="inline-flex flex-wrap items-center gap-2 text-[14px]">
      <span className="text-denra-muted" aria-hidden="true">Datum</span>
      <input id={`review-date-${id}`} type="date" value={draft} min="2010-01-01" max={today} onChange={(event) => setDraft(event.target.value)} aria-label={`Datum van de review van ${name}`} className="min-h-10 border border-denra-ink/20 bg-white px-2 text-[14px]" />
      {draft !== current && <button type="button" disabled={busy || !valid} onClick={() => onSave(id, name, draft === original ? null : draft)} className="btn-primary min-h-10 px-3 text-[14px]">Datum opslaan</button>}
      {draft === current && changed && <button type="button" disabled={busy} onClick={() => onSave(id, name, null)} className="min-h-10 px-2 text-[14px] underline">Oorspronkelijke datum</button>}
    </span>
  );
}

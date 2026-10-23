import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft, Mail, MessageCircle, Phone } from 'lucide-react';
import { formatEuro, formatNumber } from '../../lib/calculator';
import { useAdminClient } from '../auth';
import { formatDate, friendlyError, GuardedLink, LoadingBlock, Notice, PageHeader, Panel, SaveBar, StatusBadge, TextField, useSaveState, useUnsavedChanges } from '../ui';

interface QuoteRequestRow {
  id: string;
  created_at: string;
  status: string;
  language: 'nl' | 'en';
  name: string;
  email: string;
  phone: string;
  city: string;
  service: string;
  message: string;
  room_type: 'badkamer' | 'wc' | null;
  length_m: number | null;
  width_m: number | null;
  area_m2: number | null;
  selected_options: { id: string; label: string; price: number }[];
  estimate_total: number | null;
  client_total: number | null;
  email_status: string;
  admin_notes: string;
}

const statuses = [
  { value: 'nieuw', label: 'Nieuw' },
  { value: 'in_behandeling', label: 'In behandeling' },
  { value: 'offerte_verstuurd', label: 'Offerte verstuurd' },
  { value: 'afgerond', label: 'Afgerond' },
  { value: 'gearchiveerd', label: 'Gearchiveerd' },
];
const serviceLabels: Record<string, string> = { badkamer: 'Badkamerrenovatie', wc: 'WC-renovatie', binnen: 'Binnenrenovatie', stucwerk: 'Stucwerk', schilderwerk: 'Schilderwerk', vloeren: 'Vloeren leggen', plafond: 'Verlaagd plafond & spotjes' };
const emailStatus: Record<string, string> = { sent: 'Beide e-mails verstuurd', partly_sent: 'Niet alle e-mails zijn aangekomen', failed: 'E-mails konden niet worden verstuurd', not_configured: 'E-mail is niet ingesteld; alleen hier opgeslagen', pending: 'Nog niet verstuurd' };
const whatsappNumber = (phone: string) => phone.replace(/[^0-9+]/g, '').replace(/^\+/, '').replace(/^06/, '316').replace(/^0/, '31');

export function RequestsList() {
  const client = useAdminClient();
  const [rows, setRows] = useState<QuoteRequestRow[] | null>(null);
  const [filter, setFilter] = useState<'open' | 'all' | 'gearchiveerd'>('open');
  const [error, setError] = useState('');

  useEffect(() => {
    client.from('quote_requests').select('*').order('created_at', { ascending: false }).limit(500).then(({ data, error: loadError }) => {
      if (loadError) setError(friendlyError(loadError));
      else setRows(data as QuoteRequestRow[]);
    });
  }, [client]);

  const visible = (rows ?? []).filter((row) => (filter === 'all' ? true : filter === 'open' ? !['afgerond', 'gearchiveerd'].includes(row.status) : row.status === 'gearchiveerd'));
  return (
    <div className="space-y-6">
      <PageHeader title="Aanvragen" description="Offerteaanvragen die via de website zijn verstuurd. U ontvangt ze ook per e-mail." />
      <div className="flex flex-wrap gap-2" role="group" aria-label="Welke aanvragen tonen">
        {([['open', 'Open'], ['all', 'Alle'], ['gearchiveerd', 'Archief']] as const).map(([value, label]) => (
          <button key={value} type="button" aria-pressed={filter === value} onClick={() => setFilter(value)} className={`min-h-11 px-4 text-[15px] ${filter === value ? 'bg-denra-ink text-denra-ivory' : 'border border-denra-ink/20'}`}>{label}</button>
        ))}
      </div>
      {error && <Notice tone="error">{error}</Notice>}
      {!rows && !error ? <LoadingBlock /> : visible.length === 0 ? <p className="text-denra-muted">Geen aanvragen in deze lijst.</p> : (
        <ul className="divide-y divide-denra-line border-y border-denra-line">
          {visible.map((row) => (
            <li key={row.id}>
              <GuardedLink to={`/admin/aanvragen/${row.id}`} className="flex min-h-[4.5rem] flex-wrap items-center justify-between gap-3 py-3 hover:bg-white/60">
                <span className="min-w-0">
                  <span className="block text-[17px] font-medium">{row.name}{row.city ? <span className="font-normal text-denra-muted"> · {row.city}</span> : null}</span>
                  <span className="block text-[14px] text-denra-muted">{formatDate(row.created_at)} · {serviceLabels[row.service] ?? row.service}{row.estimate_total !== null ? ` · indicatie ${formatEuro(row.estimate_total)}` : ''}</span>
                </span>
                <StatusBadge status={row.status} />
              </GuardedLink>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function RequestDetail() {
  const { id } = useParams();
  const client = useAdminClient();
  const [row, setRow] = useState<QuoteRequestRow | null>(null);
  const [saved, setSaved] = useState({ status: '', notes: '' });
  const [form, setForm] = useState({ status: '', notes: '' });
  const [error, setError] = useState('');
  const { state, run } = useSaveState();

  const load = useCallback(async () => {
    const { data, error: loadError } = await client.from('quote_requests').select('*').eq('id', id).maybeSingle();
    if (loadError) return setError(friendlyError(loadError));
    if (!data) return setError('Deze aanvraag bestaat niet (meer).');
    const next = data as QuoteRequestRow;
    setRow(next);
    setSaved({ status: next.status, notes: next.admin_notes });
    setForm({ status: next.status, notes: next.admin_notes });
  }, [client, id]);
  useEffect(() => { void load(); }, [load]);

  const dirty = form.status !== saved.status || form.notes !== saved.notes;
  useUnsavedChanges(dirty);

  if (error) return <div className="space-y-6"><PageHeader title="Aanvraag" /><Notice tone="error">{error}</Notice></div>;
  if (!row) return <LoadingBlock />;

  const save = () => run(async () => {
    const { error: saveError } = await client.from('quote_requests').update({ status: form.status, admin_notes: form.notes }).eq('id', row.id);
    if (saveError) throw saveError;
    setSaved(form);
  });
  const mismatch = row.client_total !== null && row.estimate_total !== null && row.client_total !== row.estimate_total;

  return (
    <div className="space-y-8">
      <GuardedLink to="/admin/aanvragen" className="inline-flex min-h-11 items-center gap-2 text-[15px] underline underline-offset-4"><ArrowLeft size={16} aria-hidden="true" />Alle aanvragen</GuardedLink>
      <PageHeader title={row.name} description={`${formatDate(row.created_at)} · ${serviceLabels[row.service] ?? row.service}${row.language === 'en' ? ' · stuurde de aanvraag in het Engels' : ''}`} actions={<StatusBadge status={saved.status} />} />

      <div className="flex flex-col gap-3 sm:flex-row">
        <a href={`tel:${row.phone}`} className="btn-primary min-h-14 text-[16px]"><Phone size={18} aria-hidden="true" />Bellen: {row.phone}</a>
        <a href={`https://wa.me/${whatsappNumber(row.phone)}`} target="_blank" rel="noopener noreferrer" className="btn-secondary min-h-14 text-[16px]"><MessageCircle size={18} aria-hidden="true" />WhatsApp</a>
        <a href={`mailto:${row.email}?subject=${encodeURIComponent('Uw aanvraag bij Denra Badkamers')}`} className="btn-secondary min-h-14 text-[16px]"><Mail size={18} aria-hidden="true" />E-mail</a>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Bericht van de klant">
          <p className="whitespace-pre-line text-[17px] leading-relaxed">{row.message}</p>
          <dl className="mt-5 space-y-1 border-t border-denra-line pt-4 text-[15px]">
            <div><dt className="inline text-denra-muted">E-mail: </dt><dd className="inline break-all">{row.email}</dd></div>
            <div><dt className="inline text-denra-muted">Telefoon: </dt><dd className="inline">{row.phone}</dd></div>
            {row.city && <div><dt className="inline text-denra-muted">Plaats: </dt><dd className="inline">{row.city}</dd></div>}
            <div><dt className="inline text-denra-muted">E-mailmeldingen: </dt><dd className="inline">{emailStatus[row.email_status] ?? row.email_status}</dd></div>
          </dl>
        </Panel>
        <Panel title="Prijsberekening van de klant">
          {row.room_type ? (
            <>
              <dl className="space-y-1 text-[15px]">
                <div className="flex justify-between gap-4"><dt className="text-denra-muted">Ruimte</dt><dd>{row.room_type === 'wc' ? 'WC' : 'Badkamer'}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-denra-muted">Afmetingen</dt><dd>{formatNumber(Number(row.length_m))} × {formatNumber(Number(row.width_m))} m ({formatNumber(Number(row.area_m2))} m²)</dd></div>
              </dl>
              <ul className="mt-4 space-y-1 border-t border-denra-line pt-3 text-[15px]">
                {row.selected_options.length ? row.selected_options.map((option) => <li key={option.id} className="flex justify-between gap-4"><span>{option.label}</span><span>+ {formatEuro(option.price)}</span></li>) : <li className="text-denra-muted">Geen extra opties gekozen</li>}
              </ul>
              <p className="mt-4 flex items-baseline justify-between border-t border-denra-line pt-3"><span className="text-denra-muted">Indicatie (door de server berekend)</span><span className="font-serif text-3xl">{formatEuro(row.estimate_total ?? 0)}</span></p>
              {mismatch && <div className="mt-3"><Notice tone="warning">In de browser van de klant stond {formatEuro(row.client_total ?? 0)}. Mogelijk had de klant de pagina open tijdens een prijswijziging. Het bedrag hierboven is met de prijzen van dat moment berekend.</Notice></div>}
            </>
          ) : <p className="text-denra-muted">De klant heeft geen prijsberekening meegestuurd.</p>}
        </Panel>
      </div>

      <Panel title="Afhandeling">
        <div className="space-y-5">
          <label className="block">
            <span className="mb-2 block text-[15px] font-medium">Status</span>
            <select value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))} className="block min-h-12 w-full border border-denra-ink/25 bg-white px-4 text-[17px] sm:max-w-sm">
              {statuses.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}
            </select>
          </label>
          <TextField label="Eigen notities (alleen voor u zichtbaar)" multiline rows={5} value={form.notes} onChange={(notes) => setForm((current) => ({ ...current, notes }))} maxLength={5000} />
        </div>
      </Panel>
      <SaveBar state={state} dirty={dirty} onSave={save} onReset={() => setForm(saved)} />
    </div>
  );
}

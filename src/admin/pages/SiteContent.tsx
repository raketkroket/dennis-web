import { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, ExternalLink, Plus, RotateCcw, Trash2 } from 'lucide-react';
import { translations } from '../../i18n/translations';
import { faqPages, type Faq, type FaqPage } from '../../content/defaults';
import { faqFromRow, type FaqRow } from '../../content/load';
import { useSiteContent } from '../../content/SiteContentProvider';
import { useAdminClient } from '../auth';
import { contentSections, type ContentField } from '../contentFields';
import { BilingualField, friendlyError, IconButton, ListEditor, LoadingBlock, Notice, PageHeader, Panel, SaveBar, TextField, Toggle, useSaveState, useUnsavedChanges } from '../ui';

type Values = Record<string, { nl: string; en: string }>;

function builtIn(language: 'nl' | 'en', key: string): string {
  const [section, entry] = key.split('.');
  return ((translations[language] as Record<string, Record<string, string>>)[section]?.[entry]) ?? '';
}

const clean = (value: string) => value.replace(/\|/g, '/').trim();

export default function SiteContent() {
  const client = useAdminClient();
  const { reload } = useSiteContent();
  const [tab, setTab] = useState<string>(contentSections[0].id);
  const [saved, setSaved] = useState<Values | null>(null);
  const [draft, setDraft] = useState<Values | null>(null);
  const [loadError, setLoadError] = useState('');
  const { state, run } = useSaveState();

  const allFields = useMemo(() => contentSections.flatMap((section) => section.fields), []);

  const load = useCallback(async () => {
    const { data, error } = await client.from('site_content').select('key, value_nl, value_en');
    if (error) return setLoadError(friendlyError(error));
    const values: Values = {};
    for (const field of allFields) {
      const row = (data as { key: string; value_nl: string; value_en: string }[]).find((candidate) => candidate.key === field.key);
      // An empty English value next to an edited Dutch one means "show the Dutch text".
      values[field.key] = row
        ? { nl: (row.value_nl.trim() ? row.value_nl : row.value_nl ? '' : builtIn('nl', field.key)).trim(), en: (row.value_en || (row.value_nl ? '' : builtIn('en', field.key))).trim() }
        : { nl: builtIn('nl', field.key), en: builtIn('en', field.key) };
    }
    setSaved(values);
    setDraft(values);
  }, [client, allFields]);
  useEffect(() => { void load(); }, [load]);

  const dirty = Boolean(draft && saved && JSON.stringify(draft) !== JSON.stringify(saved));
  useUnsavedChanges(dirty);

  const save = () => run(async () => {
    if (!draft || !saved) return;
    const changed = allFields.filter((field) => JSON.stringify(draft[field.key]) !== JSON.stringify(saved[field.key]));
    const upserts: { key: string; value_nl: string; value_en: string }[] = [];
    const removals: string[] = [];
    for (const field of changed) {
      const value = draft[field.key];
      // Only store what differs from the built-in text, so later
      // improvements to the built-in wording still reach the site.
      // A single space means "deliberately empty" (used to hide a figure).
      const hidden = field.key.endsWith('Value') && !value.nl.trim();
      const dutchEdited = value.nl.trim() !== builtIn('nl', field.key);
      const nl = hidden ? ' ' : dutchEdited ? value.nl.trim() : '';
      // With edited Dutch, English is stored as shown: kept, rewritten or
      // emptied (empty = English visitors see the Dutch text).
      const en = hidden ? ' ' : dutchEdited ? value.en.trim() : value.en.trim() === builtIn('en', field.key) ? '' : value.en.trim();
      if (!nl && !en) removals.push(field.key);
      else upserts.push({ key: field.key, value_nl: nl, value_en: en });
    }
    const emptyRequired = changed.find((field) => !draft[field.key].nl.trim() && !field.key.endsWith('Value'));
    if (emptyRequired) throw new Error(`“${emptyRequired.label}” mag niet leeg zijn.`);
    if (upserts.length) {
      const { error } = await client.from('site_content').upsert(upserts);
      if (error) throw error;
    }
    if (removals.length) {
      const { error } = await client.from('site_content').delete().in('key', removals);
      if (error) throw error;
    }
    setSaved(draft);
    await reload();
  });

  const section = contentSections.find((candidate) => candidate.id === tab);

  return (
    <div className="space-y-6">
      <PageHeader title="Website aanpassen" description="Pas de teksten op de website aan. Wat u hier niet wijzigt, blijft de huidige tekst. Engelse teksten mag u leeg laten." />
      <div className="-mx-4 overflow-x-auto px-4">
        <div className="flex min-w-max gap-2" role="tablist" aria-label="Onderdeel van de website">
          {contentSections.map((candidate) => ({ id: candidate.id, title: candidate.title })).map((candidate) => (
            <button
              key={candidate.id}
              type="button"
              role="tab"
              aria-selected={tab === candidate.id}
              onClick={() => setTab(candidate.id)}
              className={`min-h-11 px-4 text-[15px] ${tab === candidate.id ? 'bg-denra-ink text-denra-ivory' : 'border border-denra-ink/20'}`}
            >
              {candidate.title}
            </button>
          ))}
        </div>
      </div>

      {loadError && <Notice tone="error">{loadError}</Notice>}
      {tab === 'faq' ? <FaqEditor /> : !draft || !section ? (!loadError && <LoadingBlock />) : (
        <>
          <Panel title={section.title} description={<>{section.description} <a href={section.page} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 underline underline-offset-4">Bekijk deze pagina<ExternalLink size={14} aria-hidden="true" /></a></>}>
            <div className="space-y-8">
              {section.fields.map((field) => (
                <FieldEditor key={field.key} field={field} value={draft[field.key]} onChange={(value) => setDraft((current) => current && ({ ...current, [field.key]: value }))} />
              ))}
            </div>
          </Panel>
          <SaveBar state={state} dirty={dirty} onSave={save} onReset={() => setDraft(saved)} saveLabel="Teksten opslaan" />
        </>
      )}
    </div>
  );
}

function FieldEditor({ field, value, onChange }: { field: ContentField; value: { nl: string; en: string }; onChange: (value: { nl: string; en: string }) => void }) {
  const defaults = { nl: builtIn('nl', field.key), en: builtIn('en', field.key) };
  const isDefault = value.nl === defaults.nl && value.en === defaults.en;
  const staleEnglish = value.nl !== defaults.nl && value.en === defaults.en && defaults.en !== '';
  const reset = !isDefault && (
    <button type="button" onClick={() => onChange(defaults)} className="inline-flex min-h-10 items-center gap-1.5 text-[14px] text-denra-muted underline underline-offset-4 hover:text-denra-ink">
      <RotateCcw size={14} aria-hidden="true" />Oorspronkelijke tekst terugzetten
    </button>
  );
  const englishWarning = staleEnglish && <p className="text-[14px] text-[#5E4419]">Let op: de Engelse tekst is nog de oude versie. Pas hem aan of maak hem leeg om de Nederlandse tekst te tonen.</p>;

  if (field.kind === 'list') {
    const split = (text: string) => (text ? text.split('|') : []);
    return (
      <div className="space-y-4 border-b border-denra-line pb-8 last:border-0">
        <div className="grid gap-6 lg:grid-cols-2">
          <ListEditor label={`${field.label} – Nederlands`} items={split(value.nl)} onChange={(items) => onChange({ ...value, nl: items.map(clean).join('|') })} help={field.help} />
          <ListEditor label={`${field.label} – Engels`} items={split(value.en)} onChange={(items) => onChange({ ...value, en: items.map(clean).join('|') })} />
        </div>
        {englishWarning}{reset}
      </div>
    );
  }
  if (field.kind === 'lines') {
    const [nl1 = '', nl2 = ''] = value.nl.split('|');
    const [en1 = '', en2 = ''] = value.en.split('|');
    return (
      <fieldset className="space-y-4 border-b border-denra-line pb-8 last:border-0">
        <legend className="mb-3 text-[15px] font-medium">{field.label}</legend>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-3">
            <TextField label="Nederlands, regel 1" value={nl1} onChange={(line) => onChange({ ...value, nl: [clean(line), nl2].join('|') })} />
            <TextField label="Nederlands, regel 2" value={nl2} onChange={(line) => onChange({ ...value, nl: [nl1, clean(line)].join('|') })} />
          </div>
          <div className="space-y-3">
            <TextField label="Engels, regel 1" value={en1} onChange={(line) => onChange({ ...value, en: [clean(line), en2].join('|') })} />
            <TextField label="Engels, regel 2" value={en2} onChange={(line) => onChange({ ...value, en: [en1, clean(line)].join('|') })} />
          </div>
        </div>
        {englishWarning}{reset}
      </fieldset>
    );
  }
  return (
    <div className="space-y-2 border-b border-denra-line pb-8 last:border-0">
      <BilingualField label={field.label} help={field.help} multiline={field.kind === 'textarea'} nl={value.nl} en={value.en} onChangeNl={(nl) => onChange({ ...value, nl: clean(nl) })} onChangeEn={(en) => onChange({ ...value, en: clean(en) })} />
      {englishWarning}{reset}
    </div>
  );
}

function FaqEditor() {
  const client = useAdminClient();
  const { reload } = useSiteContent();
  const [page, setPage] = useState<FaqPage>('algemeen');
  const [items, setItems] = useState<Faq[] | null>(null);
  const [saved, setSaved] = useState('');
  const [error, setError] = useState('');
  const { state, run } = useSaveState();

  useEffect(() => {
    setItems(null);
    client.from('faqs').select('*').eq('page', page).order('sort_order').then(({ data, error: loadError }) => {
      if (loadError) return setError(friendlyError(loadError));
      const next = (data as FaqRow[]).map(faqFromRow);
      setItems(next);
      setSaved(JSON.stringify(next));
    });
  }, [client, page]);

  const dirty = items !== null && JSON.stringify(items) !== saved;
  useUnsavedChanges(dirty);
  const update = (index: number, patch: Partial<Faq>) => setItems((current) => current?.map((item, position) => (position === index ? { ...item, ...patch } : item)) ?? null);
  const move = (index: number, direction: number) => setItems((current) => {
    if (!current) return current;
    const next = [...current];
    const [item] = next.splice(index, 1);
    next.splice(index + direction, 0, item);
    return next;
  });

  const save = () => run(async () => {
    if (!items) return;
    const incomplete = items.findIndex((item) => item.questionNl.trim().length < 3 || item.answerNl.trim().length < 3);
    if (incomplete >= 0) throw new Error(`Vraag ${incomplete + 1} heeft nog geen Nederlandse vraag of antwoord.`);
    const { error: saveError } = await client.rpc('save_faqs', {
      faq_page: page,
      items: items.map((item) => ({ id: item.id, question_nl: item.questionNl.trim(), answer_nl: item.answerNl.trim(), question_en: item.questionEn.trim(), answer_en: item.answerEn.trim(), is_visible: item.isVisible })),
    });
    if (saveError) throw saveError;
    setSaved(JSON.stringify(items));
    await reload();
  });

  return (
    <>
      <Panel title="Veelgestelde vragen" description="Kies de pagina waarop de vragen staan. Algemene vragen staan op de homepage en de contactpagina.">
        <div className="mb-6 flex flex-wrap gap-2">
          {faqPages.map((option) => (
            <button key={option.id} type="button" aria-pressed={page === option.id} onClick={() => { if (!dirty || window.confirm('De wijzigingen op deze pagina zijn nog niet opgeslagen. Toch wisselen?')) setPage(option.id); }} className={`min-h-11 px-4 text-[15px] ${page === option.id ? 'bg-denra-ink text-denra-ivory' : 'border border-denra-ink/20'}`}>{option.label}</button>
          ))}
        </div>
        {error && <Notice tone="error">{error}</Notice>}
        {!items ? <LoadingBlock /> : (
          <>
            {items.length === 0 && <p className="text-denra-muted">Er staan nog geen vragen op deze pagina.</p>}
            <ol className="space-y-5">
              {items.map((item, index) => (
                <li key={item.id} className="border border-denra-line bg-white p-4 sm:p-5">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-[15px] font-medium">Vraag {index + 1}</p>
                    <div className="flex items-center">
                      <IconButton label="Omhoog" onClick={() => move(index, -1)} disabled={index === 0}><ArrowUp size={18} /></IconButton>
                      <IconButton label="Omlaag" onClick={() => move(index, 1)} disabled={index === items.length - 1}><ArrowDown size={18} /></IconButton>
                      <IconButton label="Vraag verwijderen" tone="danger" onClick={() => { if (window.confirm('Deze vraag verwijderen?')) setItems(items.filter((_, position) => position !== index)); }}><Trash2 size={18} /></IconButton>
                    </div>
                  </div>
                  <div className="space-y-5">
                    <BilingualField label="Vraag" required nl={item.questionNl} en={item.questionEn} onChangeNl={(questionNl) => update(index, { questionNl })} onChangeEn={(questionEn) => update(index, { questionEn })} />
                    <BilingualField label="Antwoord" required multiline nl={item.answerNl} en={item.answerEn} onChangeNl={(answerNl) => update(index, { answerNl })} onChangeEn={(answerEn) => update(index, { answerEn })} />
                    <Toggle label="Tonen op de website" checked={item.isVisible} onChange={(isVisible) => update(index, { isVisible })} />
                  </div>
                </li>
              ))}
            </ol>
            <button type="button" onClick={() => setItems([...items, { id: `faq-${page}-${crypto.randomUUID().slice(0, 8)}`, page, questionNl: '', answerNl: '', questionEn: '', answerEn: '', isVisible: true, sortOrder: items.length * 10 }])} className="mt-5 inline-flex min-h-12 items-center gap-2 border border-dashed border-denra-ink/30 px-4 text-[16px] hover:border-denra-ink">
              <Plus size={18} aria-hidden="true" />Vraag toevoegen
            </button>
          </>
        )}
      </Panel>
      <SaveBar state={state} dirty={dirty} onSave={save} onReset={() => setItems(JSON.parse(saved))} saveLabel="Vragen opslaan" />
    </>
  );
}

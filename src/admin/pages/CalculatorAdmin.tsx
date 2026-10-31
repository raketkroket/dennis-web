import { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import {
  calculateEstimate,
  defaultCalculatorConfig,
  formatEuro,
  formatNumber,
  optionGroups,
  optionsForRoom,
  parseDecimal,
  toggleOption,
  validateCalculatorConfig,
  type CalculatorConfig,
  type CalculatorOption,
  type OptionGroupId,
  type RoomType,
} from '../../lib/calculator';
import { calculatorToPayload } from '../../lib/calculatorRows';
import { loadCalculatorConfig } from '../../content/load';
import { useSiteContent } from '../../content/SiteContentProvider';
import EstimateBreakdown from '../../components/EstimateBreakdown';
import { useAdminClient } from '../auth';
import { slugify } from '../data';
import { BilingualField, FieldShell, friendlyError, GuardedLink, IconButton, LoadingBlock, Notice, PageHeader, Panel, SaveBar, Toggle, useSaveState, useUnsavedChanges } from '../ui';

/** Parses "7950", "7.950" (prices) or "2,5" / "2.5" (areas) as typed by Dennis. */
function parseAdminNumber(text: string, decimals: boolean): number | null {
  const cleaned = decimals ? text.replace(/\s/g, '') : text.replace(/[.\s]/g, '');
  if (!/^\d{1,6}([.,]\d{1,2})?$/.test(cleaned)) return null;
  return Number(cleaned.replace(',', '.'));
}

const showNumber = (value: number, decimals: boolean) => (!Number.isFinite(value) ? '' : decimals ? formatNumber(value, 'nl', 2) : String(value));

/** Number input that accepts Dutch notation and keeps what is typed until it is valid. */
function NumberField({ label, value, onChange, prefix, suffix, help, decimals = false }: { label: string; value: number; onChange: (value: number) => void; prefix?: string; suffix?: string; help?: string; decimals?: boolean }) {
  const [text, setText] = useState(() => showNumber(value, decimals));
  useEffect(() => {
    // Follow changes made elsewhere (for example "undo changes").
    if (Number.isFinite(value) && parseAdminNumber(text, decimals) !== value) setText(showNumber(value, decimals));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  const parsed = parseAdminNumber(text, decimals);
  const error = text.trim() === '' ? 'Vul een getal in.' : parsed === null ? (decimals ? 'Gebruik alleen cijfers, bijvoorbeeld 2,5.' : 'Gebruik een heel bedrag, bijvoorbeeld 750.') : !decimals && !Number.isInteger(parsed) ? 'Gebruik een heel bedrag, zonder centen.' : undefined;
  return (
    <FieldShell label={label} help={help} error={error}>
      {({ id, describedBy, invalid }) => (
        <div className="relative">
          {prefix && <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-denra-muted" aria-hidden="true">{prefix}</span>}
          <input
            id={id}
            inputMode={decimals ? 'decimal' : 'numeric'}
            value={text}
            aria-describedby={describedBy}
            aria-invalid={invalid}
            onChange={(event) => {
              setText(event.target.value);
              const next = parseAdminNumber(event.target.value, decimals);
              onChange(next === null || (!decimals && !Number.isInteger(next)) ? Number.NaN : next);
            }}
            className={`block min-h-12 w-full border border-denra-ink/25 bg-white px-4 text-[17px] tabular-nums aria-[invalid=true]:border-[#A33B32] ${prefix ? 'pl-9' : ''} ${suffix ? 'pr-16' : ''}`}
          />
          {suffix && <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-denra-muted" aria-hidden="true">{suffix}</span>}
        </div>
      )}
    </FieldShell>
  );
}

export default function CalculatorAdmin() {
  const client = useAdminClient();
  const { reload } = useSiteContent();
  const [saved, setSaved] = useState<CalculatorConfig | null>(null);
  const [draft, setDraft] = useState<CalculatorConfig | null>(null);
  const [newIds, setNewIds] = useState<string[]>([]);
  const [loadError, setLoadError] = useState('');
  const [preview, setPreview] = useState<{ roomType: RoomType; length: string; width: string; optionIds: string[] }>({ roomType: 'badkamer', length: '3', width: '2', optionIds: [] });
  const { state, run } = useSaveState();

  const load = useCallback(() => loadCalculatorConfig(client)
    .then((config) => {
      const value = config ?? defaultCalculatorConfig;
      setSaved(value);
      setDraft(value);
    })
    .catch((error) => setLoadError(friendlyError(error))), [client]);
  useEffect(() => { void load(); }, [load]);

  const dirty = Boolean(draft && saved && JSON.stringify(draft) !== JSON.stringify(saved));
  useUnsavedChanges(dirty);
  const problems = useMemo(() => (draft ? validateCalculatorConfig(draft) : []), [draft]);

  if (loadError) return <div className="space-y-6"><PageHeader title="Calculator en prijzen" /><Notice tone="error">{loadError}</Notice></div>;
  if (!draft || !saved) return <LoadingBlock />;

  const setRoom = (roomType: RoomType, patch: Partial<CalculatorConfig['rooms'][number]>) => setDraft((current) => current && ({ ...current, rooms: current.rooms.map((room) => (room.roomType === roomType ? { ...room, ...patch } : room)) }));
  const setOption = (id: string, patch: Partial<CalculatorOption>) => setDraft((current) => {
    if (!current) return current;
    const rename = patch.labelNl !== undefined && newIds.includes(id);
    const nextId = rename ? slugify(patch.labelNl as string).replace(/-/g, '_') || id : id;
    if (rename && nextId !== id && current.options.some((option) => option.id === nextId)) return { ...current, options: current.options.map((option) => (option.id === id ? { ...option, ...patch } : option)) };
    if (rename && nextId !== id) setNewIds((ids) => ids.map((candidate) => (candidate === id ? nextId : candidate)));
    return {
      ...current,
      options: current.options.map((option) => {
        if (option.id === id) return { ...option, ...patch, id: nextId };
        return nextId !== id ? { ...option, conflictsWith: option.conflictsWith.map((other) => (other === id ? nextId : other)) } : option;
      }),
    };
  });
  // "Cannot be combined" is kept two-way so both options show the warning.
  const setConflict = (id: string, otherId: string, conflict: boolean) => setDraft((current) => current && ({
    ...current,
    options: current.options.map((option) => {
      if (option.id === id) return { ...option, conflictsWith: conflict ? [...new Set([...option.conflictsWith, otherId])] : option.conflictsWith.filter((other) => other !== otherId) };
      if (option.id === otherId) return { ...option, conflictsWith: conflict ? [...new Set([...option.conflictsWith, id])] : option.conflictsWith.filter((other) => other !== id) };
      return option;
    }),
  }));
  const moveOption = (id: string, direction: number) => setDraft((current) => {
    if (!current) return current;
    const group = current.options.find((option) => option.id === id)?.group;
    const sameGroup = current.options.filter((option) => option.group === group);
    const index = sameGroup.findIndex((option) => option.id === id);
    const swapWith = sameGroup[index + direction];
    if (!swapWith) return current;
    const options = [...current.options];
    const a = options.findIndex((option) => option.id === id);
    const b = options.findIndex((option) => option.id === swapWith.id);
    [options[a], options[b]] = [options[b], options[a]];
    return { ...current, options: options.map((option, position) => ({ ...option, sortOrder: (position + 1) * 10 })) };
  });
  const removeOption = (option: CalculatorOption) => {
    if (!window.confirm(`De optie “${option.labelNl}” verwijderen? Bezoekers kunnen hem daarna niet meer kiezen.`)) return;
    setDraft((current) => current && ({ ...current, options: current.options.filter((candidate) => candidate.id !== option.id).map((candidate) => ({ ...candidate, conflictsWith: candidate.conflictsWith.filter((other) => other !== option.id) })) }));
  };
  const addOption = (group: OptionGroupId) => {
    const id = `nieuwe_optie_${Math.random().toString(36).slice(2, 7)}`;
    setNewIds((ids) => [...ids, id]);
    setDraft((current) => current && ({ ...current, options: [...current.options, { id, group, labelNl: '', labelEn: '', price: 0, includedNl: '', includedEn: '', noteNl: '', noteEn: '', rooms: ['badkamer', 'wc'], conflictsWith: [], isActive: true, sortOrder: (current.options.length + 1) * 10 }] }));
  };

  const save = async () => {
    if (problems.length) return;
    if (!window.confirm('De nieuwe prijzen staan direct op de website en worden gebruikt voor nieuwe offerteaanvragen. Opslaan?')) return;
    await run(async () => {
      const { error } = await client.rpc('save_calculator', { config: calculatorToPayload(draft) });
      if (error) throw error;
      setSaved(draft);
      setNewIds([]);
      await reload();
    });
  };

  const length = parseDecimal(preview.length);
  const width = parseDecimal(preview.width);
  const estimateFor = (config: CalculatorConfig) => {
    if (length === null || width === null) return null;
    const ids = preview.optionIds.filter((id) => config.options.some((option) => option.id === id && option.isActive && option.rooms.includes(preview.roomType)));
    const result = calculateEstimate(config, { roomType: preview.roomType, length, width, optionIds: ids });
    return result.ok ? result.estimate : null;
  };
  const draftEstimate = problems.length ? null : estimateFor(draft);
  const savedEstimate = estimateFor(saved);
  const inputClass = 'block min-h-12 w-full border border-denra-ink/25 bg-white px-4 text-[17px]';

  return (
    <div className="space-y-8">
      <PageHeader title="Calculator en prijzen" description={<>De prijzen die bezoekers in de prijscalculator zien en die bij een offerteaanvraag worden meegestuurd. De website zet er “incl. btw” bij; die tekst past u aan bij <GuardedLink to="/admin/website" className="underline">Website aanpassen</GuardedLink>.</>} />

      {draft.rooms.map((room) => (
        <Panel key={room.roomType} title={`Basisprijs ${room.labelNl.toLowerCase()}`} description="De basisprijs geldt tot een bepaalde oppervlakte. Daarboven komt een bedrag per extra m² bij.">
          <div className="space-y-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <NumberField label="Basisprijs" prefix="€" value={room.basePrice} onChange={(basePrice) => setRoom(room.roomType, { basePrice })} />
              <NumberField label="Geldt tot" suffix="m²" decimals value={room.includedArea} onChange={(includedArea) => setRoom(room.roomType, { includedArea, tiers: room.tiers.map((tier, index) => (index === 0 ? { ...tier, fromArea: includedArea } : tier)) })} />
            </div>
            <fieldset>
              <legend className="mb-3 text-[15px] font-medium">Prijs per extra m²</legend>
              <ol className="space-y-3">
                {[...room.tiers].sort((a, b) => a.fromArea - b.fromArea).map((tier, index, tiers) => (
                  <li key={index} className="grid items-end gap-3 border border-denra-line bg-white p-3 sm:grid-cols-[1fr_1fr_auto]">
                    {index === 0 ? (
                      <p className="text-[15px] text-denra-muted sm:pb-3">Vanaf {formatNumber(room.includedArea)} m² (einde basisprijs)</p>
                    ) : (
                      <NumberField label="Vanaf" suffix="m²" decimals value={tier.fromArea} onChange={(fromArea) => setRoom(room.roomType, { tiers: tiers.map((candidate, position) => (position === index ? { ...candidate, fromArea } : candidate)) })} />
                    )}
                    <NumberField label="Prijs per m²" prefix="€" value={tier.ratePerM2} onChange={(ratePerM2) => setRoom(room.roomType, { tiers: tiers.map((candidate, position) => (position === index ? { ...candidate, ratePerM2 } : candidate)) })} />
                    {index > 0 ? <IconButton label="Prijsregel verwijderen" tone="danger" onClick={() => setRoom(room.roomType, { tiers: tiers.filter((_, position) => position !== index) })}><Trash2 size={18} /></IconButton> : <span />}
                  </li>
                ))}
              </ol>
              <button type="button" onClick={() => setRoom(room.roomType, { tiers: [...room.tiers, { fromArea: Math.max(...room.tiers.map((tier) => tier.fromArea), room.includedArea) + 3, ratePerM2: room.tiers[room.tiers.length - 1]?.ratePerM2 ?? 0 }] })} className="mt-3 inline-flex min-h-11 items-center gap-2 border border-dashed border-denra-ink/30 px-4 text-[15px] hover:border-denra-ink">
                <Plus size={16} aria-hidden="true" />Prijsregel toevoegen (vanaf een grotere oppervlakte)
              </button>
            </fieldset>
            <BilingualField label="Naam van de ruimte" nl={room.labelNl} en={room.labelEn} onChangeNl={(labelNl) => setRoom(room.roomType, { labelNl })} onChangeEn={(labelEn) => setRoom(room.roomType, { labelEn })} />
            <BilingualField label="Korte omschrijving" nl={room.descriptionNl} en={room.descriptionEn} onChangeNl={(descriptionNl) => setRoom(room.roomType, { descriptionNl })} onChangeEn={(descriptionEn) => setRoom(room.roomType, { descriptionEn })} />
            <Toggle label="Te kiezen in de calculator" checked={room.isActive} onChange={(isActive) => setRoom(room.roomType, { isActive })} />
          </div>
        </Panel>
      ))}

      {optionGroups.map((group) => {
        const options = draft.options.filter((option) => option.group === group.id);
        return (
          <Panel key={group.id} title={`Opties: ${group.labelNl.toLowerCase()}`}>
            <ol className="space-y-5">
              {options.map((option, index) => (
                <li key={option.id} className="border border-denra-line bg-white p-4 sm:p-5">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-[17px] font-medium">{option.labelNl || 'Nieuwe optie'} <span className="font-normal text-denra-muted">· {formatEuro(Number.isFinite(option.price) ? option.price : 0)}</span>{!option.isActive && <span className="ml-2 text-[14px] text-denra-muted">(uitgeschakeld)</span>}</p>
                    <div className="flex">
                      <IconButton label="Omhoog" onClick={() => moveOption(option.id, -1)} disabled={index === 0}><ArrowUp size={18} /></IconButton>
                      <IconButton label="Omlaag" onClick={() => moveOption(option.id, 1)} disabled={index === options.length - 1}><ArrowDown size={18} /></IconButton>
                      <IconButton label={`${option.labelNl || 'Optie'} verwijderen`} tone="danger" onClick={() => removeOption(option)}><Trash2 size={18} /></IconButton>
                    </div>
                  </div>
                  <div className="space-y-5">
                    <div className="grid gap-5 lg:grid-cols-[2fr_1fr]">
                      <BilingualField label="Naam" required nl={option.labelNl} en={option.labelEn} onChangeNl={(labelNl) => setOption(option.id, { labelNl })} onChangeEn={(labelEn) => setOption(option.id, { labelEn })} />
                      <NumberField label="Prijs" prefix="€" value={option.price} onChange={(price) => setOption(option.id, { price })} />
                    </div>
                    <BilingualField label="Wat is inbegrepen" nl={option.includedNl} en={option.includedEn} onChangeNl={(includedNl) => setOption(option.id, { includedNl })} onChangeEn={(includedEn) => setOption(option.id, { includedEn })} />
                    <BilingualField label="Let op (wat níet is inbegrepen)" nl={option.noteNl} en={option.noteEn} onChangeNl={(noteNl) => setOption(option.id, { noteNl })} onChangeEn={(noteEn) => setOption(option.id, { noteEn })} />
                    <div className="grid gap-5 lg:grid-cols-3">
                      <fieldset>
                        <legend className="mb-2 text-[15px] font-medium">Te kiezen bij</legend>
                        {draft.rooms.map((room) => (
                          <label key={room.roomType} className="flex min-h-11 items-center gap-3 text-[16px]">
                            <input type="checkbox" className="h-5 w-5 accent-c-231a12" checked={option.rooms.includes(room.roomType)} onChange={(event) => setOption(option.id, { rooms: event.target.checked ? [...option.rooms, room.roomType] : option.rooms.filter((candidate) => candidate !== room.roomType) })} />
                            {room.labelNl}
                          </label>
                        ))}
                      </fieldset>
                      <label className="block">
                        <span className="mb-2 block text-[15px] font-medium">Groep</span>
                        <select value={option.group} onChange={(event) => setOption(option.id, { group: event.target.value as OptionGroupId })} className={inputClass}>
                          {optionGroups.map((candidate) => <option key={candidate.id} value={candidate.id}>{candidate.labelNl}</option>)}
                        </select>
                      </label>
                      <Toggle label="Te kiezen op de website" checked={option.isActive} onChange={(isActive) => setOption(option.id, { isActive })} />
                    </div>
                    <details className="border-t border-denra-line pt-3">
                      <summary className="min-h-11 cursor-pointer py-2 text-[15px] font-medium">
                        Kan niet samen met… {option.conflictsWith.length ? `(${option.conflictsWith.map((id) => draft.options.find((candidate) => candidate.id === id)?.labelNl ?? id).join(', ')})` : '(geen)'}
                      </summary>
                      <p className="mb-2 text-[14px] text-denra-muted">Vink opties aan die hetzelfde werk dekken. Kiest een bezoeker de ene, dan vervalt de andere, zodat niets dubbel wordt gerekend.</p>
                      <div className="grid gap-x-6 sm:grid-cols-2">
                        {draft.options.filter((other) => other.id !== option.id).map((other) => (
                          <label key={other.id} className="flex min-h-11 items-center gap-3 text-[15px]">
                            <input type="checkbox" className="h-5 w-5 accent-c-231a12" checked={option.conflictsWith.includes(other.id)} onChange={(event) => setConflict(option.id, other.id, event.target.checked)} />
                            {other.labelNl || 'Nieuwe optie'}
                          </label>
                        ))}
                      </div>
                    </details>
                  </div>
                </li>
              ))}
            </ol>
            <button type="button" onClick={() => addOption(group.id)} className="mt-4 inline-flex min-h-12 items-center gap-2 border border-dashed border-denra-ink/30 px-4 text-[16px] hover:border-denra-ink">
              <Plus size={18} aria-hidden="true" />Optie toevoegen aan {group.labelNl.toLowerCase()}
            </button>
          </Panel>
        );
      })}

      <Panel title="Voorbeeldberekening" description="Probeer uw wijzigingen uit voordat u ze opslaat. Links de nieuwe prijs, rechts wat er nu op de website staat.">
        <div className="grid gap-5 sm:grid-cols-3">
          <label className="block">
            <span className="mb-2 block text-[15px] font-medium">Ruimte</span>
            <select value={preview.roomType} onChange={(event) => setPreview((current) => ({ ...current, roomType: event.target.value as RoomType, optionIds: [] }))} className={inputClass}>
              {draft.rooms.map((room) => <option key={room.roomType} value={room.roomType}>{room.labelNl}</option>)}
            </select>
          </label>
          <label className="block"><span className="mb-2 block text-[15px] font-medium">Lengte (m)</span><input inputMode="decimal" value={preview.length} onChange={(event) => setPreview((current) => ({ ...current, length: event.target.value }))} className={inputClass} /></label>
          <label className="block"><span className="mb-2 block text-[15px] font-medium">Breedte (m)</span><input inputMode="decimal" value={preview.width} onChange={(event) => setPreview((current) => ({ ...current, width: event.target.value }))} className={inputClass} /></label>
        </div>
        <fieldset className="mt-5">
          <legend className="mb-2 text-[15px] font-medium">Opties</legend>
          <div className="grid gap-x-6 sm:grid-cols-2">
            {optionsForRoom(problems.length ? saved : draft, preview.roomType).map((option) => (
              <label key={option.id} className="flex min-h-11 items-center gap-3 text-[15px]">
                <input type="checkbox" className="h-5 w-5 accent-c-231a12" checked={preview.optionIds.includes(option.id)} onChange={() => setPreview((current) => ({ ...current, optionIds: toggleOption(draft, current.optionIds, option.id) }))} />
                {option.labelNl} (+ {formatEuro(Number.isFinite(option.price) ? option.price : 0)})
              </label>
            ))}
          </div>
        </fieldset>
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="border border-denra-ink p-4">
            <p className="mb-3 text-[15px] font-medium">Met uw wijzigingen</p>
            {draftEstimate ? <EstimateBreakdown estimate={draftEstimate} config={draft} compact /> : <p className="text-denra-muted">{problems.length ? 'Los eerst de meldingen hieronder op.' : 'Vul een geldige lengte en breedte in (0,5 tot 20 meter).'}</p>}
          </div>
          <div className="border border-denra-line p-4 opacity-80">
            <p className="mb-3 text-[15px] font-medium">Nu op de website</p>
            {savedEstimate ? <EstimateBreakdown estimate={savedEstimate} config={saved} compact /> : <p className="text-denra-muted">Vul een geldige lengte en breedte in.</p>}
          </div>
        </div>
      </Panel>

      {problems.length > 0 && (
        <Notice tone="error">
          <p className="font-medium">Los dit eerst op voordat u kunt opslaan:</p>
          <ul className="mt-1 list-disc pl-5">{problems.map((problem) => <li key={problem}>{problem}</li>)}</ul>
        </Notice>
      )}
      <SaveBar state={state} dirty={dirty} disabled={problems.length > 0} onSave={save} onReset={() => { setDraft(saved); setNewIds([]); }} saveLabel="Prijzen opslaan" />
    </div>
  );
}

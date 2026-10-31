import { createContext, useCallback, useContext, useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { Link, useNavigate, type LinkProps } from 'react-router-dom';
import { ArrowDown, ArrowUp, Check, Loader2, Plus, Trash2, TriangleAlert } from 'lucide-react';

// ── Unsaved changes ─────────────────────────────────────────────────────

const leaveMessage = 'Er zijn wijzigingen die nog niet zijn opgeslagen. Wilt u deze pagina toch verlaten?';

interface GuardValue {
  setDirty: (source: string, dirty: boolean) => void;
  confirmLeave: () => boolean;
}

const GuardContext = createContext<GuardValue>({ setDirty: () => undefined, confirmLeave: () => true });

export function UnsavedChangesProvider({ children }: { children: ReactNode }) {
  // Several editors can be on one page; each reports its own state.
  const dirtySources = useRef(new Set<string>());
  const setDirty = useCallback((source: string, dirty: boolean) => {
    if (dirty) dirtySources.current.add(source);
    else dirtySources.current.delete(source);
  }, []);
  const confirmLeave = useCallback(() => {
    if (!dirtySources.current.size) return true;
    const leave = window.confirm(leaveMessage);
    if (leave) dirtySources.current.clear();
    return leave;
  }, []);

  useEffect(() => {
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!dirtySources.current.size) return;
      event.preventDefault();
      event.returnValue = leaveMessage;
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, []);

  return <GuardContext.Provider value={{ setDirty, confirmLeave }}>{children}</GuardContext.Provider>;
}

/** Marks the current page as having unsaved changes while `dirty` is true. */
// eslint-disable-next-line react-refresh/only-export-components
export function useUnsavedChanges(dirty: boolean) {
  const { setDirty } = useContext(GuardContext);
  const source = useId();
  useEffect(() => {
    setDirty(source, dirty);
    return () => setDirty(source, false);
  }, [dirty, setDirty, source]);
}

// eslint-disable-next-line react-refresh/only-export-components
export function useGuard() {
  return useContext(GuardContext);
}

/** A link that asks before leaving a page with unsaved changes. */
export function GuardedLink({ onClick, ...props }: LinkProps) {
  const { confirmLeave } = useGuard();
  return (
    <Link
      {...props}
      onClick={(event) => {
        if (!confirmLeave()) event.preventDefault();
        onClick?.(event);
      }}
    />
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useGuardedNavigate() {
  const navigate = useNavigate();
  const { confirmLeave } = useGuard();
  return useCallback((to: string) => {
    if (confirmLeave()) navigate(to);
  }, [confirmLeave, navigate]);
}

// ── Layout pieces ───────────────────────────────────────────────────────

export function PageHeader({ title, description, actions }: { title: string; description?: ReactNode; actions?: ReactNode }) {
  return (
    <header className="flex flex-col gap-4 border-b border-denra-line pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="font-serif text-4xl leading-tight text-denra-ink">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-[16px] leading-relaxed text-denra-muted">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-3">{actions}</div>}
    </header>
  );
}

export function Panel({ title, description, children, className = '' }: { title?: string; description?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`border border-denra-line bg-white/70 p-5 sm:p-6 ${className}`}>
      {title && <h2 className="font-serif text-2xl text-denra-ink">{title}</h2>}
      {description && <p className="mt-1 text-[15px] leading-relaxed text-denra-muted">{description}</p>}
      <div className={title || description ? 'mt-5' : ''}>{children}</div>
    </section>
  );
}

export function Notice({ tone = 'info', children }: { tone?: 'info' | 'success' | 'error' | 'warning'; children: ReactNode }) {
  const styles = {
    info: 'border-denra-bronze bg-denra-paper text-denra-ink',
    success: 'border-[#4F7A55] bg-[#EEF4EE] text-[#2E4A32]',
    warning: 'border-[#B7832F] bg-[#FBF3E4] text-[#5E4419]',
    error: 'border-[#A33B32] bg-[#FBEDEB] text-[#6F2620]',
  }[tone];
  return (
    <div role={tone === 'error' ? 'alert' : 'status'} className={`flex gap-3 border-l-4 px-4 py-3 text-[15px] leading-relaxed ${styles}`}>
      {tone === 'error' || tone === 'warning' ? <TriangleAlert size={18} className="mt-0.5 shrink-0" aria-hidden="true" /> : tone === 'success' ? <Check size={18} className="mt-0.5 shrink-0" aria-hidden="true" /> : null}
      <div className="min-w-0">{children}</div>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, [string, string]> = {
    published: ['Zichtbaar', 'bg-[#E4EFE5] text-[#2E4A32]'],
    hidden: ['Verborgen', 'bg-denra-stone text-denra-muted'],
    archived: ['Gearchiveerd', 'bg-c-ede7e0 text-c-6b5d50'],
    pending: ['Te beoordelen', 'bg-[#FBF3E4] text-[#5E4419]'],
    approved: ['Gepubliceerd', 'bg-[#E4EFE5] text-[#2E4A32]'],
    deleted: ['Verwijderd', 'bg-[#FBEDEB] text-[#6F2620]'],
    nieuw: ['Nieuw', 'bg-[#FBF3E4] text-[#5E4419]'],
    in_behandeling: ['In behandeling', 'bg-c-e6eef6 text-c-27405a'],
    offerte_verstuurd: ['Offerte verstuurd', 'bg-c-eee8f5 text-c-43325e'],
    afgerond: ['Afgerond', 'bg-[#E4EFE5] text-[#2E4A32]'],
    gearchiveerd: ['Gearchiveerd', 'bg-denra-stone text-denra-muted'],
  };
  const [label, style] = map[status] ?? [status, 'bg-denra-stone text-denra-muted'];
  return <span className={`inline-flex items-center px-2.5 py-1 text-[13px] font-medium ${style}`}>{label}</span>;
}

// ── Form fields ─────────────────────────────────────────────────────────

const inputClass = 'block w-full min-w-0 rounded-[2px] border border-denra-ink/25 bg-white px-4 py-3 text-[17px] text-denra-ink placeholder:text-c-9a8e82 hover:border-denra-ink/45 focus:border-denra-ink focus:outline-none focus:ring-2 focus:ring-denra-bronze/25 aria-[invalid=true]:border-[#A33B32]';

interface FieldShellProps {
  label: string;
  help?: ReactNode;
  error?: string;
  required?: boolean;
  children: (props: { id: string; describedBy?: string; invalid: boolean }) => ReactNode;
}

export function FieldShell({ label, help, error, required, children }: FieldShellProps) {
  const id = useId();
  const helpId = help ? `${id}-help` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-[15px] font-medium text-denra-ink">
        {label}{required && <span className="text-[#A33B32]"> *</span>}
      </label>
      {children({ id, describedBy: [helpId, errorId].filter(Boolean).join(' ') || undefined, invalid: Boolean(error) })}
      {help && <p id={helpId} className="mt-1.5 text-[14px] leading-snug text-denra-muted">{help}</p>}
      {error && <p id={errorId} className="mt-1.5 text-[14px] text-[#A33B32]">{error}</p>}
    </div>
  );
}

interface TextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  help?: ReactNode;
  error?: string;
  required?: boolean;
  multiline?: boolean;
  rows?: number;
  placeholder?: string;
  type?: string;
  inputMode?: 'text' | 'decimal' | 'numeric' | 'tel' | 'email' | 'url';
  maxLength?: number;
  prefix?: string;
  suffix?: string;
}

export function TextField({ label, value, onChange, help, error, required, multiline, rows = 4, placeholder, type = 'text', inputMode, maxLength, prefix, suffix }: TextFieldProps) {
  return (
    <FieldShell label={label} help={help} error={error} required={required}>
      {({ id, describedBy, invalid }) => multiline ? (
        <textarea id={id} value={value} onChange={(event) => onChange(event.target.value)} rows={rows} placeholder={placeholder} maxLength={maxLength} aria-describedby={describedBy} aria-invalid={invalid} className={`${inputClass} resize-y leading-relaxed`} />
      ) : (
        <div className="relative">
          {prefix && <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-denra-muted" aria-hidden="true">{prefix}</span>}
          <input id={id} type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} inputMode={inputMode} maxLength={maxLength} aria-describedby={describedBy} aria-invalid={invalid} className={`${inputClass} ${prefix ? 'pl-9' : ''} ${suffix ? 'pr-14' : ''}`} />
          {suffix && <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-denra-muted" aria-hidden="true">{suffix}</span>}
        </div>
      )}
    </FieldShell>
  );
}

/** Dutch and English side by side; English may stay empty. */
export function BilingualField({ label, nl, en, onChangeNl, onChangeEn, multiline, help, error, required, placeholderNl, placeholderEn }: {
  label: string; nl: string; en: string; onChangeNl: (value: string) => void; onChangeEn: (value: string) => void;
  multiline?: boolean; help?: ReactNode; error?: string; required?: boolean; placeholderNl?: string; placeholderEn?: string;
}) {
  return (
    <fieldset>
      <legend className="mb-3 text-[15px] font-medium text-denra-ink">{label}{required && <span className="text-[#A33B32]"> *</span>}</legend>
      <div className="grid gap-4 lg:grid-cols-2">
        <TextField label="Nederlands" value={nl} onChange={onChangeNl} multiline={multiline} error={error} placeholder={placeholderNl} />
        <TextField label="Engels" value={en} onChange={onChangeEn} multiline={multiline} placeholder={placeholderEn} help="Leeg laten? Dan ziet een Engelse bezoeker de Nederlandse tekst." />
      </div>
      {help && <p className="mt-2 text-[14px] text-denra-muted">{help}</p>}
    </fieldset>
  );
}

export function Toggle({ label, checked, onChange, help }: { label: string; checked: boolean; onChange: (checked: boolean) => void; help?: string }) {
  const id = useId();
  return (
    <div className="flex items-start gap-4">
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative mt-0.5 h-8 w-14 shrink-0 rounded-full transition-colors ${checked ? 'bg-denra-ink' : 'bg-denra-sand'}`}
      >
        <span className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-7' : 'translate-x-1'}`} />
      </button>
      <label htmlFor={id} className="cursor-pointer">
        <span className="block text-[16px] font-medium text-denra-ink">{label}</span>
        {help && <span className="block text-[14px] text-denra-muted">{help}</span>}
      </label>
    </div>
  );
}

export function ChoiceGroup<T extends string>({ label, value, options, onChange, help }: { label: string; value: T; options: { value: T; label: string; description?: string }[]; onChange: (value: T) => void; help?: string }) {
  const name = useId();
  return (
    <fieldset>
      <legend className="mb-3 text-[15px] font-medium text-denra-ink">{label}</legend>
      <div className="grid gap-2 sm:grid-cols-3">
        {options.map((option) => (
          <label key={option.value} className={`flex min-h-14 cursor-pointer items-start gap-3 border px-4 py-3 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-denra-bronze ${value === option.value ? 'border-denra-ink bg-white ring-1 ring-denra-ink' : 'border-denra-ink/20 bg-white/60 hover:border-denra-ink/50'}`}>
            <input type="radio" name={name} value={option.value} checked={value === option.value} onChange={() => onChange(option.value)} className="mt-1 h-4 w-4 accent-c-231a12" />
            <span>
              <span className="block text-[16px] font-medium">{option.label}</span>
              {option.description && <span className="block text-[13px] text-denra-muted">{option.description}</span>}
            </span>
          </label>
        ))}
      </div>
      {help && <p className="mt-2 text-[14px] text-denra-muted">{help}</p>}
    </fieldset>
  );
}

/** Editable list of short texts: one row per item, with move and remove buttons. */
export function ListEditor({ label, items, onChange, help, addLabel = 'Regel toevoegen', multiline = false }: { label: string; items: string[]; onChange: (items: string[]) => void; help?: string; addLabel?: string; multiline?: boolean }) {
  const move = (index: number, direction: number) => {
    const next = [...items];
    const [item] = next.splice(index, 1);
    next.splice(index + direction, 0, item);
    onChange(next);
  };
  return (
    <fieldset>
      <legend className="mb-3 text-[15px] font-medium text-denra-ink">{label}</legend>
      <ol className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-2">
            <span className="mt-3 w-6 shrink-0 text-right text-sm text-denra-muted">{index + 1}.</span>
            {multiline ? (
              <textarea value={item} rows={2} onChange={(event) => onChange(items.map((current, position) => (position === index ? event.target.value : current)))} aria-label={`${label}, regel ${index + 1}`} className={`${inputClass} resize-y`} />
            ) : (
              <input value={item} onChange={(event) => onChange(items.map((current, position) => (position === index ? event.target.value : current)))} aria-label={`${label}, regel ${index + 1}`} className={inputClass} />
            )}
            <div className="flex shrink-0">
              <IconButton label="Omhoog" onClick={() => move(index, -1)} disabled={index === 0}><ArrowUp size={18} /></IconButton>
              <IconButton label="Omlaag" onClick={() => move(index, 1)} disabled={index === items.length - 1}><ArrowDown size={18} /></IconButton>
              <IconButton label="Verwijderen" onClick={() => onChange(items.filter((_, position) => position !== index))}><Trash2 size={18} /></IconButton>
            </div>
          </li>
        ))}
      </ol>
      <button type="button" onClick={() => onChange([...items, ''])} className="mt-3 inline-flex min-h-11 items-center gap-2 border border-dashed border-denra-ink/30 px-4 text-[15px] hover:border-denra-ink">
        <Plus size={16} aria-hidden="true" />{addLabel}
      </button>
      {help && <p className="mt-2 text-[14px] text-denra-muted">{help}</p>}
    </fieldset>
  );
}

export function IconButton({ label, onClick, disabled, children, tone = 'default' }: { label: string; onClick: () => void; disabled?: boolean; children: ReactNode; tone?: 'default' | 'danger' }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} aria-label={label} title={label} className={`flex h-12 w-12 items-center justify-center border border-transparent transition-colors hover:border-denra-ink/20 hover:bg-white disabled:opacity-30 disabled:hover:border-transparent disabled:hover:bg-transparent ${tone === 'danger' ? 'text-[#A33B32]' : 'text-denra-ink'}`}>
      {children}
    </button>
  );
}

// ── Saving ──────────────────────────────────────────────────────────────

export type SaveState = { status: 'idle' } | { status: 'saving' } | { status: 'saved'; at: Date } | { status: 'error'; message: string };

// eslint-disable-next-line react-refresh/only-export-components
export function useSaveState() {
  const [state, setState] = useState<SaveState>({ status: 'idle' });
  const run = useCallback(async (save: () => Promise<void>) => {
    setState({ status: 'saving' });
    try {
      await save();
      setState({ status: 'saved', at: new Date() });
      return true;
    } catch (error) {
      setState({ status: 'error', message: friendlyError(error) });
      return false;
    }
  }, []);
  return { state, setState, run };
}

/** Turns database and network errors into plain Dutch. */
// eslint-disable-next-line react-refresh/only-export-components
export function friendlyError(error: unknown): string {
  const raw = error as { message?: string; code?: string } | null;
  const message = raw?.message ?? String(error);
  if (raw?.code === '23505' || /duplicate key/i.test(message)) return 'Deze naam of URL bestaat al. Kies een andere.';
  if (/JWT|expired/i.test(message)) return 'U bent niet meer ingelogd. Log opnieuw in; uw wijzigingen staan nog op deze pagina.';
  if (raw?.code === '42501' || /row-level security|permission denied|not authorized/i.test(message)) return 'Deze wijziging werd geweigerd. Bent u nog ingelogd als beheerder? Log zo nodig opnieuw in; uw wijzigingen staan nog op deze pagina.';
  if (raw?.code === '23514' || /check constraint/i.test(message)) return 'Eén van de velden is te lang of ongeldig. Controleer de invoer.';
  if (/Failed to fetch|NetworkError|network/i.test(message)) return 'Geen verbinding met de server. Controleer uw internet en probeer het opnieuw; uw wijzigingen staan nog op deze pagina.';
  return /^[A-Z].*[.!]$/.test(message) && message.length < 200 ? message : 'Opslaan is niet gelukt. Probeer het opnieuw; uw wijzigingen staan nog op deze pagina.';
}

export function SaveBar({ state, dirty, onSave, onReset, saveLabel = 'Opslaan', disabled, extra }: { state: SaveState; dirty: boolean; onSave: () => void; onReset?: () => void; saveLabel?: string; disabled?: boolean; extra?: ReactNode }) {
  const message = state.status === 'saving' ? 'Bezig met opslaan…'
    : state.status === 'error' ? state.message
      : dirty ? 'U heeft wijzigingen die nog niet zijn opgeslagen.'
        : state.status === 'saved' ? `Opgeslagen om ${state.at.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}. De website is bijgewerkt.`
          : 'Alles is opgeslagen.';
  return (
    <div className="sticky bottom-0 z-20 -mx-4 mt-10 border-t border-denra-line bg-denra-ivory/95 px-4 py-3 backdrop-blur sm:-mx-8 sm:px-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p role="status" aria-live="polite" className={`text-[15px] ${state.status === 'error' ? 'text-[#A33B32]' : dirty ? 'text-[#5E4419]' : 'text-denra-muted'}`}>{message}</p>
        <div className="flex gap-3">
          {extra}
          {onReset && dirty && <button type="button" onClick={onReset} className="btn-secondary min-h-12">Wijzigingen ongedaan maken</button>}
          <button type="button" onClick={onSave} disabled={disabled || state.status === 'saving' || !dirty} className="btn-primary min-h-12 min-w-[9rem]">
            {state.status === 'saving' && <Loader2 size={16} className="animate-spin" aria-hidden="true" />}
            {saveLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export function LoadingBlock({ label = 'Gegevens laden…' }: { label?: string }) {
  return (
    <div className="flex min-h-[30vh] items-center justify-center gap-3 text-denra-muted" role="status">
      <Loader2 size={20} className="animate-spin" aria-hidden="true" />{label}
    </div>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function formatDate(value: string) {
  return new Intl.DateTimeFormat('nl-NL', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(value));
}

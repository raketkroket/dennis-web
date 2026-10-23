import { useEffect, useMemo, useState } from 'react';
import { defaultBusiness, type BusinessSettings } from '../../content/defaults';
import { businessFromRow, businessToRow, type BusinessRow } from '../../content/load';
import { useSiteContent } from '../../content/SiteContentProvider';
import { useAdminClient } from '../auth';
import { BilingualField, friendlyError, ListEditor, LoadingBlock, Notice, PageHeader, Panel, SaveBar, TextField, useSaveState, useUnsavedChanges } from '../ui';

function problemsFor(business: BusinessSettings): Partial<Record<keyof BusinessSettings, string>> {
  const problems: Partial<Record<keyof BusinessSettings, string>> = {};
  if (business.companyName.trim().length < 2) problems.companyName = 'Vul de bedrijfsnaam in.';
  if (!/^\+?[0-9]{8,15}$/.test(business.phoneLink.replace(/[\s-]/g, ''))) problems.phoneLink = 'Vul het nummer in cijfers in, bijvoorbeeld +31612345678.';
  if (business.phoneDisplay.trim().length < 6) problems.phoneDisplay = 'Vul het telefoonnummer in zoals bezoekers het zien.';
  if (!/^[0-9]{8,15}$/.test(business.whatsappNumber.replace(/[\s+-]/g, ''))) problems.whatsappNumber = 'Vul het nummer in zonder + en zonder 0 vooraan, bijvoorbeeld 31612345678.';
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(business.email.trim())) problems.email = 'Vul een geldig e-mailadres in.';
  for (const key of ['instagramUrl', 'facebookUrl', 'tiktokUrl'] as const) {
    if (business[key] && !/^https:\/\/\S+$/.test(business[key])) problems[key] = 'Een link begint met https://. Laat leeg als u dit kanaal niet gebruikt.';
  }
  return problems;
}

export default function Business() {
  const client = useAdminClient();
  const { reload } = useSiteContent();
  const [saved, setSaved] = useState<BusinessSettings | null>(null);
  const [draft, setDraft] = useState<BusinessSettings | null>(null);
  const [error, setError] = useState('');
  const [showErrors, setShowErrors] = useState(false);
  const { state, setState, run } = useSaveState();

  useEffect(() => {
    client.from('business_settings').select('*').eq('id', 1).maybeSingle().then(({ data, error: loadError }) => {
      if (loadError) return setError(friendlyError(loadError));
      const value = data ? businessFromRow(data as BusinessRow) : defaultBusiness;
      setSaved(value);
      setDraft(value);
    });
  }, [client]);

  const dirty = Boolean(draft && saved && JSON.stringify(draft) !== JSON.stringify(saved));
  useUnsavedChanges(dirty);
  const problems = useMemo(() => (draft ? problemsFor(draft) : {}), [draft]);

  if (error) return <div className="space-y-6"><PageHeader title="Bedrijfsgegevens" /><Notice tone="error">{error}</Notice></div>;
  if (!draft) return <LoadingBlock />;
  const set = (patch: Partial<BusinessSettings>) => setDraft((current) => current && ({ ...current, ...patch }));
  const shown = showErrors ? problems : {};

  const save = async () => {
    setShowErrors(true);
    if (Object.keys(problems).length) return setState({ status: 'error', message: 'Controleer de velden met een rode melding.' });
    await run(async () => {
      const clean: BusinessSettings = {
        ...draft,
        phoneLink: draft.phoneLink.replace(/[\s-]/g, ''),
        whatsappNumber: draft.whatsappNumber.replace(/[\s+-]/g, ''),
        email: draft.email.trim(),
        serviceAreas: draft.serviceAreas.map((area) => area.trim()).filter(Boolean),
      };
      const { error: saveError } = await client.from('business_settings').upsert({ id: 1, ...businessToRow(clean) });
      if (saveError) throw saveError;
      setDraft(clean);
      setSaved(clean);
      await reload();
    });
  };

  return (
    <div className="space-y-8">
      <PageHeader title="Bedrijfsgegevens" description="Deze gegevens staan in de kop, de voettekst, op de contactpagina en in de knoppen om te bellen of te WhatsAppen." />
      <Panel title="Bereikbaarheid">
        <div className="grid gap-6 sm:grid-cols-2">
          <TextField label="Telefoonnummer zoals bezoekers het zien" value={draft.phoneDisplay} onChange={(phoneDisplay) => set({ phoneDisplay })} error={shown.phoneDisplay} placeholder="+31 6 12 34 56 78" />
          <TextField label="Telefoonnummer om te bellen" value={draft.phoneLink} onChange={(phoneLink) => set({ phoneLink })} error={shown.phoneLink} help="Alleen cijfers, met landcode." inputMode="tel" />
          <TextField label="WhatsApp-nummer" value={draft.whatsappNumber} onChange={(whatsappNumber) => set({ whatsappNumber })} error={shown.whatsappNumber} help="Met 31 vooraan, zonder + en zonder 0." inputMode="tel" />
          <TextField label="E-mailadres" type="email" inputMode="email" value={draft.email} onChange={(email) => set({ email })} error={shown.email} help="Dit adres staat op de website. Aanvragen worden verstuurd naar het adres dat in de technische instellingen staat." />
        </div>
        <div className="mt-6 space-y-6">
          <BilingualField label="Adres of vestigingsplaats" nl={draft.addressNl} en={draft.addressEn} onChangeNl={(addressNl) => set({ addressNl })} onChangeEn={(addressEn) => set({ addressEn })} />
          <BilingualField label="Openingstijden" nl={draft.hoursNl} en={draft.hoursEn} onChangeNl={(hoursNl) => set({ hoursNl })} onChangeEn={(hoursEn) => set({ hoursEn })} placeholderNl="Ma-Za: 08:00-18:00" />
        </div>
      </Panel>
      <Panel title="Bedrijf">
        <div className="grid gap-6 sm:grid-cols-2">
          <TextField label="Naam op de website" value={draft.companyName} onChange={(companyName) => set({ companyName })} error={shown.companyName} />
          <TextField label="Uitgevoerd door (officiële naam)" value={draft.legalName} onChange={(legalName) => set({ legalName })} help="Staat in de voettekst. Leeg laten om niet te tonen." />
        </div>
        <div className="mt-6">
          <ListEditor label="Werkgebied (plaatsen)" items={draft.serviceAreas} onChange={(serviceAreas) => set({ serviceAreas })} addLabel="Plaats toevoegen" />
        </div>
      </Panel>
      <Panel title="Sociale media" description="Laat een veld leeg als u dat kanaal niet gebruikt; de link verdwijnt dan van de website.">
        <div className="grid gap-6">
          <TextField label="Instagram" type="url" inputMode="url" value={draft.instagramUrl} onChange={(instagramUrl) => set({ instagramUrl })} error={shown.instagramUrl} placeholder="https://www.instagram.com/…" />
          <TextField label="Facebook" type="url" inputMode="url" value={draft.facebookUrl} onChange={(facebookUrl) => set({ facebookUrl })} error={shown.facebookUrl} placeholder="https://www.facebook.com/…" />
          <TextField label="TikTok" type="url" inputMode="url" value={draft.tiktokUrl} onChange={(tiktokUrl) => set({ tiktokUrl })} error={shown.tiktokUrl} placeholder="https://www.tiktok.com/@…" />
        </div>
      </Panel>
      <SaveBar state={state} dirty={dirty} onSave={save} onReset={() => setDraft(saved)} />
    </div>
  );
}

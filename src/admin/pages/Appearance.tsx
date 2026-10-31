import { useCallback, useEffect, useState, type CSSProperties } from 'react';
import { Check, ExternalLink, ImagePlus, RotateCcw } from 'lucide-react';
import { useAdminClient } from '../auth';
import PhotoPicker from '../PhotoPicker';
import { friendlyError, LoadingBlock, Notice, PageHeader, Panel } from '../ui';
import { mediaImage, type MediaRow } from '../../content/load';
import { pagePhotoKey, pagePhotoSlots, type PagePhotoSlot } from '../../content/pagePhotoSlots';
import { sitePhotos } from '../../data/sitePhotos';
import { defaultThemeId, isThemeId, themeContentKey, themeSchemes, themeVariables, type ThemeId } from '../../lib/theme';
import heroImage from '../../../headerimg.png?w=768&format=webp';

// The photo each place shows when Dennis has not chosen one.
const builtInPhoto: Record<string, string> = {
  homeHero: heroImage, homeServices: sitePhotos[0], bathroomHero: sitePhotos[0], bathroomFeatures: sitePhotos[8],
  toiletHero: sitePhotos[8], interiorHero: sitePhotos[6], calculatorHero: sitePhotos[0], aboutMain: sitePhotos[0],
  aboutDetail: sitePhotos[3], localBathroom: sitePhotos[0], localToilet: sitePhotos[8],
};

const shapeClass: Record<PagePhotoSlot['shape'], string> = { liggend: 'aspect-[4/3]', staand: 'aspect-[3/4]', vierkant: 'aspect-square' };

type Message = { tone: 'success' | 'error'; text: string } | null;

export default function Appearance() {
  const client = useAdminClient();
  const [scheme, setScheme] = useState<ThemeId | null>(null);
  const [chosen, setChosen] = useState<Record<string, MediaRow>>({});
  const [loaded, setLoaded] = useState(false);
  const [message, setMessage] = useState<Message>(null);
  const [busy, setBusy] = useState('');
  const [pickerFor, setPickerFor] = useState<PagePhotoSlot | null>(null);

  const load = useCallback(async () => {
    const { data, error } = await client.from('site_content').select('key, value_nl').or(`key.eq.${themeContentKey},key.like.photo.*`);
    if (error) return setMessage({ tone: 'error', text: friendlyError(error) });
    const rows = data as { key: string; value_nl: string }[];
    const stored = rows.find((row) => row.key === themeContentKey)?.value_nl;
    setScheme(isThemeId(stored) ? stored : defaultThemeId);
    const photoIds = rows.filter((row) => row.key.startsWith('photo.')).map((row) => [row.key.slice('photo.'.length), row.value_nl] as const);
    if (photoIds.length) {
      const { data: media, error: mediaError } = await client.from('media').select('id, storage_path, static_key, width, height, alt_nl, alt_en').in('id', photoIds.map(([, id]) => id));
      if (mediaError) return setMessage({ tone: 'error', text: friendlyError(mediaError) });
      const byId = new Map((media as MediaRow[]).map((row) => [row.id, row]));
      setChosen(Object.fromEntries(photoIds.flatMap(([slot, id]) => (byId.has(id) ? [[slot, byId.get(id)!]] : []))));
    } else setChosen({});
    setLoaded(true);
  }, [client]);
  useEffect(() => { void load(); }, [load]);

  const chooseScheme = async (id: ThemeId) => {
    setBusy(`scheme-${id}`);
    const { error } = id === defaultThemeId
      ? await client.from('site_content').delete().eq('key', themeContentKey)
      : await client.from('site_content').upsert({ key: themeContentKey, value_nl: id, value_en: '' });
    setBusy('');
    if (error) return setMessage({ tone: 'error', text: friendlyError(error) });
    setScheme(id);
    setMessage({ tone: 'success', text: `De kleuren “${themeSchemes.find((option) => option.id === id)?.name}” staan nu op de website.` });
  };

  const choosePhoto = async (slot: PagePhotoSlot, media: MediaRow | null) => {
    setBusy(`photo-${slot.id}`);
    const { error } = media
      ? await client.from('site_content').upsert({ key: pagePhotoKey(slot.id), value_nl: media.id, value_en: '' })
      : await client.from('site_content').delete().eq('key', pagePhotoKey(slot.id));
    setBusy('');
    if (error) return setMessage({ tone: 'error', text: friendlyError(error) });
    setChosen((current) => {
      const next = { ...current };
      if (media) next[slot.id] = media;
      else delete next[slot.id];
      return next;
    });
    setMessage({ tone: 'success', text: media ? `Nieuwe foto voor “${slot.page} – ${slot.label}” staat op de website.` : `“${slot.page} – ${slot.label}” toont weer de standaardfoto.` });
  };

  if (!loaded) return <div className="space-y-8"><PageHeader title="Uitstraling" />{message ? <Notice tone={message.tone}>{message.text}</Notice> : <LoadingBlock />}</div>;

  const pages = [...new Set(pagePhotoSlots.map((slot) => slot.page))];

  return (
    <div className="space-y-10">
      <PageHeader title="Uitstraling" description="Kies de kleuren van de website en de foto’s op vaste plekken. Elke keuze staat direct op de website; u kunt altijd terug naar de standaard." />
      {message && <Notice tone={message.tone}>{message.text}</Notice>}

      <Panel title="Kleuren" description="Zes kleurensets die bij een luxe uitstraling passen. Alle teksten blijven goed leesbaar. Met “Eerst bekijken” ziet u de website in die kleuren zonder iets op te slaan.">
        <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {themeSchemes.map((option) => {
            const active = option.id === scheme;
            return (
              <li key={option.id} className={`flex flex-col border bg-white ${active ? 'border-denra-ink ring-1 ring-denra-ink' : 'border-denra-line'}`}>
                <SchemePreview id={option.id} />
                <div className="flex flex-1 flex-col p-4">
                  <p className="flex items-center gap-2 font-serif text-xl">
                    {option.name}
                    {active && <span className="inline-flex items-center gap-1 bg-denra-ink px-2 py-0.5 font-sans text-[12px] text-denra-ivory"><Check size={13} aria-hidden="true" />In gebruik</span>}
                  </p>
                  <p className="mt-1 flex-1 text-[15px] text-denra-muted">{option.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {!active && <button type="button" disabled={Boolean(busy)} onClick={() => chooseScheme(option.id)} className="btn-primary min-h-11 px-4 text-[15px]">Deze kleuren gebruiken</button>}
                    <a href={`/?kleur=${option.id}`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 border border-denra-ink/20 px-4 text-[15px] hover:bg-denra-stone">
                      <ExternalLink size={16} aria-hidden="true" />Eerst bekijken
                    </a>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </Panel>

      <Panel title="Foto’s op de pagina’s" description="De grote foto’s bovenaan de pagina’s en een paar andere vaste plekken. Kies een foto uit uw fotobibliotheek of upload een nieuwe. Liggende foto’s passen het best bij “liggend”, staande bij “staand”.">
        <div className="space-y-8">
          {pages.map((page) => (
            <section key={page} aria-label={page}>
              <h3 className="mb-3 text-[13px] font-semibold uppercase tracking-[0.16em] text-denra-muted">{page}</h3>
              <ul className="grid gap-4 sm:grid-cols-2">
                {pagePhotoSlots.filter((slot) => slot.page === page).map((slot) => {
                  const media = chosen[slot.id];
                  const image = media ? mediaImage(media) : null;
                  return (
                    <li key={slot.id} className="flex gap-4 border border-denra-line bg-white p-3">
                      <div className={`w-28 shrink-0 overflow-hidden bg-denra-stone ${shapeClass[slot.shape]}`}>
                        <img src={image?.src ?? builtInPhoto[slot.id]} alt="" loading="lazy" className="h-full w-full object-cover" />
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <p className="font-medium">{slot.label}</p>
                        <p className="text-[14px] text-denra-muted">{media ? 'Eigen foto' : 'Standaardfoto'} · {slot.shape}</p>
                        <div className="mt-auto flex flex-wrap gap-2 pt-3">
                          <button type="button" disabled={Boolean(busy)} onClick={() => setPickerFor(slot)} className="inline-flex min-h-11 items-center gap-2 bg-denra-ink px-3 text-[14px] text-denra-ivory hover:bg-denra-charcoal">
                            <ImagePlus size={16} aria-hidden="true" />Andere foto
                          </button>
                          {media && (
                            <button type="button" disabled={Boolean(busy)} onClick={() => choosePhoto(slot, null)} className="inline-flex min-h-11 items-center gap-2 border border-denra-ink/20 px-3 text-[14px] hover:bg-denra-stone">
                              <RotateCcw size={16} aria-hidden="true" />Standaard
                            </button>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      </Panel>

      <PhotoPicker
        open={Boolean(pickerFor)}
        exclude={[]}
        single
        title={pickerFor ? `Foto kiezen: ${pickerFor.page} – ${pickerFor.label}` : ''}
        actionLabel="Deze foto gebruiken"
        onClose={() => setPickerFor(null)}
        onPick={(photos) => { if (pickerFor && photos[0]) void choosePhoto(pickerFor, photos[0]); }}
      />
    </div>
  );
}

/** A small mock-up of the site in a colour scheme. */
function SchemePreview({ id }: { id: ThemeId }) {
  const style = themeVariables(id) as CSSProperties;
  return (
    <div style={style} aria-hidden="true">
      <div className="bg-c-f6f0e8 px-5 pb-5 pt-4">
        <div className="mb-4 flex items-center justify-between">
          <span className="font-serif text-[13px] tracking-[0.3em] text-c-231a12">DENRA</span>
          <span className="h-5 w-12 bg-c-231a12" />
        </div>
        <div className="mb-2 h-px w-10 bg-c-7a6552" />
        <p className="font-serif text-2xl leading-tight text-c-231a12">Badkamer renoveren</p>
        <p className="mt-1 text-[12px] text-c-6b5d50">Van sloop tot afwerking, met één aanspreekpunt.</p>
        <span className="mt-3 inline-block bg-c-231a12 px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-c-f6f0e8">Prijs berekenen</span>
      </div>
      <div className="grid grid-cols-5">
        {['bg-c-231a12', 'bg-c-7a6552', 'bg-c-cfbca7', 'bg-c-efe4d5', 'bg-c-faf6f0'].map((colour) => <span key={colour} className={`h-6 ${colour}`} />)}
      </div>
    </div>
  );
}

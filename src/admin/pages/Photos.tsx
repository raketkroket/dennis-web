import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { mediaImage } from '../../content/load';
import { photoBucket } from '../../lib/supabase';
import { useAdminClient } from '../auth';
import { listLibrary, type LibraryPhoto } from '../data';
import PhotoUploader from '../PhotoUploader';
import { friendlyError, LoadingBlock, Notice, PageHeader, Panel, TextField } from '../ui';

export default function Photos() {
  const client = useAdminClient();
  const [photos, setPhotos] = useState<LibraryPhoto[] | null>(null);
  const [filter, setFilter] = useState<'all' | 'unused' | 'uploads'>('all');
  const [editing, setEditing] = useState<LibraryPhoto | null>(null);
  const [alt, setAlt] = useState({ nl: '', en: '' });
  const [message, setMessage] = useState<{ tone: 'success' | 'error'; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => listLibrary(client).then(setPhotos).catch((error) => setMessage({ tone: 'error', text: friendlyError(error) })), [client]);
  useEffect(() => { void load(); }, [load]);

  const visible = (photos ?? []).filter((photo) => filter === 'all' || (filter === 'unused' ? photo.usedIn.length === 0 : Boolean(photo.storage_path)));

  const open = (photo: LibraryPhoto) => {
    setEditing(photo);
    setAlt({ nl: photo.alt_nl, en: photo.alt_en });
    setMessage(null);
  };

  const saveAlt = async () => {
    if (!editing) return;
    setBusy(true);
    const { error } = await client.from('media').update({ alt_nl: alt.nl.trim(), alt_en: alt.en.trim() }).eq('id', editing.id);
    setBusy(false);
    if (error) return setMessage({ tone: 'error', text: friendlyError(error) });
    setPhotos((current) => current?.map((photo) => (photo.id === editing.id ? { ...photo, alt_nl: alt.nl.trim(), alt_en: alt.en.trim() } : photo)) ?? null);
    setMessage({ tone: 'success', text: 'De omschrijving is opgeslagen.' });
    setEditing(null);
  };

  const remove = async (photo: LibraryPhoto) => {
    if (photo.usedIn.length) return setMessage({ tone: 'error', text: `Deze foto wordt nog gebruikt in “${photo.usedIn[0].title_nl}”. Haal hem eerst uit dat project.` });
    if (!photo.storage_path) return setMessage({ tone: 'error', text: 'Deze foto hoort bij de website zelf en kan niet worden verwijderd. Gebruik hem gewoon niet in een project.' });
    if (!window.confirm('Deze foto definitief verwijderen? Dit kan niet ongedaan worden gemaakt.')) return;
    setBusy(true);
    const { error } = await client.from('media').delete().eq('id', photo.id);
    if (!error) {
      const { error: storageError } = await client.storage.from(photoBucket).remove([photo.storage_path]);
      if (storageError) console.error('Photo row removed but file stayed in storage', storageError);
    }
    setBusy(false);
    if (error) return setMessage({ tone: 'error', text: friendlyError(error) });
    setPhotos((current) => current?.filter((candidate) => candidate.id !== photo.id) ?? null);
    setEditing(null);
    setMessage({ tone: 'success', text: 'De foto is verwijderd.' });
  };

  return (
    <div className="space-y-8">
      <PageHeader title="Foto’s" description="Alle foto’s die u in projecten kunt gebruiken. Upload hier gerust direct vanaf uw telefoon." />
      <Panel title="Nieuwe foto’s uploaden">
        <PhotoUploader onUploaded={(media) => {
          setPhotos((current) => [...media.map((row) => ({ ...row, image: mediaImage(row), usedIn: [] })), ...(current ?? [])]);
          setMessage({ tone: 'success', text: media.length === 1 ? 'De foto staat in de bibliotheek. Voeg hem toe aan een project via Projecten.' : `${media.length} foto’s staan in de bibliotheek. Voeg ze toe aan een project via Projecten.` });
        }} />
      </Panel>

      {message && <Notice tone={message.tone}>{message.text}</Notice>}

      <div className="flex flex-wrap gap-2" role="group" aria-label="Welke foto’s tonen">
        {([['all', 'Alle'], ['unused', 'Nog niet gebruikt'], ['uploads', 'Door u geüpload']] as const).map(([value, label]) => (
          <button key={value} type="button" aria-pressed={filter === value} onClick={() => setFilter(value)} className={`min-h-11 px-4 text-[15px] ${filter === value ? 'bg-denra-ink text-denra-ivory' : 'border border-denra-ink/20'}`}>{label}</button>
        ))}
      </div>

      {!photos ? <LoadingBlock /> : visible.length === 0 ? <p className="text-denra-muted">Geen foto’s in deze selectie.</p> : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {visible.map((photo) => (
            <li key={photo.id}>
              <button type="button" onClick={() => open(photo)} className={`group block w-full text-left ${editing?.id === photo.id ? 'ring-4 ring-denra-ink' : ''}`}>
                <span className="block aspect-[4/5] overflow-hidden bg-denra-stone">
                  {photo.image && <img src={photo.image.src} srcSet={photo.image.srcSet} sizes="240px" alt={photo.alt_nl || 'Projectfoto'} loading="lazy" className="h-full w-full object-cover" />}
                </span>
                <span className="mt-1.5 block truncate text-[13px] text-denra-muted">{photo.usedIn.length ? `In: ${photo.usedIn.map((project) => project.title_nl).join(', ')}` : 'Nog niet gebruikt'}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {editing && (
        <Panel title="Foto bewerken" className="sticky bottom-4 z-10 shadow-xl">
          <div className="grid gap-5 sm:grid-cols-[7rem_1fr]">
            <div className="h-36 w-28 overflow-hidden bg-denra-stone">{editing.image && <img src={editing.image.src} alt="" className="h-full w-full object-cover" />}</div>
            <div className="space-y-4">
              <TextField label="Omschrijving voor slechtzienden en Google (Nederlands)" value={alt.nl} onChange={(nl) => setAlt((current) => ({ ...current, nl }))} help="Beschrijf kort wat er op de foto staat, bijvoorbeeld: Inloopdouche met donkere tegels." maxLength={300} />
              <TextField label="Omschrijving (Engels, optioneel)" value={alt.en} onChange={(en) => setAlt((current) => ({ ...current, en }))} maxLength={300} />
              <p className="text-[14px] text-denra-muted">{editing.width} × {editing.height} pixels{editing.size_bytes ? ` · ${Math.round(editing.size_bytes / 1024)} kB` : ''}{editing.usedIn.length ? <> · gebruikt in {editing.usedIn.map((project, index) => <span key={project.id}>{index ? ', ' : ' '}<Link to={`/admin/projecten/${project.id}`} className="underline">{project.title_nl}</Link></span>)}</> : ''}</p>
              <div className="flex flex-wrap gap-3">
                <button type="button" onClick={saveAlt} disabled={busy} className="btn-primary min-h-12">Opslaan</button>
                <button type="button" onClick={() => setEditing(null)} className="btn-secondary min-h-12">Sluiten</button>
                {editing.storage_path && <button type="button" onClick={() => remove(editing)} disabled={busy} className="inline-flex min-h-12 items-center gap-2 px-4 text-[#A33B32] underline underline-offset-4"><Trash2 size={16} aria-hidden="true" />Verwijderen</button>}
              </div>
            </div>
          </div>
        </Panel>
      )}
    </div>
  );
}

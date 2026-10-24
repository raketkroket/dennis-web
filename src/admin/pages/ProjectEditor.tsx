import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowDown, ArrowLeft, ArrowUp, ExternalLink, ImagePlus, Trash2 } from 'lucide-react';
import type { PhotoKind, ProjectCategory, ProjectStatus } from '../../content/defaults';
import { mediaImage, projectSelect, type ProjectRow } from '../../content/load';
import type { Project, ResponsiveImage } from '../../content/types';
import { getReviews } from '../../data/reviews';
import ProjectCard from '../../components/projects/ProjectCard';
import { useAdminClient } from '../auth';
import { slugify, type LibraryPhoto } from '../data';
import PhotoPicker from '../PhotoPicker';
import { BilingualField, ChoiceGroup, FieldShell, friendlyError, GuardedLink, IconButton, LoadingBlock, Notice, PageHeader, Panel, SaveBar, TextField, Toggle, useSaveState, useUnsavedChanges } from '../ui';

interface PhotoDraft {
  mediaId: string;
  image: ResponsiveImage | null;
  kind: PhotoKind;
  captionNl: string;
  captionEn: string;
}

interface ProjectDraft {
  id: string | null;
  slug: string;
  slugTouched: boolean;
  category: ProjectCategory;
  titleNl: string;
  titleEn: string;
  summaryNl: string;
  summaryEn: string;
  location: string;
  reviewRef: string;
  status: ProjectStatus;
  isFeatured: boolean;
  coverMediaId: string | null;
  photos: PhotoDraft[];
}

const emptyDraft: ProjectDraft = {
  id: null, slug: '', slugTouched: false, category: 'badkamer', titleNl: '', titleEn: '', summaryNl: '', summaryEn: '',
  location: '', reviewRef: '', status: 'hidden', isFeatured: false, coverMediaId: null, photos: [],
};

const kindOptions: { value: PhotoKind; label: string }[] = [
  { value: 'result', label: 'Resultaat' },
  { value: 'during', label: 'Tijdens de verbouwing' },
  { value: 'before', label: 'Voor (oude situatie)' },
  { value: 'after', label: 'Na' },
];

function fromRow(row: ProjectRow): ProjectDraft {
  return {
    id: row.id, slug: row.slug, slugTouched: true, category: row.category, titleNl: row.title_nl, titleEn: row.title_en,
    summaryNl: row.summary_nl, summaryEn: row.summary_en, location: row.location ?? '', reviewRef: row.review_ref ?? '',
    status: row.status, isFeatured: row.is_featured, coverMediaId: row.cover_media_id,
    photos: [...row.project_photos].sort((a, b) => a.sort_order - b.sort_order).flatMap((photo) => (photo.media ? [{
      mediaId: photo.media.id, image: mediaImage(photo.media), kind: photo.kind, captionNl: photo.caption_nl, captionEn: photo.caption_en,
    }] : [])),
  };
}

export default function ProjectEditor() {
  const { id } = useParams();
  const isNew = id === 'nieuw';
  const client = useAdminClient();
  const navigate = useNavigate();
  const [draft, setDraft] = useState<ProjectDraft | null>(isNew ? emptyDraft : null);
  const [saved, setSaved] = useState<string>(JSON.stringify(emptyDraft));
  const [loadError, setLoadError] = useState('');
  const [pickerOpen, setPickerOpen] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const { state, setState, run } = useSaveState();

  useEffect(() => {
    if (isNew) {
      setDraft(emptyDraft);
      setSaved(JSON.stringify(emptyDraft));
      return;
    }
    client.from('projects').select(projectSelect).eq('id', id).maybeSingle().then(({ data, error }) => {
      if (error) return setLoadError(friendlyError(error));
      if (!data) return setLoadError('Dit project bestaat niet (meer).');
      const next = fromRow(data as unknown as ProjectRow);
      setDraft(next);
      setSaved(JSON.stringify(next));
    });
  }, [client, id, isNew]);

  const dirty = draft !== null && JSON.stringify(draft) !== saved;
  useUnsavedChanges(dirty);

  const update = (patch: Partial<ProjectDraft>) => setDraft((current) => {
    if (!current) return current;
    const next = { ...current, ...patch };
    if (!next.slugTouched && ('titleNl' in patch || 'location' in patch)) {
      const includesPlace = next.location && next.titleNl.toLowerCase().includes(next.location.trim().toLowerCase());
      next.slug = slugify([next.titleNl, includesPlace ? '' : next.location].filter(Boolean).join(' '));
    }
    return next;
  });
  const updatePhoto = (index: number, patch: Partial<PhotoDraft>) => setDraft((current) => current && ({ ...current, photos: current.photos.map((photo, position) => (position === index ? { ...photo, ...patch } : photo)) }));
  const movePhoto = (index: number, direction: number) => setDraft((current) => {
    if (!current) return current;
    const photos = [...current.photos];
    const [photo] = photos.splice(index, 1);
    photos.splice(index + direction, 0, photo);
    return { ...current, photos };
  });
  const removePhoto = (index: number) => setDraft((current) => {
    if (!current) return current;
    const removed = current.photos[index];
    return { ...current, photos: current.photos.filter((_, position) => position !== index), coverMediaId: current.coverMediaId === removed.mediaId ? null : current.coverMediaId };
  });
  const addPhotos = useCallback((photos: LibraryPhoto[]) => setDraft((current) => current && ({
    ...current,
    photos: [...current.photos, ...photos.filter((photo) => !current.photos.some((existing) => existing.mediaId === photo.id)).map((photo) => ({ mediaId: photo.id, image: photo.image, kind: 'result' as PhotoKind, captionNl: '', captionEn: '' }))],
    coverMediaId: current.coverMediaId ?? photos[0]?.id ?? null,
  })), []);
  const closePicker = useCallback(() => setPickerOpen(false), []);

  const reviews = useMemo(() => getReviews('nl'), []);
  const errors = useMemo(() => {
    if (!draft) return {} as Record<string, string>;
    const result: Record<string, string> = {};
    if (draft.titleNl.trim().length < 2) result.title = 'Geef het project een Nederlandse titel.';
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(draft.slug)) result.slug = 'Gebruik alleen kleine letters, cijfers en streepjes, bijvoorbeeld badkamer-almere.';
    if (draft.location && draft.location.trim().length < 2) result.location = 'Vul een plaatsnaam in of laat het veld leeg.';
    if (draft.status === 'published' && !draft.photos.length) result.photos = 'Een zichtbaar project heeft minstens één foto nodig.';
    return result;
  }, [draft]);

  if (loadError) return <div className="space-y-6"><PageHeader title="Project" /><Notice tone="error">{loadError}</Notice><GuardedLink to="/admin/projecten" className="btn-secondary">Terug naar projecten</GuardedLink></div>;
  if (!draft) return <LoadingBlock />;

  const save = async () => {
    setShowErrors(true);
    if (Object.keys(errors).length) {
      setState({ status: 'error', message: 'Controleer de velden met een rode melding.' });
      return;
    }
    let newId: string | null = null;
    const ok = await run(async () => {
      const coverMediaId = draft.photos.some((photo) => photo.mediaId === draft.coverMediaId) ? draft.coverMediaId : draft.photos[0]?.mediaId ?? null;
      const { data, error } = await client.rpc('save_project', {
        payload: {
          id: draft.id, slug: draft.slug, category: draft.category, title_nl: draft.titleNl.trim(), title_en: draft.titleEn.trim(),
          summary_nl: draft.summaryNl.trim(), summary_en: draft.summaryEn.trim(), location: draft.location.trim(), review_ref: draft.reviewRef,
          status: draft.status, is_featured: draft.isFeatured, cover_media_id: coverMediaId,
          photos: draft.photos.map((photo) => ({ media_id: photo.mediaId, kind: photo.kind, caption_nl: photo.captionNl.trim(), caption_en: photo.captionEn.trim() })),
        },
      });
      if (error) throw error;
      newId = data as string;
      const next = { ...draft, id: newId, coverMediaId, slugTouched: true };
      setDraft(next);
      setSaved(JSON.stringify(next));
    });
    if (ok && isNew && newId) navigate(`/admin/projecten/${newId}`, { replace: true });
  };

  const preview: Project = {
    id: draft.id ?? 'preview', slug: draft.slug, category: draft.category, titleNl: draft.titleNl || 'Titel van het project', titleEn: draft.titleEn,
    summaryNl: draft.summaryNl, summaryEn: draft.summaryEn, location: draft.location || null, reviewRef: null, isFeatured: draft.isFeatured,
    photos: draft.photos.flatMap((photo) => (photo.image ? [{ id: photo.mediaId, image: photo.image, kind: photo.kind, captionNl: photo.captionNl, captionEn: photo.captionEn, altNl: draft.titleNl, altEn: draft.titleEn }] : [])),
    cover: null,
  };
  preview.cover = preview.photos.find((photo) => photo.id === draft.coverMediaId) ?? preview.photos[0] ?? null;
  const shownErrors = showErrors ? errors : {};

  return (
    <div className="space-y-8">
      <GuardedLink to="/admin/projecten" className="inline-flex min-h-11 items-center gap-2 text-[15px] underline underline-offset-4"><ArrowLeft size={16} aria-hidden="true" />Alle projecten</GuardedLink>
      <PageHeader
        title={isNew ? 'Nieuw project' : draft.titleNl || 'Project'}
        description="Vul alleen gegevens in die kloppen. Een plaats of omschrijving die u niet zeker weet, kunt u beter leeg laten."
        actions={draft.id && draft.status === 'published' && !dirty ? <a href="/projecten" target="_blank" rel="noopener noreferrer" className="btn-secondary min-h-12"><ExternalLink size={16} aria-hidden="true" />Bekijk op de website</a> : undefined}
      />

      <div className="grid gap-8 xl:grid-cols-[1fr_18rem]">
        <div className="space-y-8">
          <Panel title="Zichtbaarheid">
            <div className="space-y-6">
              <ChoiceGroup<ProjectStatus> label="Status" value={draft.status} onChange={(status) => update({ status })} options={[
                { value: 'published', label: 'Zichtbaar', description: 'Staat op de website' },
                { value: 'hidden', label: 'Verborgen', description: 'Concept, alleen in beheer' },
                { value: 'archived', label: 'Gearchiveerd', description: 'Opgeborgen, niet zichtbaar' },
              ]} />
              <Toggle label="Uitlichten op de homepage" checked={draft.isFeatured} onChange={(isFeatured) => update({ isFeatured })} help="Uitgelichte projecten met een grote foto verschijnen bovenaan de homepage." />
            </div>
          </Panel>

          <Panel title="Over het project">
            <div className="space-y-6">
              <BilingualField label="Titel" required nl={draft.titleNl} en={draft.titleEn} onChangeNl={(titleNl) => update({ titleNl })} onChangeEn={(titleEn) => update({ titleEn })} error={shownErrors.title} placeholderNl="Bijvoorbeeld: Badkamer Almere Poort" />
              <ChoiceGroup<ProjectCategory> label="Soort project" value={draft.category} onChange={(category) => update({ category })} options={[
                { value: 'badkamer', label: 'Badkamer' },
                { value: 'toilet', label: 'Toilet' },
                { value: 'interieur', label: 'Interieur' },
              ]} />
              <TextField label="Plaats" value={draft.location} onChange={(location) => update({ location })} error={shownErrors.location} help="Alleen invullen als u de plaats zeker weet en de klant er geen bezwaar tegen heeft." placeholder="Bijvoorbeeld: Almere Poort" />
              <BilingualField label="Korte omschrijving van het werk" multiline nl={draft.summaryNl} en={draft.summaryEn} onChangeNl={(summaryNl) => update({ summaryNl })} onChangeEn={(summaryEn) => update({ summaryEn })} help="Eén of twee zinnen over wat er is gedaan." />
              <FieldShell label="Review van deze klant" help="Koppel alleen een review als die echt over dit project gaat. De review verschijnt dan op de projectpagina.">
                {({ id: fieldId, describedBy }) => (
                  <select id={fieldId} aria-describedby={describedBy} value={draft.reviewRef} onChange={(event) => update({ reviewRef: event.target.value })} className="block min-h-12 w-full border border-denra-ink/25 bg-white px-4 text-[17px]">
                    <option value="">Geen review koppelen</option>
                    {reviews.map((review) => <option key={review.id} value={review.id}>{review.name}{review.city ? `, ${review.city}` : ''} – {review.project} ({review.date})</option>)}
                  </select>
                )}
              </FieldShell>
              <TextField label="Webadres" value={draft.slug} onChange={(slug) => update({ slug: slugify(slug) || slug.toLowerCase(), slugTouched: true })} prefix="/" error={shownErrors.slug} help="Korte vaste naam voor dit project. Wordt automatisch ingevuld." />
            </div>
          </Panel>

          <Panel title="Foto’s" description="De omslagfoto is de foto die in overzichten wordt getoond. Zet de mooiste foto’s bovenaan.">
            {shownErrors.photos && <div className="mb-4"><Notice tone="error">{shownErrors.photos}</Notice></div>}
            {draft.photos.length === 0 && <p className="mb-4 text-denra-muted">Nog geen foto’s toegevoegd.</p>}
            <ol className="space-y-3">
              {draft.photos.map((photo, index) => (
                <li key={photo.mediaId} className="grid gap-4 border border-denra-line bg-white p-3 sm:grid-cols-[6rem_1fr_auto]">
                  <div className="h-32 w-24 overflow-hidden bg-denra-stone">
                    {photo.image && <img src={photo.image.src} srcSet={photo.image.srcSet} sizes="96px" alt="" className="h-full w-full object-cover" />}
                  </div>
                  <div className="space-y-3">
                    <label className="flex min-h-11 cursor-pointer items-center gap-3 text-[16px]">
                      <input type="radio" name="cover" checked={(draft.coverMediaId ?? draft.photos[0]?.mediaId) === photo.mediaId} onChange={() => update({ coverMediaId: photo.mediaId })} className="h-5 w-5 accent-[#231A12]" />
                      Omslagfoto
                    </label>
                    <label className="block text-[15px]">
                      <span className="mb-1 block font-medium">Soort foto</span>
                      <select value={photo.kind} onChange={(event) => updatePhoto(index, { kind: event.target.value as PhotoKind })} className="block min-h-11 w-full border border-denra-ink/25 bg-white px-3 text-[16px] sm:max-w-xs">
                        {kindOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                      </select>
                    </label>
                    <label className="block text-[15px]">
                      <span className="mb-1 block font-medium">Bijschrift (optioneel)</span>
                      <input value={photo.captionNl} onChange={(event) => updatePhoto(index, { captionNl: event.target.value })} placeholder="Bijvoorbeeld: Inloopdouche met nis" className="block min-h-11 w-full border border-denra-ink/25 bg-white px-3 text-[16px]" />
                    </label>
                  </div>
                  <div className="flex items-start sm:flex-col">
                    <IconButton label="Foto omhoog" onClick={() => movePhoto(index, -1)} disabled={index === 0}><ArrowUp size={18} /></IconButton>
                    <IconButton label="Foto omlaag" onClick={() => movePhoto(index, 1)} disabled={index === draft.photos.length - 1}><ArrowDown size={18} /></IconButton>
                    <IconButton label="Foto uit dit project halen" tone="danger" onClick={() => removePhoto(index)}><Trash2 size={18} /></IconButton>
                  </div>
                </li>
              ))}
            </ol>
            <button type="button" onClick={() => setPickerOpen(true)} className="btn-secondary mt-4 min-h-14 text-[16px]"><ImagePlus size={20} aria-hidden="true" />Foto’s toevoegen of uploaden</button>
            <p className="mt-2 text-[14px] text-denra-muted">Een foto uit het project halen verwijdert hem niet: hij blijft in de fotobibliotheek.</p>
          </Panel>
        </div>

        <aside className="xl:sticky xl:top-6 xl:self-start">
          <p className="mb-3 text-[15px] font-medium">Zo ziet het eruit</p>
          {preview.cover ? (
            <div className="pointer-events-none" aria-hidden="true"><ProjectCard project={preview} /></div>
          ) : <div className="flex aspect-[4/5] items-center justify-center bg-denra-stone p-6 text-center text-denra-muted">Voeg een foto toe om een voorbeeld te zien.</div>}
        </aside>
      </div>

      <SaveBar state={state} dirty={dirty || isNew} onSave={save} onReset={draft.id ? () => setDraft(JSON.parse(saved)) : undefined} saveLabel={isNew ? 'Project opslaan' : 'Wijzigingen opslaan'} />
      <PhotoPicker open={pickerOpen} exclude={draft.photos.map((photo) => photo.mediaId)} onClose={closePicker} onPick={addPhotos} />
    </div>
  );
}

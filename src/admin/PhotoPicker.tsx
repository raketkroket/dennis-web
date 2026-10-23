import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, X } from 'lucide-react';
import { useAdminClient } from './auth';
import { listLibrary, type LibraryPhoto } from './data';
import PhotoUploader from './PhotoUploader';
import { mediaImage } from '../content/load';
import { friendlyError, LoadingBlock, Notice } from './ui';

interface PhotoPickerProps {
  open: boolean;
  exclude: string[];
  onClose: () => void;
  onPick: (photos: LibraryPhoto[]) => void;
}

/** Dialog for adding library photos (or fresh uploads) to a project. */
export default function PhotoPicker({ open, exclude, onClose, onPick }: PhotoPickerProps) {
  const client = useAdminClient();
  const [photos, setPhotos] = useState<LibraryPhoto[] | null>(null);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [filter, setFilter] = useState<'unused' | 'all'>('unused');
  const closeRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return undefined;
    setSelected([]);
    listLibrary(client).then(setPhotos).catch((loadError) => setError(friendlyError(loadError)));
    const opener = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onCloseRef.current(); };
    window.addEventListener('keydown', onKeyDown);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = overflow;
      opener?.focus();
    };
  }, [open, client]);

  if (!open) return null;
  const available = (photos ?? []).filter((photo) => !exclude.includes(photo.id) && photo.image && (filter === 'all' || photo.usedIn.length === 0));
  const toggle = (id: string) => setSelected((current) => (current.includes(id) ? current.filter((candidate) => candidate !== id) : [...current, id]));

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-denra-night/60 sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby="picker-title">
      <div className="flex max-h-[92vh] w-full max-w-4xl flex-col bg-denra-ivory">
        <div className="flex items-center justify-between gap-4 border-b border-denra-line px-5 py-4">
          <h2 id="picker-title" className="font-serif text-2xl">Foto’s toevoegen</h2>
          <button ref={closeRef} type="button" onClick={onClose} className="flex h-12 items-center gap-2 border border-denra-ink/20 px-4"><X size={18} aria-hidden="true" />Sluiten</button>
        </div>
        <div className="overflow-y-auto px-5 py-5">
          <PhotoUploader onUploaded={(media) => {
            const fresh = media.map((row) => ({ ...row, image: mediaImage(row), usedIn: [] }));
            setPhotos((current) => [...fresh, ...(current ?? [])]);
            setSelected((current) => [...current, ...fresh.map((photo) => photo.id)]);
          }} />
          <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-denra-line pt-5">
            <span className="mr-2 text-[15px] font-medium">Uit de fotobibliotheek:</span>
            {(['unused', 'all'] as const).map((option) => (
              <button key={option} type="button" aria-pressed={filter === option} onClick={() => setFilter(option)} className={`min-h-11 px-4 text-[15px] ${filter === option ? 'bg-denra-ink text-denra-ivory' : 'border border-denra-ink/20'}`}>
                {option === 'unused' ? 'Nog niet gebruikt' : 'Alle foto’s'}
              </button>
            ))}
          </div>
          {error && <div className="mt-4"><Notice tone="error">{error}</Notice></div>}
          {!photos && !error && <LoadingBlock label="Fotobibliotheek laden…" />}
          {photos && available.length === 0 && <p className="mt-6 text-denra-muted">Geen foto’s in deze selectie. Upload een nieuwe foto of kies “Alle foto’s”.</p>}
          <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {available.map((photo) => {
              const isSelected = selected.includes(photo.id);
              return (
                <li key={photo.id}>
                  <button type="button" onClick={() => toggle(photo.id)} aria-pressed={isSelected} className={`relative block aspect-[4/5] w-full overflow-hidden bg-denra-stone ${isSelected ? 'ring-4 ring-denra-ink' : ''}`}>
                    {photo.image && <img src={photo.image.src} srcSet={photo.image.srcSet} sizes="200px" alt={photo.alt_nl || 'Projectfoto'} loading="lazy" className="h-full w-full object-cover" />}
                    {isSelected && <span className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center bg-denra-ink text-denra-ivory"><Check size={18} aria-hidden="true" /></span>}
                    {photo.usedIn.length > 0 && <span className="absolute bottom-0 inset-x-0 truncate bg-denra-ivory/90 px-2 py-1 text-left text-[12px]">In: {photo.usedIn[0].title_nl}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="flex items-center justify-between gap-4 border-t border-denra-line px-5 py-4">
          <p className="text-[15px] text-denra-muted">{selected.length} geselecteerd</p>
          <button type="button" disabled={!selected.length} onClick={() => { onPick((photos ?? []).filter((photo) => selected.includes(photo.id))); onClose(); }} className="btn-primary min-h-12">
            Toevoegen aan project
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

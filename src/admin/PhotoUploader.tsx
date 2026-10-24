import { useRef, useState } from 'react';
import { Camera, Check, ImagePlus, TriangleAlert } from 'lucide-react';
import type { MediaRow } from '../content/load';
import { useAdminClient } from './auth';
import { uploadPhoto, UploadError, type UploadStage } from './upload';

interface UploadItem {
  id: string;
  name: string;
  stage: UploadStage | 'error';
  progress: number;
  error?: string;
}

const stageLabel: Record<UploadItem['stage'], string> = {
  checking: 'Controleren…',
  optimizing: 'Verkleinen voor de website…',
  uploading: 'Uploaden…',
  saving: 'Opslaan…',
  done: 'Klaar',
  error: 'Niet gelukt',
};

export default function PhotoUploader({ onUploaded }: { onUploaded: (media: MediaRow[]) => void }) {
  const client = useAdminClient();
  const fileInput = useRef<HTMLInputElement>(null);
  const cameraInput = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<UploadItem[]>([]);
  const busy = items.some((item) => !['done', 'error'].includes(item.stage));

  const start = async (files: FileList | null) => {
    if (!files?.length) return;
    const queue = [...files].map((file) => ({ file, item: { id: crypto.randomUUID(), name: file.name || 'foto', stage: 'checking' as UploadStage, progress: 0 } }));
    setItems((current) => [...queue.map(({ item }) => item), ...current.filter((item) => item.stage !== 'done')]);
    const uploaded: MediaRow[] = [];
    // One at a time keeps a phone's memory and connection comfortable.
    for (const { file, item } of queue) {
      const patch = (next: Partial<UploadItem>) => setItems((current) => current.map((candidate) => (candidate.id === item.id ? { ...candidate, ...next } : candidate)));
      try {
        uploaded.push(await uploadPhoto(client, file, (stage, progress) => patch({ stage, progress: progress ?? 0 })));
      } catch (error) {
        patch({ stage: 'error', error: error instanceof UploadError ? error.message : 'Er ging iets mis. Probeer het opnieuw.' });
      }
    }
    if (uploaded.length) onUploaded(uploaded);
    if (fileInput.current) fileInput.current.value = '';
    if (cameraInput.current) cameraInput.current.value = '';
  };

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <button type="button" onClick={() => fileInput.current?.click()} disabled={busy} className="btn-primary min-h-14 text-[16px]">
          <ImagePlus size={20} aria-hidden="true" />Foto’s kiezen en uploaden
        </button>
        <button type="button" onClick={() => cameraInput.current?.click()} disabled={busy} className="btn-secondary min-h-14 text-[16px] sm:hidden">
          <Camera size={20} aria-hidden="true" />Foto maken
        </button>
      </div>
      <p className="mt-2 text-[14px] text-denra-muted">JPG, PNG, WebP of iPhone-foto’s tot 30 MB. Foto’s worden automatisch verkleind, zodat de website snel blijft.</p>
      <input ref={fileInput} type="file" accept="image/*" multiple className="sr-only" tabIndex={-1} aria-hidden="true" onChange={(event) => start(event.target.files)} />
      <input ref={cameraInput} type="file" accept="image/*" capture="environment" className="sr-only" tabIndex={-1} aria-hidden="true" onChange={(event) => start(event.target.files)} />

      {items.length > 0 && (
        <ul className="mt-4 space-y-2" aria-live="polite">
          {items.map((item) => (
            <li key={item.id} className="border border-denra-line bg-white px-4 py-3">
              <div className="flex items-center justify-between gap-3 text-[15px]">
                <span className="min-w-0 truncate">{item.name}</span>
                <span className={`flex shrink-0 items-center gap-1.5 ${item.stage === 'error' ? 'text-[#A33B32]' : item.stage === 'done' ? 'text-[#2E4A32]' : 'text-denra-muted'}`}>
                  {item.stage === 'done' && <Check size={16} aria-hidden="true" />}
                  {item.stage === 'error' && <TriangleAlert size={16} aria-hidden="true" />}
                  {stageLabel[item.stage]}{item.stage === 'uploading' ? ` ${Math.round(item.progress * 100)}%` : ''}
                </span>
              </div>
              {!['done', 'error'].includes(item.stage) && (
                <div className="mt-2 h-1.5 bg-denra-stone" role="progressbar" aria-label={`Voortgang ${item.name}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round((item.stage === 'uploading' ? item.progress : item.stage === 'saving' ? 1 : 0.05) * 100)}>
                  <div className="h-full bg-denra-ink transition-[width]" style={{ width: `${(item.stage === 'uploading' ? 10 + item.progress * 85 : item.stage === 'saving' ? 97 : item.stage === 'optimizing' ? 8 : 3)}%` }} />
                </div>
              )}
              {item.error && <p className="mt-1.5 text-[14px] text-[#A33B32]">{item.error}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowUp, Eye, EyeOff, Pencil, Plus, Star } from 'lucide-react';
import { projectFromRow, type ProjectRow } from '../../content/load';
import { useAdminClient } from '../auth';
import { listProjects } from '../data';
import { friendlyError, IconButton, LoadingBlock, Notice, PageHeader, StatusBadge } from '../ui';

const categoryLabels = { badkamer: 'Badkamer', toilet: 'Toilet', interieur: 'Interieur' } as const;

export default function Projects() {
  const client = useAdminClient();
  const [projects, setProjects] = useState<ProjectRow[] | null>(null);
  const [view, setView] = useState<'active' | 'archived'>('active');
  const [message, setMessage] = useState<{ tone: 'success' | 'error'; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => listProjects(client).then(setProjects).catch((error) => setMessage({ tone: 'error', text: friendlyError(error) })), [client]);
  useEffect(() => { void load(); }, [load]);

  const visible = (projects ?? []).filter((project) => (view === 'archived' ? project.status === 'archived' : project.status !== 'archived'));

  const move = async (index: number, direction: number) => {
    if (!projects) return;
    const ordered = [...visible];
    const [item] = ordered.splice(index, 1);
    ordered.splice(index + direction, 0, item);
    // Keep archived projects after the active ones.
    const ids = [...ordered, ...projects.filter((project) => !ordered.includes(project))].map((project) => project.id);
    const previous = projects;
    setProjects(ids.map((id) => projects.find((project) => project.id === id) as ProjectRow));
    setBusy(true);
    const { error } = await client.rpc('reorder_projects', { project_ids: ids });
    setBusy(false);
    if (error) {
      setProjects(previous);
      setMessage({ tone: 'error', text: friendlyError(error) });
    } else setMessage({ tone: 'success', text: `De volgorde is opgeslagen. “${item.title_nl}” staat nu op plaats ${index + direction + 1}.` });
  };

  const setStatus = async (project: ProjectRow, status: ProjectRow['status']) => {
    if (status === 'published' && !project.project_photos.length) {
      setMessage({ tone: 'error', text: `“${project.title_nl}” heeft nog geen foto’s. Voeg eerst een foto toe voordat u het project zichtbaar maakt.` });
      return;
    }
    setBusy(true);
    const { error } = await client.from('projects').update({ status }).eq('id', project.id);
    setBusy(false);
    if (error) return setMessage({ tone: 'error', text: friendlyError(error) });
    setProjects((current) => current?.map((candidate) => (candidate.id === project.id ? { ...candidate, status } : candidate)) ?? null);
    setMessage({ tone: 'success', text: status === 'published' ? `“${project.title_nl}” staat weer op de website.` : status === 'hidden' ? `“${project.title_nl}” is verborgen. Bezoekers zien het niet meer.` : `“${project.title_nl}” is gearchiveerd.` });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projecten"
        description="De volgorde hier is de volgorde op de website. Projecten met een ster komen als eerste op de homepage."
        actions={<Link to="/admin/projecten/nieuw" className="btn-primary min-h-12"><Plus size={18} aria-hidden="true" />Nieuw project</Link>}
      />
      <div className="flex gap-2" role="group" aria-label="Welke projecten tonen">
        {(['active', 'archived'] as const).map((option) => (
          <button key={option} type="button" aria-pressed={view === option} onClick={() => setView(option)} className={`min-h-11 px-4 text-[15px] ${view === option ? 'bg-denra-ink text-denra-ivory' : 'border border-denra-ink/20'}`}>
            {option === 'active' ? `Actief (${(projects ?? []).filter((project) => project.status !== 'archived').length})` : `Archief (${(projects ?? []).filter((project) => project.status === 'archived').length})`}
          </button>
        ))}
      </div>
      {message && <Notice tone={message.tone}>{message.text}</Notice>}
      {!projects ? <LoadingBlock /> : visible.length === 0 ? (
        <p className="text-denra-muted">{view === 'archived' ? 'Er zijn geen gearchiveerde projecten.' : 'Er zijn nog geen projecten. Voeg uw eerste project toe.'}</p>
      ) : (
        <ol className="divide-y divide-denra-line border-y border-denra-line">
          {visible.map((row, index) => {
            const project = projectFromRow(row);
            return (
              <li key={row.id} className="flex flex-wrap items-center gap-4 py-3 sm:flex-nowrap">
                <span className="w-7 shrink-0 text-right text-[15px] text-denra-muted">{index + 1}</span>
                <div className="h-20 w-16 shrink-0 overflow-hidden bg-denra-stone">
                  {project.cover && <img src={project.cover.image.src} srcSet={project.cover.image.srcSet} sizes="64px" alt="" className="h-full w-full object-cover" loading="lazy" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="flex items-start gap-2 text-[17px] font-medium leading-snug">
                    {row.is_featured && <Star size={16} className="mt-1 shrink-0 text-denra-bronze" fill="currentColor" aria-label="Uitgelicht op de homepage" />}
                    <span className="line-clamp-2">{row.title_nl}</span>
                  </p>
                  <p className="text-[14px] text-denra-muted">{categoryLabels[row.category]}{row.location ? ` · ${row.location}` : ''} · {row.project_photos.length === 1 ? '1 foto' : `${row.project_photos.length} foto’s`}</p>
                </div>
                <StatusBadge status={row.status} />
                <div className="flex shrink-0 items-center">
                  {view === 'active' && (
                    <>
                      <IconButton label={`${row.title_nl} omhoog`} onClick={() => move(index, -1)} disabled={busy || index === 0}><ArrowUp size={18} /></IconButton>
                      <IconButton label={`${row.title_nl} omlaag`} onClick={() => move(index, 1)} disabled={busy || index === visible.length - 1}><ArrowDown size={18} /></IconButton>
                      {row.status === 'published'
                        ? <IconButton label={`${row.title_nl} verbergen`} onClick={() => setStatus(row, 'hidden')} disabled={busy}><EyeOff size={18} /></IconButton>
                        : <IconButton label={`${row.title_nl} tonen op de website`} onClick={() => setStatus(row, 'published')} disabled={busy}><Eye size={18} /></IconButton>}
                    </>
                  )}
                  {view === 'archived' && <button type="button" onClick={() => setStatus(row, 'hidden')} disabled={busy} className="btn-secondary min-h-11 px-4">Terugzetten</button>}
                  <Link to={`/admin/projecten/${row.id}`} className="ml-1 inline-flex min-h-12 items-center gap-2 border border-denra-ink/20 px-4 text-[15px] hover:border-denra-ink" aria-label={`${row.title_nl} bewerken`}>
                    <Pencil size={16} aria-hidden="true" />Bewerken
                  </Link>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}

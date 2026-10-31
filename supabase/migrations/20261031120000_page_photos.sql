-- Photos can now also be chosen for fixed places on the pages (admin:
-- Uitstraling → Foto's op de pagina's), stored in site_content as
-- "photo.<slot>" = the media id. Those photos must be public too, even when
-- they are not part of a published project.

drop policy if exists "Published photos are public" on public.media;
create policy "Published photos are public" on public.media for select using (
  public.is_admin()
  or exists (
    select 1 from public.project_photos pp join public.projects p on p.id = pp.project_id
    where pp.media_id = media.id and p.status = 'published'
  )
  or exists (
    select 1 from public.site_content sc
    where sc.key like 'photo.%' and sc.value_nl = media.id::text
  )
);

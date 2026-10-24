-- Content management for Denra Badkamers: projects, photos, texts, FAQs,
-- business details, calculator prices, quote requests and admin moderation
-- of reviews. Every write is checked in the database itself (row level
-- security plus security-definer functions that call public.is_admin()).
--
-- Safe to run more than once.

-- ── Administrators ────────────────────────────────────────────────────────

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);
alter table public.admin_users enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid());
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated, service_role;

drop policy if exists "Admins see their own admin row" on public.admin_users;
create policy "Admins see their own admin row" on public.admin_users
  for select to authenticated using (user_id = auth.uid());

-- Keeps updated_at current on every content table.
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ── Business details (one row) ───────────────────────────────────────────

create table if not exists public.business_settings (
  id smallint primary key default 1 check (id = 1),
  company_name text not null check (char_length(company_name) between 2 and 120),
  legal_name text not null default '' check (char_length(legal_name) <= 160),
  phone_display text not null check (char_length(phone_display) between 6 and 40),
  phone_link text not null check (phone_link ~ '^\+?[0-9]{8,15}$'),
  whatsapp_number text not null check (whatsapp_number ~ '^[0-9]{8,15}$'),
  email text not null check (email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  address_nl text not null default '' check (char_length(address_nl) <= 200),
  address_en text not null default '' check (char_length(address_en) <= 200),
  hours_nl text not null default '' check (char_length(hours_nl) <= 120),
  hours_en text not null default '' check (char_length(hours_en) <= 120),
  instagram_url text not null default '' check (instagram_url = '' or instagram_url ~ '^https://'),
  facebook_url text not null default '' check (facebook_url = '' or facebook_url ~ '^https://'),
  tiktok_url text not null default '' check (tiktok_url = '' or tiktok_url ~ '^https://'),
  service_areas text[] not null default '{}' check (cardinality(service_areas) <= 40),
  updated_at timestamptz not null default now()
);
alter table public.business_settings enable row level security;
drop trigger if exists business_settings_touch on public.business_settings;
create trigger business_settings_touch before update on public.business_settings for each row execute function public.touch_updated_at();

drop policy if exists "Business details are public" on public.business_settings;
create policy "Business details are public" on public.business_settings for select using (true);
drop policy if exists "Admins update business details" on public.business_settings;
create policy "Admins update business details" on public.business_settings
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Admins create business details" on public.business_settings;
create policy "Admins create business details" on public.business_settings
  for insert to authenticated with check (public.is_admin());

-- ── Website texts (overrides for translation keys) ───────────────────────

create table if not exists public.site_content (
  key text primary key check (key ~ '^[a-zA-Z]+\.[a-zA-Z0-9]+$'),
  value_nl text not null default '' check (char_length(value_nl) <= 4000),
  value_en text not null default '' check (char_length(value_en) <= 4000),
  updated_at timestamptz not null default now()
);
alter table public.site_content enable row level security;
drop trigger if exists site_content_touch on public.site_content;
create trigger site_content_touch before update on public.site_content for each row execute function public.touch_updated_at();

drop policy if exists "Website texts are public" on public.site_content;
create policy "Website texts are public" on public.site_content for select using (true);
drop policy if exists "Admins manage website texts" on public.site_content;
create policy "Admins manage website texts" on public.site_content
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ── FAQs ─────────────────────────────────────────────────────────────────

create table if not exists public.faqs (
  id text primary key check (id ~ '^[a-z0-9-]{3,80}$'),
  page text not null check (page in ('algemeen', 'badkamer', 'wc', 'binnen')),
  question_nl text not null check (char_length(question_nl) between 3 and 300),
  answer_nl text not null check (char_length(answer_nl) between 3 and 3000),
  question_en text not null default '' check (char_length(question_en) <= 300),
  answer_en text not null default '' check (char_length(answer_en) <= 3000),
  is_visible boolean not null default true,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);
alter table public.faqs enable row level security;
drop trigger if exists faqs_touch on public.faqs;
create trigger faqs_touch before update on public.faqs for each row execute function public.touch_updated_at();

drop policy if exists "Visible FAQs are public" on public.faqs;
create policy "Visible FAQs are public" on public.faqs for select using (is_visible or public.is_admin());
drop policy if exists "Admins manage FAQs" on public.faqs;
create policy "Admins manage FAQs" on public.faqs
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ── Photos ───────────────────────────────────────────────────────────────
-- A photo is either an uploaded file in the project-photos bucket or one of
-- the photos that ship with the website (static_key, see src/content/defaults.ts).

create table if not exists public.media (
  id uuid primary key default gen_random_uuid(),
  storage_path text unique check (storage_path ~ '^[a-z0-9][a-z0-9/_.-]{3,200}$'),
  static_key text unique check (static_key ~ '^[a-z0-9-]{2,80}$'),
  width integer not null check (width between 1 and 20000),
  height integer not null check (height between 1 and 20000),
  size_bytes integer check (size_bytes >= 0),
  alt_nl text not null default '' check (char_length(alt_nl) <= 300),
  alt_en text not null default '' check (char_length(alt_en) <= 300),
  created_at timestamptz not null default now(),
  check (num_nonnulls(storage_path, static_key) = 1)
);
alter table public.media enable row level security;

-- ── Projects ─────────────────────────────────────────────────────────────

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) <= 100),
  category text not null check (category in ('badkamer', 'toilet', 'interieur')),
  title_nl text not null check (char_length(title_nl) between 2 and 120),
  title_en text not null default '' check (char_length(title_en) <= 120),
  summary_nl text not null default '' check (char_length(summary_nl) <= 1200),
  summary_en text not null default '' check (char_length(summary_en) <= 1200),
  location text check (location is null or char_length(location) between 2 and 80),
  review_ref text check (review_ref is null or review_ref ~ '^[a-z0-9-]{2,80}$'),
  status text not null default 'hidden' check (status in ('published', 'hidden', 'archived')),
  is_featured boolean not null default false,
  sort_order integer not null default 0,
  cover_media_id uuid references public.media(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.projects enable row level security;
create index if not exists projects_status_sort on public.projects (status, sort_order);
drop trigger if exists projects_touch on public.projects;
create trigger projects_touch before update on public.projects for each row execute function public.touch_updated_at();

create table if not exists public.project_photos (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  media_id uuid not null references public.media(id) on delete restrict,
  sort_order integer not null default 0,
  kind text not null default 'result' check (kind in ('result', 'during', 'before', 'after')),
  caption_nl text not null default '' check (char_length(caption_nl) <= 200),
  caption_en text not null default '' check (char_length(caption_en) <= 200),
  unique (project_id, media_id)
);
alter table public.project_photos enable row level security;
create index if not exists project_photos_project on public.project_photos (project_id, sort_order);
create index if not exists project_photos_media on public.project_photos (media_id);

drop policy if exists "Published projects are public" on public.projects;
create policy "Published projects are public" on public.projects for select using (status = 'published' or public.is_admin());
drop policy if exists "Admins manage projects" on public.projects;
create policy "Admins manage projects" on public.projects
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Photos of published projects are public" on public.project_photos;
create policy "Photos of published projects are public" on public.project_photos for select using (
  public.is_admin() or exists (select 1 from public.projects p where p.id = project_id and p.status = 'published')
);
drop policy if exists "Admins manage project photos" on public.project_photos;
create policy "Admins manage project photos" on public.project_photos
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Photos that are not (yet) used in a published project stay private.
drop policy if exists "Published photos are public" on public.media;
create policy "Published photos are public" on public.media for select using (
  public.is_admin() or exists (
    select 1 from public.project_photos pp join public.projects p on p.id = pp.project_id
    where pp.media_id = media.id and p.status = 'published'
  )
);
drop policy if exists "Admins manage photos" on public.media;
create policy "Admins manage photos" on public.media
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ── Calculator ───────────────────────────────────────────────────────────

create table if not exists public.calculator_rooms (
  room_type text primary key check (room_type in ('badkamer', 'wc')),
  label_nl text not null check (char_length(label_nl) between 2 and 60),
  label_en text not null default '' check (char_length(label_en) <= 60),
  description_nl text not null default '' check (char_length(description_nl) <= 200),
  description_en text not null default '' check (char_length(description_en) <= 200),
  base_price integer not null check (base_price between 0 and 100000),
  included_area numeric(6, 2) not null check (included_area > 0 and included_area <= 100),
  is_active boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.calculator_tiers (
  room_type text not null references public.calculator_rooms(room_type) on delete cascade,
  from_area numeric(6, 2) not null check (from_area >= 0 and from_area <= 400),
  rate_per_m2 integer not null check (rate_per_m2 between 0 and 20000),
  primary key (room_type, from_area)
);

create table if not exists public.calculator_options (
  id text primary key check (id ~ '^[a-z0-9_]{2,60}$'),
  group_id text not null check (group_id in ('afwerking', 'tegelwerk', 'installatie', 'toilet')),
  label_nl text not null check (char_length(label_nl) between 2 and 120),
  label_en text not null default '' check (char_length(label_en) <= 120),
  price integer not null check (price between 0 and 100000),
  included_nl text not null default '' check (char_length(included_nl) <= 300),
  included_en text not null default '' check (char_length(included_en) <= 300),
  note_nl text not null default '' check (char_length(note_nl) <= 300),
  note_en text not null default '' check (char_length(note_en) <= 300),
  rooms text[] not null check (cardinality(rooms) between 1 and 2 and rooms <@ array['badkamer', 'wc']),
  conflicts_with text[] not null default '{}',
  is_active boolean not null default true,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.calculator_rooms enable row level security;
alter table public.calculator_tiers enable row level security;
alter table public.calculator_options enable row level security;
drop policy if exists "Calculator rooms are public" on public.calculator_rooms;
create policy "Calculator rooms are public" on public.calculator_rooms for select using (true);
drop policy if exists "Calculator tiers are public" on public.calculator_tiers;
create policy "Calculator tiers are public" on public.calculator_tiers for select using (true);
drop policy if exists "Calculator options are public" on public.calculator_options;
create policy "Calculator options are public" on public.calculator_options for select using (true);
-- Changes go through public.save_calculator() so a price list is never half saved.

-- ── Quote requests ───────────────────────────────────────────────────────
-- Inserted only by api/offerte.ts with the service-role key.

create table if not exists public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status text not null default 'nieuw' check (status in ('nieuw', 'in_behandeling', 'offerte_verstuurd', 'afgerond', 'gearchiveerd')),
  language text not null default 'nl' check (language in ('nl', 'en')),
  name text not null check (char_length(name) between 2 and 120),
  email text not null check (char_length(email) <= 254),
  phone text not null check (char_length(phone) between 6 and 40),
  city text not null default '' check (char_length(city) <= 100),
  service text not null check (char_length(service) between 1 and 100),
  message text not null check (char_length(message) between 10 and 5000),
  room_type text check (room_type in ('badkamer', 'wc')),
  length_m numeric(5, 2),
  width_m numeric(5, 2),
  area_m2 numeric(7, 2),
  selected_options jsonb not null default '[]'::jsonb,
  estimate_total integer,
  client_total integer,
  email_status text not null default 'pending' check (email_status in ('pending', 'sent', 'partly_sent', 'failed', 'not_configured')),
  admin_notes text not null default '' check (char_length(admin_notes) <= 5000),
  updated_at timestamptz not null default now()
);
alter table public.quote_requests enable row level security;
create index if not exists quote_requests_status_created on public.quote_requests (status, created_at desc);
drop trigger if exists quote_requests_touch on public.quote_requests;
create trigger quote_requests_touch before update on public.quote_requests for each row execute function public.touch_updated_at();

drop policy if exists "Admins read quote requests" on public.quote_requests;
create policy "Admins read quote requests" on public.quote_requests for select to authenticated using (public.is_admin());
drop policy if exists "Admins update quote requests" on public.quote_requests;
create policy "Admins update quote requests" on public.quote_requests
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
-- Admins may only change the status and their own notes.
revoke update on public.quote_requests from anon, authenticated;
grant update (status, admin_notes) on public.quote_requests to authenticated;

-- ── Reviews: stop exposing e-mail addresses, add admin moderation ────────

alter table public.reviews add column if not exists updated_at timestamptz not null default now();
alter table public.reviews add column if not exists moderated_at timestamptz;
drop trigger if exists reviews_touch on public.reviews;
create trigger reviews_touch before update on public.reviews for each row execute function public.touch_updated_at();

-- The original policy let anyone with the public key read every column of
-- approved reviews, including e-mail and the moderation token hash.
drop policy if exists "Published reviews are publicly readable" on public.reviews;
revoke select, insert, update, delete on public.reviews from anon, authenticated;
grant select (id, name, city, rating, project, text, status, created_at, approved_at) on public.reviews to anon;
grant select (id, name, email, city, rating, project, text, status, created_at, approved_at, moderated_at, updated_at) on public.reviews to authenticated;
grant update (status, approved_at, moderated_at) on public.reviews to authenticated;
drop policy if exists "Approved reviews are public" on public.reviews;
create policy "Approved reviews are public" on public.reviews for select to anon using (status = 'approved');
drop policy if exists "Admins read reviews" on public.reviews;
create policy "Admins read reviews" on public.reviews for select to authenticated using (public.is_admin() or status = 'approved');
drop policy if exists "Admins moderate reviews" on public.reviews;
create policy "Admins moderate reviews" on public.reviews
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

-- ── Storage for uploaded photos ──────────────────────────────────────────

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('project-photos', 'project-photos', true, 10485760, array['image/jpeg', 'image/webp', 'image/png'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

-- Supabase needs a select policy for uploads that return the new row.
drop policy if exists "Admins see project photos" on storage.objects;
create policy "Admins see project photos" on storage.objects
  for select to authenticated using (bucket_id = 'project-photos' and public.is_admin());
drop policy if exists "Admins upload project photos" on storage.objects;
create policy "Admins upload project photos" on storage.objects
  for insert to authenticated with check (bucket_id = 'project-photos' and public.is_admin());
drop policy if exists "Admins change project photos" on storage.objects;
create policy "Admins change project photos" on storage.objects
  for update to authenticated using (bucket_id = 'project-photos' and public.is_admin()) with check (bucket_id = 'project-photos' and public.is_admin());
drop policy if exists "Admins delete project photos" on storage.objects;
create policy "Admins delete project photos" on storage.objects
  for delete to authenticated using (bucket_id = 'project-photos' and public.is_admin());

-- ── Saving several rows at once ──────────────────────────────────────────

-- Saves a project and its complete photo list in one transaction.
-- payload: { id?, slug, category, title_nl, title_en, summary_nl, summary_en,
--            location, review_ref, status, is_featured, cover_media_id,
--            photos: [{ media_id, kind, caption_nl, caption_en }] }
create or replace function public.save_project(payload jsonb)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  saved_id uuid := nullif(payload ->> 'id', '')::uuid;
  photo jsonb;
  next_position integer := 0;
begin
  if not public.is_admin() then
    raise exception 'Alleen beheerders kunnen projecten opslaan.' using errcode = '42501';
  end if;

  if saved_id is null then
    insert into public.projects (slug, category, title_nl, title_en, summary_nl, summary_en, location, review_ref, status, is_featured, cover_media_id, sort_order)
    values (
      payload ->> 'slug', payload ->> 'category', payload ->> 'title_nl', coalesce(payload ->> 'title_en', ''),
      coalesce(payload ->> 'summary_nl', ''), coalesce(payload ->> 'summary_en', ''), nullif(payload ->> 'location', ''),
      nullif(payload ->> 'review_ref', ''), coalesce(payload ->> 'status', 'hidden'), coalesce((payload ->> 'is_featured')::boolean, false),
      nullif(payload ->> 'cover_media_id', '')::uuid,
      coalesce((select min(sort_order) - 10 from public.projects), 0)
    )
    returning id into saved_id;
  else
    update public.projects set
      slug = payload ->> 'slug',
      category = payload ->> 'category',
      title_nl = payload ->> 'title_nl',
      title_en = coalesce(payload ->> 'title_en', ''),
      summary_nl = coalesce(payload ->> 'summary_nl', ''),
      summary_en = coalesce(payload ->> 'summary_en', ''),
      location = nullif(payload ->> 'location', ''),
      review_ref = nullif(payload ->> 'review_ref', ''),
      status = coalesce(payload ->> 'status', status),
      is_featured = coalesce((payload ->> 'is_featured')::boolean, is_featured),
      cover_media_id = nullif(payload ->> 'cover_media_id', '')::uuid
    where id = saved_id;
    if not found then
      raise exception 'Project niet gevonden.' using errcode = 'P0002';
    end if;
  end if;

  delete from public.project_photos where project_id = saved_id;
  for photo in select * from jsonb_array_elements(coalesce(payload -> 'photos', '[]'::jsonb)) loop
    insert into public.project_photos (project_id, media_id, sort_order, kind, caption_nl, caption_en)
    values (saved_id, (photo ->> 'media_id')::uuid, next_position, coalesce(photo ->> 'kind', 'result'), coalesce(photo ->> 'caption_nl', ''), coalesce(photo ->> 'caption_en', ''));
    next_position := next_position + 10;
  end loop;

  return saved_id;
end;
$$;

create or replace function public.reorder_projects(project_ids uuid[])
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Alleen beheerders kunnen de volgorde aanpassen.' using errcode = '42501';
  end if;
  update public.projects p set sort_order = ordered.ord * 10
  from unnest(project_ids) with ordinality as ordered(id, ord)
  where p.id = ordered.id;
end;
$$;

-- Replaces the FAQ list of one page.
create or replace function public.save_faqs(faq_page text, items jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  item jsonb;
  next_position integer := 0;
begin
  if not public.is_admin() then
    raise exception 'Alleen beheerders kunnen vragen opslaan.' using errcode = '42501';
  end if;
  if jsonb_typeof(items) is distinct from 'array' then
    raise exception 'Ongeldige lijst met vragen.' using errcode = '22023';
  end if;
  delete from public.faqs where page = faq_page
    and id not in (select value ->> 'id' from jsonb_array_elements(items));
  for item in select * from jsonb_array_elements(items) loop
    insert into public.faqs (id, page, question_nl, answer_nl, question_en, answer_en, is_visible, sort_order)
    values (item ->> 'id', faq_page, item ->> 'question_nl', item ->> 'answer_nl', coalesce(item ->> 'question_en', ''), coalesce(item ->> 'answer_en', ''), coalesce((item ->> 'is_visible')::boolean, true), next_position)
    on conflict (id) do update set
      page = excluded.page, question_nl = excluded.question_nl, answer_nl = excluded.answer_nl,
      question_en = excluded.question_en, answer_en = excluded.answer_en,
      is_visible = excluded.is_visible, sort_order = excluded.sort_order;
    next_position := next_position + 10;
  end loop;
end;
$$;

-- Replaces the complete calculator price list.
-- config: { rooms: [{ room_type, label_nl, label_en, description_nl, description_en,
--                     base_price, included_area, is_active, tiers: [{ from_area, rate_per_m2 }] }],
--           options: [{ id, group_id, label_nl, label_en, price, included_nl, included_en,
--                       note_nl, note_en, rooms, conflicts_with, is_active, sort_order }] }
create or replace function public.save_calculator(config jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  room jsonb;
  tier jsonb;
  item jsonb;
  unknown_conflict text;
begin
  if not public.is_admin() then
    raise exception 'Alleen beheerders kunnen prijzen aanpassen.' using errcode = '42501';
  end if;
  if jsonb_typeof(config -> 'rooms') is distinct from 'array' or jsonb_typeof(config -> 'options') is distinct from 'array' then
    raise exception 'Ongeldige prijslijst.' using errcode = '22023';
  end if;

  for room in select * from jsonb_array_elements(config -> 'rooms') loop
    insert into public.calculator_rooms (room_type, label_nl, label_en, description_nl, description_en, base_price, included_area, is_active)
    values (room ->> 'room_type', room ->> 'label_nl', coalesce(room ->> 'label_en', ''), coalesce(room ->> 'description_nl', ''), coalesce(room ->> 'description_en', ''),
            (room ->> 'base_price')::integer, (room ->> 'included_area')::numeric, coalesce((room ->> 'is_active')::boolean, true))
    on conflict (room_type) do update set
      label_nl = excluded.label_nl, label_en = excluded.label_en, description_nl = excluded.description_nl,
      description_en = excluded.description_en, base_price = excluded.base_price,
      included_area = excluded.included_area, is_active = excluded.is_active, updated_at = now();
    delete from public.calculator_tiers where room_type = room ->> 'room_type';
    for tier in select * from jsonb_array_elements(room -> 'tiers') loop
      insert into public.calculator_tiers (room_type, from_area, rate_per_m2)
      values (room ->> 'room_type', (tier ->> 'from_area')::numeric, (tier ->> 'rate_per_m2')::integer);
    end loop;
  end loop;

  delete from public.calculator_options
    where id not in (select value ->> 'id' from jsonb_array_elements(config -> 'options'));
  for item in select * from jsonb_array_elements(config -> 'options') loop
    insert into public.calculator_options (id, group_id, label_nl, label_en, price, included_nl, included_en, note_nl, note_en, rooms, conflicts_with, is_active, sort_order)
    values (item ->> 'id', item ->> 'group_id', item ->> 'label_nl', coalesce(item ->> 'label_en', ''), (item ->> 'price')::integer,
            coalesce(item ->> 'included_nl', ''), coalesce(item ->> 'included_en', ''), coalesce(item ->> 'note_nl', ''), coalesce(item ->> 'note_en', ''),
            array(select jsonb_array_elements_text(item -> 'rooms')), array(select jsonb_array_elements_text(coalesce(item -> 'conflicts_with', '[]'::jsonb))),
            coalesce((item ->> 'is_active')::boolean, true), coalesce((item ->> 'sort_order')::integer, 0))
    on conflict (id) do update set
      group_id = excluded.group_id, label_nl = excluded.label_nl, label_en = excluded.label_en, price = excluded.price,
      included_nl = excluded.included_nl, included_en = excluded.included_en, note_nl = excluded.note_nl, note_en = excluded.note_en,
      rooms = excluded.rooms, conflicts_with = excluded.conflicts_with, is_active = excluded.is_active,
      sort_order = excluded.sort_order, updated_at = now();
  end loop;

  select c into unknown_conflict
  from public.calculator_options o, unnest(o.conflicts_with) as c
  where c not in (select id from public.calculator_options)
  limit 1;
  if unknown_conflict is not null then
    raise exception 'Optie % bestaat niet meer maar wordt nog als combinatie genoemd.', unknown_conflict using errcode = '23503';
  end if;
end;
$$;

revoke all on function public.save_project(jsonb) from public, anon;
revoke all on function public.reorder_projects(uuid[]) from public, anon;
revoke all on function public.save_faqs(text, jsonb) from public, anon;
revoke all on function public.save_calculator(jsonb) from public, anon;
grant execute on function public.save_project(jsonb) to authenticated;
grant execute on function public.reorder_projects(uuid[]) to authenticated;
grant execute on function public.save_faqs(text, jsonb) to authenticated;
grant execute on function public.save_calculator(jsonb) to authenticated;

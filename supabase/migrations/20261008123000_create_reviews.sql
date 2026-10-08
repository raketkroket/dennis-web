create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  email text not null check (char_length(email) <= 254),
  city text not null check (char_length(city) between 2 and 100),
  project text not null check (project in ('Badkamer', 'Toilet', 'Renovatie', 'Aanbouw')),
  rating smallint not null check (rating between 1 and 5),
  text text not null check (char_length(text) between 20 and 3000),
  status text not null default 'pending' check (status in ('pending', 'approved', 'deleted')),
  action_token_hash text not null unique,
  created_at timestamptz not null default now(),
  approved_at timestamptz
);

alter table public.reviews enable row level security;

create policy "Published reviews are publicly readable"
  on public.reviews
  for select
  using (status = 'approved');

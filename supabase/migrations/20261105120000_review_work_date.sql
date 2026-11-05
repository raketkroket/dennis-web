-- Customers can say when the work was done when they write a review (form at
-- the bottom of the pages). The website shows that date instead of the day
-- the review was sent. Optional: older reviews have none.

alter table public.reviews add column if not exists work_date date;

alter table public.reviews drop constraint if exists reviews_work_date_check;
alter table public.reviews add constraint reviews_work_date_check check (work_date is null or work_date >= date '2010-01-01');

grant select (work_date) on public.reviews to anon, authenticated;

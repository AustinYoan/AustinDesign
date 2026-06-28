-- AustinDesign diagnostic submission backend setup
-- Run this in Supabase SQL Editor.

create table if not exists public.diagnostic_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  intent int,
  sub int,
  focus int[],
  focus_primary int,
  data int[],
  readiness int,
  image_paths text[],
  user_note text,
  contact_name text,
  contact_email text,
  contact_line text
);

alter table public.diagnostic_submissions enable row level security;

drop policy if exists "allow anon insert diagnostic submissions" on public.diagnostic_submissions;
create policy "allow anon insert diagnostic submissions"
on public.diagnostic_submissions
for insert
to anon
with check (true);

insert into storage.buckets (id, name, public)
values ('diagnostic-uploads', 'diagnostic-uploads', false)
on conflict (id) do nothing;

drop policy if exists "allow anon upload diagnostic images" on storage.objects;
create policy "allow anon upload diagnostic images"
on storage.objects
for insert
to anon
with check (bucket_id = 'diagnostic-uploads');

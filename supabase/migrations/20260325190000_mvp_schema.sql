create extension if not exists pgcrypto;

create table public.buckets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(trim(name)) > 0 and char_length(name) <= 80),
  created_at timestamptz not null default timezone('utc', now()),
  unique (user_id, name)
);

create table public.activities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(trim(name)) > 0 and char_length(name) <= 120),
  created_at timestamptz not null default timezone('utc', now()),
  unique (user_id, name)
);

create table public.activity_buckets (
  id uuid primary key default gen_random_uuid(),
  activity_id uuid not null references public.activities(id) on delete cascade,
  bucket_id uuid not null references public.buckets(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  unique (activity_id, bucket_id)
);

create table public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  activity_id uuid not null references public.activities(id) on delete cascade,
  date date not null,
  completed boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  unique (user_id, activity_id, date)
);

create index buckets_user_created_idx on public.buckets(user_id, created_at desc);
create index activities_user_created_idx on public.activities(user_id, created_at desc);
create index activity_buckets_activity_idx on public.activity_buckets(activity_id);
create index activity_buckets_bucket_idx on public.activity_buckets(bucket_id);
create index activity_logs_user_date_idx on public.activity_logs(user_id, date desc);
create index activity_logs_activity_date_idx on public.activity_logs(activity_id, date desc);
create index activity_logs_completed_idx on public.activity_logs(user_id, date desc)
where completed = true;

create or replace function public.seed_default_buckets_for_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.buckets (user_id, name)
  values
    (new.id, 'Body'),
    (new.id, 'Life'),
    (new.id, 'People')
  on conflict (user_id, name) do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created_seed_default_buckets
after insert on auth.users
for each row execute function public.seed_default_buckets_for_new_user();

create or replace function public.ensure_activity_bucket_same_owner()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  activity_owner uuid;
  bucket_owner uuid;
begin
  select user_id into activity_owner
  from public.activities
  where id = new.activity_id;

  select user_id into bucket_owner
  from public.buckets
  where id = new.bucket_id;

  if activity_owner is null or bucket_owner is null then
    raise exception 'activity or bucket not found';
  end if;

  if activity_owner <> bucket_owner then
    raise exception 'activity and bucket must belong to same user';
  end if;

  return new;
end;
$$;

create trigger on_activity_bucket_write_enforce_owner
before insert or update on public.activity_buckets
for each row execute function public.ensure_activity_bucket_same_owner();

alter table public.buckets enable row level security;
alter table public.activities enable row level security;
alter table public.activity_buckets enable row level security;
alter table public.activity_logs enable row level security;

create policy "Buckets are owned by auth user"
on public.buckets
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Activities are owned by auth user"
on public.activities
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Activity bucket links are owned through activity and bucket"
on public.activity_buckets
for all
using (
  exists (
    select 1
    from public.activities a
    join public.buckets b on b.id = activity_buckets.bucket_id
    where a.id = activity_buckets.activity_id
      and a.user_id = auth.uid()
      and b.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.activities a
    join public.buckets b on b.id = activity_buckets.bucket_id
    where a.id = activity_buckets.activity_id
      and a.user_id = auth.uid()
      and b.user_id = auth.uid()
  )
);

create policy "Activity logs are owned by auth user"
on public.activity_logs
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

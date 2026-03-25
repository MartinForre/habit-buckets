create or replace function public.ensure_default_buckets_for_current_user()
returns void
language plpgsql
security invoker
set search_path = public
as $$
declare
  current_user_id uuid;
begin
  current_user_id := auth.uid();

  if current_user_id is null then
    raise exception 'not authenticated';
  end if;

  insert into public.buckets (user_id, name)
  values
    (current_user_id, 'Body'),
    (current_user_id, 'Life'),
    (current_user_id, 'People')
  on conflict (user_id, name) do nothing;
end;
$$;

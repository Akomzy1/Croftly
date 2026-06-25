-- Croftly — auth provisioning (Prompt 3)
-- On a new auth user, create the matching household or producer row from the
-- role/name/area captured at sign-up (stored in raw_user_meta_data). This keeps
-- row creation server-side and works with email confirmation.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_role text := coalesce(new.raw_user_meta_data ->> 'role', 'household');
  v_name text := coalesce(nullif(new.raw_user_meta_data ->> 'name', ''), split_part(new.email, '@', 1));
  v_area uuid := nullif(new.raw_user_meta_data ->> 'area_id', '')::uuid;
begin
  if v_role = 'farmer' then
    insert into public.producers (user_id, name, area_id)
    values (new.id, v_name, v_area);
  else
    insert into public.households (user_id, name, area_id)
    values (new.id, v_name, v_area);
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

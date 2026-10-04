create type public.app_role as enum ('admin','client');
create type public.project_status as enum ('discovery','design','development','testing','launched','on_hold');

create table public.profiles (
  id uuid primary key,
  full_name text,
  company text,
  created_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  role app_role not null,
  unique(user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.user_roles where user_id=_user_id and role=_role) $$;

create policy "own profile read" on public.profiles for select to authenticated using (id = auth.uid() or public.has_role(auth.uid(),'admin'));
create policy "own profile insert" on public.profiles for insert to authenticated with check (id = auth.uid());
create policy "own profile update" on public.profiles for update to authenticated using (id = auth.uid());
create policy "own roles read" on public.user_roles for select to authenticated using (user_id = auth.uid() or public.has_role(auth.uid(),'admin'));

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null,
  name text not null,
  description text,
  service text not null default 'Web App',
  status project_status not null default 'discovery',
  progress int not null default 0,
  budget numeric,
  due_date date,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.projects to authenticated;
grant all on public.projects to service_role;
alter table public.projects enable row level security;
create policy "client reads own projects" on public.projects for select to authenticated using (client_id = auth.uid() or public.has_role(auth.uid(),'admin'));
create policy "client creates own request" on public.projects for insert to authenticated with check (client_id = auth.uid() and status = 'discovery' and progress = 0);
create policy "admin updates" on public.projects for update to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admin deletes" on public.projects for delete to authenticated using (public.has_role(auth.uid(),'admin'));

create table public.project_updates (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  author_id uuid not null,
  message text not null,
  created_at timestamptz not null default now()
);
grant select, insert on public.project_updates to authenticated;
grant all on public.project_updates to service_role;
alter table public.project_updates enable row level security;
create policy "read updates of visible projects" on public.project_updates for select to authenticated
  using (exists (select 1 from public.projects p where p.id = project_id and (p.client_id = auth.uid() or public.has_role(auth.uid(),'admin'))));
create policy "post updates on visible projects" on public.project_updates for insert to authenticated
  with check (author_id = auth.uid() and exists (select 1 from public.projects p where p.id = project_id and (p.client_id = auth.uid() or public.has_role(auth.uid(),'admin'))));

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles(id, full_name) values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'));
  insert into public.user_roles(user_id, role) values (new.id, 'client');
  if (select count(*) from public.user_roles where role='admin') = 0 then
    insert into public.user_roles(user_id, role) values (new.id, 'admin');
  end if;
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();
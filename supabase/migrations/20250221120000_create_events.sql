-- Events table: stores each user's events (linked to auth.users)
create table if not exists public.events (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  meal_type text not null check (meal_type in ('iftar', 'suhoor', 'both')),
  dish_party boolean not null default false,
  dates jsonb not null default '[]'::jsonb,
  message text,
  has_plan boolean not null default false,
  created_at timestamptz not null default now()
);

-- Index for listing a user's events
create index if not exists events_user_id_idx on public.events(user_id);

-- RLS: users can only see and manage their own events
alter table public.events enable row level security;

create policy "Users can read own events"
  on public.events for select
  using (auth.uid() = user_id);

create policy "Users can insert own events"
  on public.events for insert
  with check (auth.uid() = user_id);

create policy "Users can update own events"
  on public.events for update
  using (auth.uid() = user_id);

create policy "Users can delete own events"
  on public.events for delete
  using (auth.uid() = user_id);

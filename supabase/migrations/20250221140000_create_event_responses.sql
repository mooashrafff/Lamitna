-- Guest responses from the public invite form (name, date, dish)
create table if not exists public.event_responses (
  id uuid primary key default gen_random_uuid(),
  event_id text not null references public.events(id) on delete cascade,
  guest_name text not null,
  chosen_date text not null,
  dish text,
  created_at timestamptz not null default now()
);

create index if not exists event_responses_event_id_idx on public.event_responses(event_id);

alter table public.event_responses enable row level security;

-- Anyone can submit a response (invite form is public)
create policy "Anyone can insert response"
  on public.event_responses for insert
  to anon, authenticated
  with check (true);

-- Event owner can read responses for their events
create policy "Event owner can read responses"
  on public.event_responses for select
  to authenticated
  using (
    exists (
      select 1 from public.events e
      where e.id = event_responses.event_id and e.user_id = auth.uid()
    )
  );

-- Allow anyone with the invite link to read event details (id, name, meal_type, dish_party, dates)
-- so the public /invite/:id page can show the form. No other columns needed for invite.
create policy "Allow public read for invite"
  on public.events for select
  to anon
  using (true);

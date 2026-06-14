-- player_profiles: cloud copy of saved "players you've played with"
-- owner_id identifies the *account* this saved list belongs to — it is
-- NOT the player's own account. name/color_* describe the player and
-- never reference auth.users.
create table if not exists public.player_profiles (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  color_name text not null,
  color_value text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (owner_id, name)
);

alter table public.player_profiles enable row level security;

create policy "select own profiles" on public.player_profiles
  for select using (auth.uid() = owner_id);
create policy "insert own profiles" on public.player_profiles
  for insert with check (auth.uid() = owner_id);
create policy "update own profiles" on public.player_profiles
  for update using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "delete own profiles" on public.player_profiles
  for delete using (auth.uid() = owner_id);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger player_profiles_set_updated_at
  before update on public.player_profiles
  for each row execute function public.set_updated_at();


-- games: cloud copy of completed Game history records
-- owner_id identifies the account this game belongs to (the creator).
-- scores is the full Player[] snapshot — none of those players (including
-- the owner) need an auth.users row.
create table if not exists public.games (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  local_uuid uuid not null,        -- Game.uuid, for de-dup on upsert
  name text not null,
  start_score integer not null,
  ending_score integer,
  lowest_possible_score integer,
  win_condition text not null,     -- 'Most' | 'Least'
  scores jsonb not null,           -- GameScore[] snapshot
  created_at timestamptz not null,
  ended_at timestamptz,
  inserted_at timestamptz not null default now(),
  unique (owner_id, local_uuid)
);

alter table public.games enable row level security;

create policy "select own games" on public.games
  for select using (auth.uid() = owner_id);
create policy "insert own games" on public.games
  for insert with check (auth.uid() = owner_id);
create policy "update own games" on public.games
  for update using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "delete own games" on public.games
  for delete using (auth.uid() = owner_id);

create index if not exists games_owner_id_ended_at_idx
  on public.games (owner_id, ended_at desc);

-- Adds best-of-N "winning rounds" support to games: winning_rounds is the
-- number of round wins needed to end the match (1 = today's single-round
-- behavior), rounds is a snapshot of every completed round's scores.
alter table public.games
  add column if not exists winning_rounds integer not null default 1,
  add column if not exists rounds jsonb not null default '[]'::jsonb;

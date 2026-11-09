import type { Game, GameRound, GameScore, PlayerProfile } from "~/types/global";
import { WinCondition } from "~/types/global";
import type { Json } from "~/types/database.types";
import { useQueryClient } from "@tanstack/vue-query";
import { userGamesHistoryQueryKey, type UserGameHistoryRow } from "~/composables/useUserGamesHistoryQuery";

let isFlushing = false;

export const useSupabaseSync = () => {
  const supabase = useSupabaseClient();
  const user = useSupabaseUser();
  const roomStore = useRoomStore();
  const playerProfilesStore = usePlayerProfilesStore();
  const syncQueue = useSyncQueueStore();
  const queryClient = useQueryClient();

  const isSyncing = ref(false);

  const syncGame = async (game: Game): Promise<UserGameHistoryRow | null> => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return null;

    const { data, error } = await supabase.from('games').upsert({
      owner_id: session.user.id,
      local_uuid: game.uuid,
      name: game.name,
      start_score: game.startScore ?? 0,
      ending_score: game.endingScore ?? null,
      lowest_possible_score: game.lowestPossibleScore ?? null,
      win_condition: game.winCondition ?? WinCondition.MostPoints,
      winning_rounds: game.winningRounds ?? 1,
      scores: game.scores as unknown as Json,
      rounds: (game.rounds ?? []) as unknown as Json,
      created_at: new Date(game.createdAt).toISOString(),
      ended_at: game.endedAt ? new Date(game.endedAt).toISOString() : null,
    }, { onConflict: 'owner_id,local_uuid' }).select().single();

    if (error) throw error;

    return data;
  };

  const syncProfile = async (profile: PlayerProfile) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { error } = await supabase.from('player_profiles').upsert({
      owner_id: session.user.id,
      name: profile.name,
      color_name: profile.color.name,
      color_value: profile.color.value,
    }, { onConflict: 'owner_id,name' });

    if (error) throw error;
  };

  const storeSyncedRow = (ownerId: string, row: UserGameHistoryRow) => {
    const rows = [
      ...(queryClient.getQueryData<UserGameHistoryRow[]>(userGamesHistoryQueryKey(ownerId)) ?? syncQueue.historyCache[ownerId] ?? [])
        .filter((existing) => existing.local_uuid !== row.local_uuid),
      row,
    ];

    queryClient.setQueryData(userGamesHistoryQueryKey(ownerId), rows);
    syncQueue.setHistoryCache(ownerId, rows);
  };

  // Each entry is retried independently so one rejected entry cannot block
  // the rest of the queue. Failed entries stay queued for the next attempt.
  const flushPending = async () => {
    if (isFlushing || !navigator.onLine) return;
    if (syncQueue.pendingGames.length === 0 && syncQueue.pendingProfiles.length === 0) return;

    isFlushing = true;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const ownerId = session.user.id;

      for (const { profile } of syncQueue.pendingProfiles.filter((entry) => entry.ownerId === ownerId)) {
        try {
          await syncProfile(profile);
          syncQueue.removePendingProfile(ownerId, profile.name);
        } catch {
          // Kept in the queue.
        }
      }

      for (const { game } of syncQueue.pendingGames.filter((entry) => entry.ownerId === ownerId)) {
        try {
          const row = await syncGame(game);
          if (!row) continue;

          storeSyncedRow(ownerId, row);
          syncQueue.removePendingGame(ownerId, game.uuid);
        } catch {
          // Kept in the queue.
        }
      }
    } catch {
      // The session could not be read: the next trigger retries.
    } finally {
      isFlushing = false;
    }
  };

  const pullRemote = async () => {
    if (!user.value) return;

    isSyncing.value = true;

    try {
      const { data: profiles, error: profilesError } = await supabase.from('player_profiles').select('*');
      if (profilesError) throw profilesError;

      (profiles ?? []).forEach((row) => {
        const color = { name: row.color_name, value: row.color_value };
        const existing = playerProfilesStore.profiles.find((profile) => profile.name === row.name);

        if (existing) {
          playerProfilesStore.updateProfile(existing.id, row.name, color);
        } else {
          playerProfilesStore.addProfile(row.name, color);
        }
      });

      const { data: games, error: gamesError } = await supabase.from('games').select('*');
      if (gamesError) throw gamesError;

      (games ?? []).forEach((row) => {
        if (roomStore.games.some((game) => game.uuid === row.local_uuid)) return;

        roomStore.games.push({
          uuid: row.local_uuid,
          name: row.name,
          startScore: row.start_score,
          endingScore: row.ending_score,
          lowestPossibleScore: row.lowest_possible_score,
          winCondition: row.win_condition as WinCondition,
          winningRounds: row.winning_rounds ?? 1,
          scores: row.scores as unknown as GameScore[],
          rounds: (row.rounds ?? []) as unknown as GameRound[],
          createdAt: new Date(row.created_at),
          endedAt: row.ended_at ? new Date(row.ended_at) : null,
        });
      });
    } finally {
      isSyncing.value = false;
    }
  };

  const importLocalToRemote = async () => {
    if (!user.value) return;

    isSyncing.value = true;

    try {
      for (const profile of playerProfilesStore.profiles) {
        await syncProfile(profile);
      }

      for (const game of roomStore.games) {
        await syncGame(game);
      }
    } finally {
      isSyncing.value = false;
    }
  };

  return {
    isSyncing,
    syncGame,
    syncProfile,
    flushPending,
    pullRemote,
    importLocalToRemote,
  };
};

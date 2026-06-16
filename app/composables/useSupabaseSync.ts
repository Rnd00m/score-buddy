import type { Game, GameScore, PlayerProfile } from "~/types/global";
import { WinCondition } from "~/types/global";

export const useSupabaseSync = () => {
  const supabase = useSupabaseClient();
  const user = useSupabaseUser();
  const roomStore = useRoomStore();
  const playerProfilesStore = usePlayerProfilesStore();

  const isSyncing = ref(false);

  const syncGame = async (game: Game) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { error } = await supabase.from('games').upsert({
      owner_id: session.user.id,
      local_uuid: game.uuid,
      name: game.name,
      start_score: game.startScore ?? 0,
      ending_score: game.endingScore ?? null,
      lowest_possible_score: game.lowestPossibleScore ?? null,
      win_condition: game.winCondition ?? WinCondition.MostPoints,
      scores: game.scores,
      created_at: game.createdAt,
      ended_at: game.endedAt,
    }, { onConflict: 'owner_id,local_uuid' });

    if (error) throw error;
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
          scores: row.scores as GameScore[],
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
    pullRemote,
    importLocalToRemote,
  };
};

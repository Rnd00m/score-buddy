import type { Tables } from "~/types/database.types";

export type UserGameHistoryRow = Tables<'games'>;

export const userGamesHistoryQueryKey = (userId: string | undefined) => ['user-games-history', userId] as const;

export const useUserGamesHistoryQuery = () => {
  const supabase = useSupabaseClient();
  const user = useAuthUser();
  const syncQueue = useSyncQueueStore();

  const fetchUserGamesHistory = async (): Promise<UserGameHistoryRow[]> => {
    const { data, error } = await supabase.from('games').select('*');
    if (error) throw error;

    const rows = data ?? [];
    if (user.value) syncQueue.setHistoryCache(user.value.id, rows);

    return rows;
  };

  return { fetchUserGamesHistory };
};

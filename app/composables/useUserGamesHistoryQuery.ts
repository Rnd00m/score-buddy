import type { Tables } from "~/types/database.types";

export type UserGameHistoryRow = Tables<'games'>;

export const userGamesHistoryQueryKey = (userId: string | undefined) => ['user-games-history', userId] as const;

export const useUserGamesHistoryQuery = () => {
  const supabase = useSupabaseClient();

  const fetchUserGamesHistory = async (): Promise<UserGameHistoryRow[]> => {
    const { data, error } = await supabase.from('games').select('*');
    if (error) throw error;

    return data ?? [];
  };

  return { fetchUserGamesHistory };
};

import type { LastKnownUser } from "~/stores/SyncQueueStore";

// Without network Supabase cannot confirm the session, so useSupabaseUser()
// stays empty. Falls back to the last confirmed account: the user stays
// logged in offline until an explicit sign-out.
export const useAuthUser = () => {
  const liveUser = useSupabaseUser();
  const syncQueue = useSyncQueueStore();

  return computed<LastKnownUser | null>(() => {
    const live = liveUser.value as { id?: string; sub?: string; email?: string } | null;
    const id = live?.id ?? live?.sub;

    return id ? { id, email: live?.email } : syncQueue.lastKnownUser;
  });
};

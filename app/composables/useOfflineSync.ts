const RETRY_INTERVAL_MS = 30_000;

export const useOfflineSync = () => {
  const supabase = useSupabaseClient();
  const syncQueue = useSyncQueueStore();
  const { flushPending } = useSupabaseSync();

  let retryTimer: number | undefined;

  const flushWhenVisible = () => {
    if (document.visibilityState === 'visible') flushPending();
  };

  const startRetrying = () => {
    window.addEventListener('online', flushPending);
    document.addEventListener('visibilitychange', flushWhenVisible);
    // Connectivity events can be missed, and a request can fail while the
    // device still reports being online.
    retryTimer = window.setInterval(flushPending, RETRY_INTERVAL_MS);
  };

  const stopRetrying = () => {
    window.removeEventListener('online', flushPending);
    document.removeEventListener('visibilitychange', flushWhenVisible);
    window.clearInterval(retryTimer);
  };

  const init = () => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        syncQueue.forgetUser();
        return;
      }

      if (session?.user) {
        syncQueue.rememberUser({ id: session.user.id, email: session.user.email });
        // Deferred: calling Supabase inside this callback can deadlock its auth lock.
        setTimeout(flushPending, 0);
      }
    });

    // Retries only exist while something is waiting to be saved.
    watch(() => syncQueue.hasPendingForCurrentUser, (hasPending) => {
      if (hasPending) {
        startRetrying();
        flushPending();
      } else {
        stopRetrying();
      }
    }, { immediate: true });
  };

  return { init };
};

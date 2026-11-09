import { defineNuxtPlugin } from '#app';
// @ts-ignore: alias registered by this module at build time
import supabaseClientPlugin from '#supabase-client-plugin';

const ONLINE_STARTUP_BUDGET_MS = 2000;

export default defineNuxtPlugin({
  name: 'supabase',
  enforce: 'pre',
  async setup(nuxtApp) {
    // Auth keeps initializing in the background: useSupabaseUser() and
    // onAuthStateChange pick up the session whenever it resolves.
    const initialization = Promise.resolve(nuxtApp.runWithContext(() => supabaseClientPlugin(nuxtApp)))
      .catch((error: unknown) => console.warn('[supabase] initialization failed', error));
    const budget = navigator.onLine ? ONLINE_STARTUP_BUDGET_MS : 0;

    await Promise.race([
      initialization,
      new Promise((resolve) => setTimeout(resolve, budget)),
    ]);
  },
});

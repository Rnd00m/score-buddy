import { createResolver, defineNuxtModule } from 'nuxt/kit';

// @nuxtjs/supabase's client plugin awaits an auth check before the app can
// mount. With an expired access token and no network, that check keeps
// retrying the token refresh for a long time and leaves a blank screen. This
// module swaps the plugin for a wrapper that bounds how long startup waits.
export default defineNuxtModule({
  meta: { name: 'non-blocking-supabase' },
  setup(_options, nuxt) {
    const { resolve } = createResolver(import.meta.url);

    nuxt.hook('app:resolve', (app) => {
      const clientPlugin = app.plugins.find(({ src }) => src.includes('@nuxtjs/supabase') && src.includes('supabase.client'));

      if (!clientPlugin) {
        throw new Error('[non-blocking-supabase] @nuxtjs/supabase client plugin not found');
      }

      nuxt.options.alias['#supabase-client-plugin'] = clientPlugin.src;
      clientPlugin.src = resolve('./runtime/plugin.client.ts');
    });
  },
});

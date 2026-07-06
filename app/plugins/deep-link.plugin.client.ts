import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

export default defineNuxtPlugin(async () => {
  if (!Capacitor.isNativePlatform()) return;

  const supabase = useSupabaseClient();
  const router = useRouter();

  const handleUrl = async (url: string) => {
    if (!url.includes('account/callback')) return;
    const code = new URL(url).searchParams.get('code');
    if (code) {
      // Best-effort: if Supabase is unreachable (no connection, paused project),
      // the app must still start and work offline rather than getting stuck here.
      try {
        await supabase.auth.exchangeCodeForSession(code);
      } catch {
        return;
      }
    }
    await router.push('/account');
  };

  void App.addListener('appUrlOpen', ({ url }) => handleUrl(url));

  const launchData = await App.getLaunchUrl();
  if (launchData?.url) {
    await handleUrl(launchData.url);
  }
});
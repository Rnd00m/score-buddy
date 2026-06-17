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
      await supabase.auth.exchangeCodeForSession(code);
    }
    router.push('/account');
  };

  App.addListener('appUrlOpen', ({ url }) => handleUrl(url));

  const launchData = await App.getLaunchUrl();
  if (launchData?.url) {
    await handleUrl(launchData.url);
  }
});
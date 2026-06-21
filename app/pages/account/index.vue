<template>
  <div>
    <Toast position="top-center" class="max-w-[calc(100%-2rem)]"/>
    <ConfirmDialog group="logout" class="max-w-96 w-[calc(100%-6rem)]">
      <template #container="{ message, acceptCallback, rejectCallback }">
        <div class="flex flex-col items-center p-8 bg-surface-0 dark:bg-surface-900 rounded">
          <div class="rounded-full bg-red-500 text-primary-contrast inline-flex justify-center items-center h-24 w-24 -mt-20">
            <i class="pi pi-sign-out text-5xl"></i>
          </div>
          <span class="font-bold text-2xl block mb-2 mt-6">{{ message.header }}</span>
          <p class="mb-0">{{ message.message }}</p>
          <div class="flex items-center gap-2 mt-6">
            <Button severity="contrast" :label="t('common.confirm')" @click="acceptCallback"></Button>
            <Button severity="secondary" :label="t('common.cancel')" outlined @click="rejectCallback"></Button>
          </div>
        </div>
      </template>
    </ConfirmDialog>

    <h1 class="mb-6 text-3xl">{{ t('account.title') }}</h1>

    <div v-if="user" class="flex flex-col gap-4">
      <p>{{ t('account.loggedInAs') }} <strong>{{ user.email }}</strong></p>

      <Button :label="t('account.syncNow')" icon="pi pi-sync" :loading="isSyncing" @click="handleSync"/>
      <Button :label="t('account.logOut')" severity="danger" outlined icon="pi pi-sign-out" @click="handleLogout"/>
    </div>

    <div v-else class="flex flex-col gap-4">
      <p>{{ t('account.createAccountPrompt') }}</p>

      <NuxtLink to="/account/login">
        <Button :label="t('account.logIn')" icon="pi pi-sign-in" fluid/>
      </NuxtLink>
      <NuxtLink to="/account/signup">
        <Button :label="t('account.signUp')" icon="pi pi-user-plus" outlined fluid/>
      </NuxtLink>
    </div>

    <h2 class="mt-8 mb-4 text-xl">{{ t('account.preferences') }}</h2>

    <div class="flex flex-col gap-4">
      <div class="flex items-center justify-between">
        <label for="language-select">{{ t('account.language') }}</label>
        <Select id="language-select" v-model="selectedLocale" :options="availableLocales" optionLabel="name" optionValue="code" class="w-40"/>
      </div>

      <div class="flex items-center justify-between">
        <label for="dark-mode-switch">{{ t('account.darkMode') }}</label>
        <ToggleSwitch v-model="isDarkMode" inputId="dark-mode-switch"/>
      </div>

      <div v-if="isWakeLockSupported" class="flex items-center justify-between">
        <label for="wake-lock-switch">{{ t('account.keepScreenOn') }}</label>
        <ToggleSwitch v-model="isWakeLockEnabled" inputId="wake-lock-switch"/>
      </div>

      <div class="flex items-center justify-between">
        <span class="inline-flex items-center gap-2">
          <label for="duel-mode-switch">{{ t('account.duelMode') }}</label>
          <i
            class="pi pi-info-circle text-surface-500 cursor-help"
            @click="toggleDuelModePopover"
          />
          <Popover ref="duelModePopover">
            <p class="max-w-60">{{ isWakeLockSupported ? t('account.duelModeTooltip') : t('account.duelModeTooltipNoWakeLock') }}</p>
          </Popover>
        </span>
        <ToggleSwitch v-model="isDuelModeEnabled" inputId="duel-mode-switch"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {LocaleObject} from '@nuxtjs/i18n';
const {t, locale, locales, setLocale} = useI18n() as ReturnType<typeof useI18n> & {
  locales: ComputedRef<LocaleObject[]>;
  setLocale: (locale: string) => Promise<void>;
};
const duelModePopover = ref();
const toggleDuelModePopover = (event: MouseEvent) => duelModePopover.value?.toggle(event);
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const toast = useToast();
const confirm = useConfirm();
const {isSyncing, pullRemote, importLocalToRemote} = useSupabaseSync();

const availableLocales = computed(() => locales.value);
const selectedLocale = computed({
  get: () => locale.value,
  set: (value) => setLocale(value as 'en' | 'fr'),
});

const {colorScheme, setColorScheme} = useColorScheme();
const isDarkMode = computed({
  get: () => colorScheme.value === 'dark',
  set: (value: boolean) => setColorScheme(value ? 'dark' : 'light'),
});

const {isSupported: isWakeLockSupported, isEnabled: isWakeLockEnabledState, setEnabled: setWakeLockEnabled} = useScreenWakeLock();
const isWakeLockEnabled = computed({
  get: () => isWakeLockEnabledState.value,
  set: (value: boolean) => setWakeLockEnabled(value),
});

const {isEnabled: isDuelModeEnabledState, setEnabled: setDuelModeEnabled} = useDuelMode();
const isDuelModeEnabled = computed({
  get: () => isDuelModeEnabledState.value,
  set: (value: boolean) => setDuelModeEnabled(value),
});

const handleSync = async () => {
  try {
    await pullRemote();
    await importLocalToRemote();
    toast.add({severity: 'success', summary: t('account.syncedTitle'), detail: t('account.syncedMessage'), life: 3000});
  } catch {
    toast.add({severity: 'error', summary: t('account.syncErrorTitle'), detail: t('account.syncErrorMessage'), life: 4000});
  }
};

const handleLogout = () => {
  confirm.require({
    group: 'logout',
    header: t('account.logoutConfirmTitle'),
    message: t('account.logoutConfirmMessage'),
    accept: () => {
      supabase.auth.signOut();
    },
  });
};
</script>

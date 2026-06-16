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
            <Button severity="contrast" label="Confirm" @click="acceptCallback"></Button>
            <Button severity="secondary" label="Cancel" outlined @click="rejectCallback"></Button>
          </div>
        </div>
      </template>
    </ConfirmDialog>

    <h1 class="mb-6 text-3xl">Account</h1>

    <div v-if="user" class="flex flex-col gap-4">
      <p>Logged in as <strong>{{ user.email }}</strong></p>

      <Button label="Sync now" icon="pi pi-sync" :loading="isSyncing" @click="handleSync"/>
      <Button label="Log out" severity="danger" outlined icon="pi pi-sign-out" @click="handleLogout"/>
    </div>

    <div v-else class="flex flex-col gap-4">
      <p>Create an account to save your game history and player profiles to the cloud.</p>

      <NuxtLink to="/account/login">
        <Button label="Log in" icon="pi pi-sign-in" fluid/>
      </NuxtLink>
      <NuxtLink to="/account/signup">
        <Button label="Sign up" icon="pi pi-user-plus" outlined fluid/>
      </NuxtLink>
    </div>

    <h2 class="mt-8 mb-4 text-xl">Preferences</h2>

    <div class="flex flex-col gap-4">
      <div class="flex items-center justify-between">
        <label for="dark-mode-switch">Dark mode</label>
        <ToggleSwitch v-model="isDarkMode" inputId="dark-mode-switch"/>
      </div>

      <div v-if="isWakeLockSupported" class="flex items-center justify-between">
        <label for="wake-lock-switch">Keep screen on</label>
        <ToggleSwitch v-model="isWakeLockEnabled" inputId="wake-lock-switch"/>
      </div>

      <div class="flex items-center justify-between">
        <span class="inline-flex items-center gap-2">
          <label for="duel-mode-switch">Duel mode</label>
          <i
            class="pi pi-info-circle text-surface-500 cursor-help"
            v-tooltip.top="'For 2-player games, displays the score cards face to face at the top and bottom of the screen. We recommend also enabling Keep screen on when using this mode.'"
          />
        </span>
        <ToggleSwitch v-model="isDuelModeEnabled" inputId="duel-mode-switch"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const toast = useToast();
const confirm = useConfirm();
const {isSyncing, pullRemote, importLocalToRemote} = useSupabaseSync();

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
    toast.add({severity: 'success', summary: 'Synced', detail: 'Your data is up to date.', life: 3000});
  } catch {
    toast.add({severity: 'error', summary: 'Sync error', detail: 'Could not sync your data.', life: 4000});
  }
};

const handleLogout = () => {
  confirm.require({
    group: 'logout',
    header: 'Log out?',
    message: 'You will need to log in again to access your saved games and players.',
    accept: () => {
      supabase.auth.signOut();
    },
  });
};
</script>

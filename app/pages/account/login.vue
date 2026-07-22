<template>
  <div>
    <Toast position="bottom-center" class="max-w-[calc(100%-2rem)]"/>
    <ConfirmDialog group="import" class="max-w-96 w-[calc(100%-6rem)]" dismissableMask>
      <template #container="{ message, acceptCallback, rejectCallback }">
        <div class="flex flex-col items-center p-8 bg-surface-0 dark:bg-surface-900 rounded">
          <div class="rounded-full bg-primary text-primary-contrast inline-flex justify-center items-center h-24 w-24 -mt-20">
            <CloudUpload :size="48"/>
          </div>
          <span class="font-bold text-2xl block mb-2 mt-6">{{ message.header }}</span>
          <p class="mb-0">{{ message.message }}</p>
          <div class="flex items-center gap-2 mt-6">
            <Button severity="contrast" :label="t('login.import')" @click="acceptCallback"></Button>
            <Button severity="secondary" :label="t('login.notNow')" outlined @click="rejectCallback"></Button>
          </div>
        </div>
      </template>
    </ConfirmDialog>

    <h1 class="mb-6 flex items-center gap-4">
      <NuxtLink to="/account">
        <Button severity="secondary">
          <template #icon><ArrowLeft :size="18"/></template>
        </Button>
      </NuxtLink>
      <span class="text-3xl">{{ t('login.title') }}</span>
    </h1>

    <Form v-slot="$form" :initialValues="credentials" :resolver :validateOnValueUpdate="false" :validateOnBlur="false" @submit="onFormSubmit" class="flex flex-col gap-4 w-full">
      <div class="flex flex-col gap-1">
        <label for="email">{{ t('login.email') }}</label>
        <InputText id="email" name="email" type="email" fluid/>
        <Message v-if="$form.email?.invalid" severity="error" size="small" variant="simple">{{
            $form.email.error?.message
          }}
        </Message>
      </div>

      <div class="flex flex-col gap-1">
        <label for="password">{{ t('login.password') }}</label>
        <Password id="password" name="password" :feedback="false" toggleMask fluid/>
        <Message v-if="$form.password?.invalid" severity="error" size="small" variant="simple">{{
            $form.password.error?.message
          }}
        </Message>
      </div>

      <BaseTurnstile v-if="turnstileSiteKey" ref="turnstileRef" :site-key="turnstileSiteKey" @verified="token => captchaToken = token" @expired="captchaToken = ''"/>

      <Button type="submit" severity="primary" :label="t('login.submit')" :loading="isLoading" :disabled="!!turnstileSiteKey && !captchaToken"/>
    </Form>

    <p class="mt-4 text-center">
      {{ t('login.noAccountYet') }} <NuxtLink to="/account/signup" class="text-primary">{{ t('login.signUp') }}</NuxtLink>
    </p>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import CloudUpload from '@primeicons/vue/cloud-upload';
import ArrowLeft from '@primeicons/vue/arrow-left';
import BaseTurnstile from '@/components/base/BaseTurnstile.vue';

const {t} = useI18n();
const supabase = useSupabaseClient();
const router = useRouter();
const toast = useToast();
const confirm = useConfirm();
const roomStore = useRoomStore();
const playerProfilesStore = usePlayerProfilesStore();
const {pullRemote, importLocalToRemote} = useSupabaseSync();
const {public: {turnstileSiteKey}} = useRuntimeConfig();

const isLoading = ref(false);
const captchaToken = ref('');
const turnstileRef = ref<InstanceType<typeof BaseTurnstile>>();

const credentials = ref({
  email: '',
  password: ''
});

const resolver = ({values}) => {
  const errors = {};

  if (!values.email?.trim()) {
    errors.email = [{message: t('login.emailRequired')}];
  }

  if (!values.password) {
    errors.password = [{message: t('login.passwordRequired')}];
  }

  return {
    errors
  };
};

const onFormSubmit = async ({valid, states}) => {
  if (!valid) return;

  isLoading.value = true;

  const {error} = await supabase.auth.signInWithPassword({
    email: states.email.value.trim(),
    password: states.password.value,
    options: {captchaToken: captchaToken.value || undefined}
  });

  if (error) {
    isLoading.value = false;
    turnstileRef.value?.reset();
    captchaToken.value = '';
    toast.add({severity: 'error', summary: t('common.error'), detail: error.message, life: 4000});
    return;
  }

  const hasLocalData = playerProfilesStore.profiles.length > 0 || roomStore.games.length > 0;

  try {
    await pullRemote();
  } catch {
    toast.add({severity: 'error', summary: t('login.syncErrorTitle'), detail: t('login.syncErrorMessage'), life: 4000});
  }

  isLoading.value = false;

  if (!hasLocalData) {
    router.push('/account');
    return;
  }

  confirm.require({
    group: 'import',
    header: t('login.importTitle'),
    message: t('login.importMessage'),
    accept: () => {
      importLocalToRemote().catch(() => {
        toast.add({severity: 'error', summary: t('login.syncErrorTitle'), detail: t('login.importErrorMessage'), life: 4000});
      });
      router.push('/account');
    },
    reject: () => {
      router.push('/account');
    }
  });
};
</script>

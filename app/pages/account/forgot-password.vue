<template>
  <div>
    <Toast position="bottom-center" class="max-w-[calc(100%-2rem)]"/>

    <h1 class="mb-6 flex items-center gap-4">
      <NuxtLink to="/account/login">
        <Button severity="secondary">
          <template #icon><ArrowLeft :size="18"/></template>
        </Button>
      </NuxtLink>
      <span class="text-3xl">{{ t('forgotPassword.title') }}</span>
    </h1>

    <p class="mb-6">{{ t('forgotPassword.instructions') }}</p>

    <Form v-slot="$form" :initialValues="credentials" :resolver :validateOnValueUpdate="false" :validateOnBlur="false" @submit="onFormSubmit" class="flex flex-col gap-4 w-full">
      <div class="flex flex-col gap-1">
        <label for="email">{{ t('login.email') }}</label>
        <InputText id="email" name="email" type="email" fluid/>
        <Message v-if="$form.email?.invalid" severity="error" size="small" variant="simple">{{
            $form.email.error?.message
          }}
        </Message>
      </div>

      <BaseTurnstile v-if="turnstileSiteKey" ref="turnstileRef" :site-key="turnstileSiteKey" @verified="token => captchaToken = token" @expired="captchaToken = ''"/>

      <Button type="submit" severity="primary" :label="t('forgotPassword.submit')" :loading="isLoading" :disabled="!!turnstileSiteKey && !captchaToken"/>
    </Form>
  </div>
</template>

<script setup lang="ts">
import {Capacitor} from '@capacitor/core';
import type {FormResolverOptions, FormSubmitEvent} from '@primevue/forms';
import ArrowLeft from '@primeicons/vue/arrow-left';
import BaseTurnstile from '@/components/base/BaseTurnstile.vue';

const {t} = useI18n();
const supabase = useSupabaseClient();
const router = useRouter();
const toast = useToast();
const {public: {turnstileSiteKey}} = useRuntimeConfig();

const isLoading = ref(false);
const captchaToken = ref('');
const turnstileRef = ref<InstanceType<typeof BaseTurnstile>>();

const credentials = ref({
  email: ''
});

const resolver = ({values}: FormResolverOptions) => {
  const errors: Record<string, {message: string}[]> = {};

  if (!values.email?.trim()) {
    errors.email = [{message: t('login.emailRequired')}];
  }

  return {
    errors
  };
};

const onFormSubmit = async ({valid, states}: FormSubmitEvent) => {
  if (!valid) return;

  isLoading.value = true;

  const redirectTo = Capacitor.isNativePlatform()
    ? 'com.scorebuddy.app://account/reset-password'
    : `${window.location.origin}/account/reset-password`;

  const {error} = await supabase.auth.resetPasswordForEmail(states.email!.value.trim(), {
    redirectTo,
    captchaToken: captchaToken.value || undefined
  });

  isLoading.value = false;

  if (error) {
    turnstileRef.value?.reset();
    captchaToken.value = '';
    toast.add({severity: 'error', summary: t('common.error'), detail: error.message, life: 4000});
    return;
  }

  toast.add({severity: 'success', summary: t('forgotPassword.checkInboxTitle'), detail: t('forgotPassword.checkInboxMessage'), life: 6000});
  router.push('/account/login');
};
</script>

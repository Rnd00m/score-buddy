<template>
  <div>
    <Toast position="top-center" class="max-w-[calc(100%-2rem)]"/>

    <h1 class="mb-6 flex items-center gap-4">
      <NuxtLink to="/account">
        <Button severity="secondary" icon="pi pi-arrow-left"/>
      </NuxtLink>
      <span class="text-3xl">{{ t('signup.title') }}</span>
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
        <Password id="password" name="password" toggleMask fluid/>
        <Message v-if="$form.password?.invalid" severity="error" size="small" variant="simple">{{
            $form.password.error?.message
          }}
        </Message>
      </div>

      <div class="flex flex-col gap-1">
        <label for="confirmPassword">{{ t('signup.confirmPassword') }}</label>
        <Password id="confirmPassword" name="confirmPassword" :feedback="false" toggleMask fluid/>
        <Message v-if="$form.confirmPassword?.invalid" severity="error" size="small" variant="simple">{{
            $form.confirmPassword.error?.message
          }}
        </Message>
      </div>

      <Button type="submit" severity="primary" :label="t('signup.submit')" :loading="isLoading"/>
    </Form>

    <p class="mt-4 text-center">
      {{ t('signup.alreadyHaveAccount') }} <NuxtLink to="/account/login" class="text-primary">{{ t('signup.logIn') }}</NuxtLink>
    </p>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import {Capacitor} from '@capacitor/core';

const {t} = useI18n();
const supabase = useSupabaseClient();
const router = useRouter();
const toast = useToast();

const isLoading = ref(false);

const credentials = ref({
  email: '',
  password: '',
  confirmPassword: ''
});

const resolver = ({values}) => {
  const errors = {};

  if (!values.email?.trim()) {
    errors.email = [{message: t('login.emailRequired')}];
  }

  if (!values.password) {
    errors.password = [{message: t('login.passwordRequired')}];
  } else if (values.password.length < 6) {
    errors.password = [{message: t('signup.passwordMinLength')}];
  }

  if (values.confirmPassword !== values.password) {
    errors.confirmPassword = [{message: t('signup.passwordsDoNotMatch')}];
  }

  return {
    errors
  };
};

const onFormSubmit = async ({valid, states}) => {
  if (!valid) return;

  isLoading.value = true;

  const emailRedirectTo = Capacitor.isNativePlatform()
    ? 'com.scorebuddy.app://account/callback'
    : `${window.location.origin}/auth/callback`;

  const {error} = await supabase.auth.signUp({
    email: states.email.value.trim(),
    password: states.password.value,
    options: {emailRedirectTo}
  });

  isLoading.value = false;

  if (error) {
    toast.add({severity: 'error', summary: t('common.error'), detail: error.message, life: 4000});
    return;
  }

  toast.add({severity: 'success', summary: t('signup.checkInboxTitle'), detail: t('signup.checkInboxMessage'), life: 6000});
  router.push('/account/login');
};
</script>

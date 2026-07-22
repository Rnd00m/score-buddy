<template>
  <div>
    <Toast position="bottom-center" class="max-w-[calc(100%-2rem)]"/>

    <h1 class="mb-6 flex items-center gap-4">
      <NuxtLink to="/account">
        <Button severity="secondary">
          <template #icon><ArrowLeft :size="18"/></template>
        </Button>
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
        <Password id="password" name="password" :feedback="false" toggleMask fluid/>
        <Message v-if="$form.password?.invalid" severity="error" size="small" variant="simple">{{
            $form.password.error?.message
          }}
        </Message>
        <ul class="flex flex-col gap-2 list-none ms-1 my-1 p-0">
          <li v-for="req in passwordRequirements" :key="req.id" class="flex items-center gap-2 text-sm transition-all duration-300">
            <CheckCircle :class="['transition-all duration-300 ease-out', req.test($form.password?.value ?? '') ? 'text-green-500 scale-110 opacity-100' : 'text-surface-400 scale-90 opacity-70']"/>
            <span :class="['transition-all duration-300 ease-out', req.test($form.password?.value ?? '') ? 'text-green-700 dark:text-green-400 line-through decoration-2 decoration-green-500/70' : 'text-surface-700 dark:text-surface-300 dark:opacity-70']">
              {{ req.label }}
            </span>
          </li>
        </ul>
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
import {Capacitor} from '@capacitor/core';
import type {FormResolverOptions, FormSubmitEvent} from '@primevue/forms';
import ArrowLeft from '@primeicons/vue/arrow-left';
import CheckCircle from '@primeicons/vue/check-circle';

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

const passwordRequirementDefinitions = [
  {id: 'minLength', labelKey: 'signup.requirementMinLength', test: (v: string) => v.length >= 8},
  {id: 'uppercase', labelKey: 'signup.requirementUppercase', test: (v: string) => /[A-Z]/.test(v)},
  {id: 'lowercase', labelKey: 'signup.requirementLowercase', test: (v: string) => /[a-z]/.test(v)},
  {id: 'number', labelKey: 'signup.requirementNumber', test: (v: string) => /[0-9]/.test(v)},
  {id: 'symbol', labelKey: 'signup.requirementSymbol', test: (v: string) => /[^a-zA-Z0-9]/.test(v)}
];

const passwordRequirements = computed(() => passwordRequirementDefinitions.map(req => ({...req, label: t(req.labelKey)})));

const isPasswordStrongEnough = (password: string) => passwordRequirementDefinitions.every(req => req.test(password));

const resolver = ({values}: FormResolverOptions) => {
  const errors: Record<string, {message: string}[]> = {};

  if (!values.email?.trim()) {
    errors.email = [{message: t('login.emailRequired')}];
  }

  if (!values.password) {
    errors.password = [{message: t('login.passwordRequired')}];
  } else if (!isPasswordStrongEnough(values.password)) {
    errors.password = [{message: t('signup.passwordRequirements')}];
  }

  if (values.confirmPassword !== values.password) {
    errors.confirmPassword = [{message: t('signup.passwordsDoNotMatch')}];
  }

  return {
    errors
  };
};

const onFormSubmit = async ({valid, states}: FormSubmitEvent) => {
  if (!valid) return;

  isLoading.value = true;

  const emailRedirectTo = Capacitor.isNativePlatform()
    ? 'com.scorebuddy.app://account/callback'
    : `${window.location.origin}/auth/callback`;

  const {error} = await supabase.auth.signUp({
    email: states.email!.value.trim(),
    password: states.password!.value,
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

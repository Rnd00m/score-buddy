<template>
  <div>
    <h1 class="mb-6 text-3xl">{{ t('resetPassword.title') }}</h1>

    <Message v-if="isValidSession === false" severity="error" size="small">
      {{ t('resetPassword.invalidLink') }}
      <NuxtLink to="/account/forgot-password" class="text-primary underline">{{ t('resetPassword.requestNewLink') }}</NuxtLink>
    </Message>

    <Form v-else-if="isValidSession" v-slot="$form" :initialValues="credentials" :resolver :validateOnValueUpdate="false" :validateOnBlur="false" @submit="onFormSubmit" class="flex flex-col gap-4 w-full">
      <div class="flex flex-col gap-1">
        <label for="password">{{ t('resetPassword.newPassword') }}</label>
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

      <Button type="submit" severity="primary" :label="t('resetPassword.submit')" :loading="isLoading"/>
    </Form>
  </div>
</template>

<script setup lang="ts">
import type {FormResolverOptions, FormSubmitEvent} from '@primevue/forms';
import CheckCircle from '@primeicons/vue/check-circle';

const {t} = useI18n();
const supabase = useSupabaseClient();
const router = useRouter();
const toast = useToast();

const isLoading = ref(false);
const isValidSession = ref<boolean | null>(null);

const credentials = ref({
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

  const {error} = await supabase.auth.updateUser({password: states.password!.value});

  isLoading.value = false;

  if (error) {
    toast.add({severity: 'error', summary: t('common.error'), detail: error.message, life: 4000});
    return;
  }

  toast.add({severity: 'success', summary: t('resetPassword.successTitle'), detail: t('resetPassword.successMessage'), life: 4000});
  router.push('/account');
};

onMounted(async () => {
  const {data: {session}} = await supabase.auth.getSession();
  if (session) {
    isValidSession.value = true;
    return;
  }

  const {data: {subscription}} = supabase.auth.onAuthStateChange((event) => {
    if (event !== 'PASSWORD_RECOVERY') return;
    isValidSession.value = true;
    subscription.unsubscribe();
  });

  setTimeout(() => {
    if (isValidSession.value === null) isValidSession.value = false;
    subscription.unsubscribe();
  }, 3000);
});
</script>

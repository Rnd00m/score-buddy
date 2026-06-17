<template>
  <div>
    <Toast position="top-center" class="max-w-[calc(100%-2rem)]"/>

    <h1 class="mb-6 flex items-center gap-4">
      <NuxtLink to="/account">
        <Button severity="secondary" icon="pi pi-arrow-left"/>
      </NuxtLink>
      <span class="text-3xl">Sign up</span>
    </h1>

    <Form v-slot="$form" :initialValues="credentials" :resolver :validateOnValueUpdate="false" :validateOnBlur="false" @submit="onFormSubmit" class="flex flex-col gap-4 w-full">
      <div class="flex flex-col gap-1">
        <label for="email">Email</label>
        <InputText id="email" name="email" type="email" fluid/>
        <Message v-if="$form.email?.invalid" severity="error" size="small" variant="simple">{{
            $form.email.error?.message
          }}
        </Message>
      </div>

      <div class="flex flex-col gap-1">
        <label for="password">Password</label>
        <Password id="password" name="password" toggleMask fluid/>
        <Message v-if="$form.password?.invalid" severity="error" size="small" variant="simple">{{
            $form.password.error?.message
          }}
        </Message>
      </div>

      <div class="flex flex-col gap-1">
        <label for="confirmPassword">Confirm password</label>
        <Password id="confirmPassword" name="confirmPassword" :feedback="false" toggleMask fluid/>
        <Message v-if="$form.confirmPassword?.invalid" severity="error" size="small" variant="simple">{{
            $form.confirmPassword.error?.message
          }}
        </Message>
      </div>

      <Button type="submit" severity="primary" label="Sign up" :loading="isLoading"/>
    </Form>

    <p class="mt-4 text-center">
      Already have an account? <NuxtLink to="/account/login" class="text-primary">Log in</NuxtLink>
    </p>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import {Capacitor} from '@capacitor/core';

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
    errors.email = [{message: 'Email is required.'}];
  }

  if (!values.password) {
    errors.password = [{message: 'Password is required.'}];
  } else if (values.password.length < 6) {
    errors.password = [{message: 'Password must be at least 6 characters.'}];
  }

  if (values.confirmPassword !== values.password) {
    errors.confirmPassword = [{message: 'Passwords do not match.'}];
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
    toast.add({severity: 'error', summary: 'Error', detail: error.message, life: 4000});
    return;
  }

  toast.add({severity: 'success', summary: 'Check your inbox', detail: 'Confirm your email address to finish creating your account.', life: 6000});
  router.push('/account/login');
};
</script>

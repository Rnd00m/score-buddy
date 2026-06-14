<template>
  <div>
    <Toast position="top-center" class="max-w-[calc(100%-2rem)]"/>
    <ConfirmDialog group="import" class="max-w-96 w-[calc(100%-6rem)]">
      <template #container="{ message, acceptCallback, rejectCallback }">
        <div class="flex flex-col items-center p-8 bg-surface-0 dark:bg-surface-900 rounded">
          <div class="rounded-full bg-primary text-primary-contrast inline-flex justify-center items-center h-24 w-24 -mt-20">
            <i class="pi pi-cloud-upload text-5xl"></i>
          </div>
          <span class="font-bold text-2xl block mb-2 mt-6">{{ message.header }}</span>
          <p class="mb-0">{{ message.message }}</p>
          <div class="flex items-center gap-2 mt-6">
            <Button severity="contrast" label="Import" @click="acceptCallback"></Button>
            <Button severity="secondary" label="Not now" outlined @click="rejectCallback"></Button>
          </div>
        </div>
      </template>
    </ConfirmDialog>

    <h1 class="mb-6 flex items-center gap-4">
      <NuxtLink to="/account">
        <Button severity="secondary" icon="pi pi-arrow-left"/>
      </NuxtLink>
      <span class="text-3xl">Log in</span>
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
        <Password id="password" name="password" :feedback="false" toggleMask fluid/>
        <Message v-if="$form.password?.invalid" severity="error" size="small" variant="simple">{{
            $form.password.error?.message
          }}
        </Message>
      </div>

      <Button type="submit" severity="primary" label="Log in" :loading="isLoading"/>
    </Form>

    <p class="mt-4 text-center">
      No account yet? <NuxtLink to="/account/signup" class="text-primary">Sign up</NuxtLink>
    </p>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue';

const supabase = useSupabaseClient();
const router = useRouter();
const toast = useToast();
const confirm = useConfirm();
const roomStore = useRoomStore();
const playerProfilesStore = usePlayerProfilesStore();
const {pullRemote, importLocalToRemote} = useSupabaseSync();

const isLoading = ref(false);

const credentials = ref({
  email: '',
  password: ''
});

const resolver = ({values}) => {
  const errors = {};

  if (!values.email?.trim()) {
    errors.email = [{message: 'Email is required.'}];
  }

  if (!values.password) {
    errors.password = [{message: 'Password is required.'}];
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
    password: states.password.value
  });

  if (error) {
    isLoading.value = false;
    toast.add({severity: 'error', summary: 'Error', detail: error.message, life: 4000});
    return;
  }

  const hasLocalData = playerProfilesStore.profiles.length > 0 || roomStore.games.length > 0;

  try {
    await pullRemote();
  } catch {
    toast.add({severity: 'error', summary: 'Sync error', detail: 'Could not fetch your saved data.', life: 4000});
  }

  isLoading.value = false;

  if (!hasLocalData) {
    router.push('/account');
    return;
  }

  confirm.require({
    group: 'import',
    header: 'Import local data?',
    message: 'You have games and/or saved players stored on this device. Do you want to add them to your account?',
    accept: () => {
      importLocalToRemote().catch(() => {
        toast.add({severity: 'error', summary: 'Sync error', detail: 'Could not import your local data.', life: 4000});
      });
      router.push('/account');
    },
    reject: () => {
      router.push('/account');
    }
  });
};
</script>

<template>
  <div>
    <h1 class="mb-6 flex items-center gap-4">
      <NuxtLink to="/rooms">
        <Button severity="secondary">
          <template #icon><ArrowLeft :size="18"/></template>
        </Button>
      </NuxtLink>
      <span class="text-3xl">{{ t('addPlayer.title') }}</span>
    </h1>

    <div v-if="quickPickProfiles.length" class="flex flex-col gap-2 mb-4">
      <label>{{ t('addPlayer.playersPlayedWith') }}</label>
      <div class="flex flex-wrap content-start gap-2 max-h-52 overflow-y-auto">
        <Button
            v-for="profile in visibleQuickPickProfiles"
            :key="profile.id"
            severity="secondary"
            outlined
            @click="addFromProfile(profile)"
        >
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 rounded-md" :style="{background: profile.color.value}"></div>
            <span>{{ profile.name }}</span>
          </div>
        </Button>
      </div>
    </div>

    <Form ref="formRef" :key="formKey" v-slot="$form" :initialValues="player" :resolver @submit="onFormSubmit" class="flex flex-col gap-4 w-full">
      <div class="flex flex-col gap-1">
        <label for="name">{{ t('common.name') }}</label>
        <AutoComplete
            id="name"
            name="name"
            type="text"
            :suggestions="playerNameSuggestions"
            :show-empty-message="false"
            fluid
            @complete="searchPlayerName"
            @option-select="onPlayerNameSelect"
        >
          <template #option="slotProps">
            <div class="flex items-center gap-2">
              <div class="w-4 h-4 rounded-md" :style="{background: findProfileByName(slotProps.option)?.color.value}"></div>
              <span>{{ slotProps.option }}</span>
            </div>
          </template>
        </AutoComplete>
        <Message v-if="$form.name?.invalid" severity="error" size="small" variant="simple">{{
            $form.name.error?.message
          }}
        </Message>
      </div>
      <div class="flex flex-col gap-1">
        <label for="color">{{ t('common.color') }}</label>
        <Select id="color" v-model="selectedColor" :options="availableColors" optionLabel="name" class="w-full" :invalid="colorInvalid">
          <template #value="slotProps">
            <div v-if="slotProps.value" class="flex items-center gap-2">
              <div class="w-6 h-6 rounded-md" :style="{background: `${slotProps.value.value}`}"></div>
              <div>{{ slotProps.value.name }}</div>
            </div>
          </template>
          <template #option="slotProps">
            <div class="flex items-center gap-2">
              <div class="w-6 h-6 rounded-md" :style="{background: `${slotProps.option.value}`}"></div>
              <div>{{ slotProps.option.name }}</div>
            </div>
          </template>
        </Select>
        <Message v-if="colorInvalid" severity="error" size="small" variant="simple">{{ t('addPlayer.colorRequired') }}</Message>
      </div>
      <Button type="submit" severity="primary" :label="t('common.submit')"/>
    </Form>
  </div>
</template>

<script setup lang="ts">
import type {FormResolverOptions, FormSubmitEvent} from '@primevue/forms';
import type {Color, PlayerProfile} from '~/types/global';
import {PLAYER_COLORS} from '~/utils/color';
import ArrowLeft from '@primeicons/vue/arrow-left';

const {t} = useI18n();
const roomStore = useRoomStore();
const playerProfilesStore = usePlayerProfilesStore();
const user = useSupabaseUser();
const {syncProfile} = useSupabaseSync();
const toast = useToast();

const formKey = ref(0);

const notifyPlayerAdded = (name: string) => {
  toast.add({severity: 'success', summary: t('addPlayer.playerAddedTitle'), detail: t('addPlayer.playerAddedMessage', {name}), life: 3000});
};

const player = ref({
  name: ''
});

const availableColors = computed(() => {
  return PLAYER_COLORS.filter(color => !roomStore.players.some(player => player.color.value === color.value));
});

const gamesPlayedCount = (profile: PlayerProfile) => {
  return roomStore.games.filter(game => game.scores.some(score => score.player.name === profile.name)).length;
};

const quickPickProfiles = computed(() => {
  return playerProfilesStore.profiles
    .filter(profile => !roomStore.players.some(player => player.name === profile.name))
    .sort((a, b) => gamesPlayedCount(b) - gamesPlayedCount(a));
});

const visibleQuickPickProfiles = computed(() => quickPickProfiles.value.slice(0, 8));

const formRef = ref();
const selectedColor = ref<Color | null>(null);
const colorInvalid = ref(false);
const playerNameQuery = ref('');

const findProfileByName = (name: string) => playerProfilesStore.profiles.find(profile => profile.name === name);

const searchPlayerName = (event: {query: string}) => {
  playerNameQuery.value = event.query;
};

const playerNameSuggestions = computed<string[]>(() => {
  const query = playerNameQuery.value.toLowerCase();

  if (query.length < 2) return [];

  return playerProfilesStore.profiles
    .filter(profile => !roomStore.players.some(player => player.name === profile.name))
    .filter(profile => profile.name.toLowerCase().includes(query))
    .map(profile => profile.name);
});

const isColorTaken = (color: Color) => roomStore.players.some(player => player.color.value === color.value);

const onPlayerNameSelect = (event: {value: string}) => {
  const profile = findProfileByName(event.value);

  if (!profile) return;

  selectedColor.value = isColorTaken(profile.color) ? null : (availableColors.value.find(color => color.value === profile.color.value) ?? profile.color);
  colorInvalid.value = false;
};

const addFromProfile = (profile: PlayerProfile) => {
  if (isColorTaken(profile.color)) {
    formRef.value?.setFieldValue('name', profile.name);
    selectedColor.value = null;
    colorInvalid.value = false;

    return;
  }

  roomStore.addPlayer(profile.name, profile.color);
  notifyPlayerAdded(profile.name);
};

const resolver = ({values}: FormResolverOptions) => {
  const errors: Record<string, {message: string}[]> = {};

  const name = values.name.trim();

  if (!name) {
    errors.name = [{message: t('addPlayer.nameRequired')}];
  }

  if (name && name.length < 2) {
    errors.name = [{message: t('addPlayer.nameMinLength')}];
  }

  if (name && name.length > 20) {
    errors.name = [{message: t('addPlayer.nameMaxLength')}];
  }

  if (name && roomStore.players.some(player => player.name === name)) {
    errors.name = [{message: t('addPlayer.nameTaken')}];
  }

  return {
    errors
  };
};

const onFormSubmit = ({valid, states}: FormSubmitEvent) => {
  colorInvalid.value = !selectedColor.value;

  if (!valid || colorInvalid.value) return;

  const name = states.name?.value.trim();
  const color = selectedColor.value!;

  roomStore.addPlayer(name, color);
  notifyPlayerAdded(name);

  if (!playerProfilesStore.profiles.some(profile => profile.name === name)) {
    const profile = playerProfilesStore.addProfile(name, color);

    if (user.value) {
      syncProfile(profile).catch(() => {});
    }
  }

  selectedColor.value = null;
  colorInvalid.value = false;
  playerNameQuery.value = '';
  formKey.value++;
};
</script>
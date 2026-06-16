<template>
  <div>
    <Toast position="top-center" class="max-w-[calc(100%-2rem)]"/>

    <h1 class="mb-6 flex items-center gap-4">
      <NuxtLink to="/rooms">
        <Button severity="secondary" icon="pi pi-arrow-left"/>
      </NuxtLink>
      <span class="text-3xl">Add player</span>
    </h1>

    <div v-if="quickPickProfiles.length" class="flex flex-col gap-2 mb-4">
      <label>Players you've played with</label>
      <div class="flex flex-wrap content-start gap-2 max-h-52 overflow-y-auto">
        <Button
            v-for="profile in quickPickProfiles"
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

    <Form :key="formKey" v-slot="$form" :initialValues="player" :resolver @submit="onFormSubmit" class="flex flex-col gap-4 w-full">
      <div class="flex flex-col gap-1">
        <label for="name">Name</label>
        <InputText
            id="name"
            name="name"
            type="text"
            fluid
        />
        <Message v-if="$form.name?.invalid" severity="error" size="small" variant="simple">{{
            $form.name.error?.message
          }}
        </Message>
      </div>
      <div class="flex flex-col gap-1">
        <label for="color">Color</label>
        <Select id="color" name="color" :options="availableColors" optionLabel="name" class="w-full">
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
        <Message v-if="$form.color?.invalid" severity="error" size="small" variant="simple">{{
            $form.color.error?.message
          }}
        </Message>
      </div>
      <Button type="submit" severity="primary" label="Submit"/>
    </Form>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import type {PlayerProfile} from '~/types/global';
import {PLAYER_COLORS} from '~/utils/color';

const roomStore = useRoomStore();
const playerProfilesStore = usePlayerProfilesStore();
const user = useSupabaseUser();
const {syncProfile} = useSupabaseSync();
const toast = useToast();

const formKey = ref(0);

const notifyPlayerAdded = (name: string) => {
  toast.add({severity: 'success', summary: 'Player added', detail: `${name} has been added to the lobby.`, life: 3000});
};

const player = ref({
  name: '',
  color: null
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

const addFromProfile = (profile: PlayerProfile) => {
  const colorTaken = roomStore.players.some(player => player.color.value === profile.color.value);
  const color = colorTaken ? (availableColors.value[0] ?? profile.color) : profile.color;

  roomStore.addPlayer(profile.name, color);
  notifyPlayerAdded(profile.name);
};

const resolver = ({values}) => {
  const errors = {};

  const name = values.name.trim();

  if (!name) {
    errors.name = [{message: 'Name is required.'}];
  }

  if (name && name.length < 2) {
    errors.name = [{message: 'Name must be at least 2 characters.'}];
  }

  if (name && name.length > 20) {
    errors.name = [{message: 'Name must be at most 20 characters.'}];
  }

  if (name && roomStore.players.some(player => player.name === name)) {
    errors.name = [{message: 'Name is already taken.'}];
  }

  if (!values.color) {
    errors.color = [{message: 'Color is required.'}];
  }

  return {
    errors
  };
};

const onFormSubmit = ({valid, states}) => {
  if (!valid) return;

  const name = states.name.value.trim();
  const color = states.color.value;

  roomStore.addPlayer(name, color);
  notifyPlayerAdded(name);

  if (!playerProfilesStore.profiles.some(profile => profile.name === name)) {
    const profile = playerProfilesStore.addProfile(name, color);

    if (user.value) {
      syncProfile(profile).catch(() => {});
    }
  }

  formKey.value++;
};
</script>
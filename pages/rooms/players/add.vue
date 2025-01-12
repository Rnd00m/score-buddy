<template>
  <h1 class="mb-6 flex items-center gap-4">
    <NuxtLink to="/rooms">
      <Button severity="secondary" icon="pi pi-arrow-left"/>
    </NuxtLink>
    <span class="text-3xl">Add player</span>
  </h1>

  <Form v-slot="$form" :initialValues="player" :resolver @submit="onFormSubmit" class="flex flex-col gap-4 w-full">
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
    <Button type="submit" severity="secondary" label="Submit"/>
  </Form>

</template>

<script setup>
import {ref} from 'vue';

const roomStore = useRoomStore();
const router = useRouter();

const player = ref({
  name: '',
  color: null
});

const colors = ref([
  {"name": "Chestnut Brown", "value": "#8B4513"},
  {"name": "Alizarin", "value": "#e74c3c"},
  {"name": "Orange", "value": "#f39c12"},
  {"name": "Sunflower Yellow", "value": "#FFD700"},
  {"name": "Lime Green", "value": "#32CD32"},
  {"name": "Emerald Green", "value": "#2E8B57"},
  {"name": "Sky Blue", "value": "#87CEEB"},
  {"name": "Royal Blue", "value": "#4169E1"},
  {"name": "Navy Blue", "value": "#000080"},
  {"name": "Wisteria", "value": "#8e44ad"},
  {"name": "Hot Pink", "value": "#FF69B4"},
  {"name": "Rose Pink", "value": "#FF1493"},
  {"name": "Turquoise", "value": "#40E0D0"},
  {"name": "Teal", "value": "#008080"},
  {"name": "Silver", "value": "#bdc3c7"},
  {"name": "Jet Black", "value": "#000000"}
]);


const availableColors = computed(() => {
  return colors.value.filter(color => !roomStore.players.some(player => player.color.value === color.value));
});

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
  if (valid) {
    roomStore.addPlayer({
      name: states.name.value.trim(),
      color: states.color.value,
      score: 0
    });
    router.push('/rooms');
  }
};
</script>
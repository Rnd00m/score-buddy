<template>
  <h1 class="mb-6 flex items-center gap-4">
    <NuxtLink to="/rooms">
      <Button severity="secondary" icon="pi pi-arrow-left" />
    </NuxtLink>
    <span class="text-3xl">Add player</span>
  </h1>

  <Form v-slot="$form" :initialValues="player" :resolver @submit="onFormSubmit" class="flex flex-col gap-4 w-full">
    <div class="flex flex-col gap-1">
      <label for="name">Name</label>
      <InputText id="name" name="name" type="text" fluid/>
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
  { name: 'Turquoise', value: '#1abc9c' },
  { name: 'Green Sea', value: '#16a085' },
  { name: 'Emerald', value: '#2ecc71' },
  { name: 'Nephritis', value: '#27ae60' },
  { name: 'Peter River', value: '#3498db' },
  { name: 'Belize Hole', value: '#2980b9' },
  { name: 'Amethyst', value: '#9b59b6' },
  { name: 'Wisteria', value: '#8e44ad' },
  { name: 'Sun Flower', value: '#f1c40f' },
  { name: 'Orange', value: '#f39c12' },
  { name: 'Carrot', value: '#e67e22' },
  { name: 'Pumpkin', value: '#d35400' },
  { name: 'Alizarin', value: '#e74c3c' },
  { name: 'Pomegranate', value: '#c0392b' },
  { name: 'Midnight Blue', value: '#2c3e50' },
  { name: 'Asbestos', value: '#7f8c8d' },
]);

const availableColors = computed(() => {
  return colors.value.filter(color => !roomStore.players.some(player => player.color.value === color.value));
});

const resolver = ({values}) => {
  const errors = {};

  if (!values.name) {
    errors.name = [{message: 'Name is required.'}];
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
      name: states.name.value,
      color: states.color.value,
      score: 0
    });
    router.push('/rooms');
  }
};
</script>
<template>
  <div>
    <h1 class="mb-6 flex items-center gap-4">
      <NuxtLink to="#" @click.prevent="$router.back()">
        <Button severity="secondary" icon="pi pi-arrow-left"/>
      </NuxtLink>
      <span class="text-3xl">New Game</span>
    </h1>

    <Form v-slot="$form" :initialValues="player" :resolver :validateOnValueUpdate="false" :validateOnBlur="false" @submit="onFormSubmit" class="flex flex-col gap-4 w-full">
      <div class="flex flex-col gap-1">
        <label for="name">Name</label>
        <AutoComplete
            id="name"
            :suggestions="suggestedGameNames"
            @complete="searchGameName"
            name="name"
            type="text"
            fluid
            :showEmptyMessage="false"
        />
        <Message v-if="$form.name?.invalid" severity="error" size="small" variant="simple">{{
            $form.name.error?.message
          }}
        </Message>
      </div>

      <div class="flex flex-col gap-1">
        <label for="startScore">Start score</label>
        <InputNumber id="startScore" name="startScore" :min="lowestPossibleScore !== null ? lowestPossibleScore : undefined" showButtons buttonLayout="horizontal" :step="1" fluid>
          <template #incrementbuttonicon>
            <span class="pi pi-plus" />
          </template>
          <template #decrementbuttonicon>
            <span class="pi pi-minus" />
          </template>
        </InputNumber>
        <Message v-if="$form.startScore?.invalid" severity="error" size="small" variant="simple">{{
            $form.startScore.error?.message
          }}
        </Message>
      </div>

      <div class="flex flex-col gap-1">
        <label for="endingScore">Ending score</label>
        <InputNumber id="endingScore" name="endingScore" :min="lowestPossibleScore !== null ? lowestPossibleScore : undefined" showButtons buttonLayout="horizontal" :step="1" fluid>
          <template #incrementbuttonicon>
            <span class="pi pi-plus" />
          </template>
          <template #decrementbuttonicon>
            <span class="pi pi-minus" />
          </template>
        </InputNumber>
        <Message v-if="$form.endingScore?.invalid" severity="error" size="small" variant="simple">{{
            $form.endingScore.error?.message
          }}
        </Message>
      </div>

      <div class="flex flex-col gap-1">
        <label for="winCondition">Winner</label>
        <SelectButton id="winCondition" name="winCondition" :options="winConditions" />
        <Message v-if="$form.winCondition?.invalid" severity="error" size="small" variant="simple">{{
            $form.winCondition.error?.message
          }}
        </Message>
      </div>

      <div class="flex flex-col gap-1">
        <label for="lowestPossibleScore">Lowest possible score</label>
        <InputNumber id="lowestPossibleScore" name="lowestPossibleScore" showButtons buttonLayout="horizontal" :step="1" fluid v-model="lowestPossibleScore">
          <template #incrementbuttonicon>
            <span class="pi pi-plus" />
          </template>
          <template #decrementbuttonicon>
            <span class="pi pi-minus" />
          </template>
        </InputNumber>
        <Message v-if="$form.lowestPossibleScore?.invalid" severity="error" size="small" variant="simple">{{
            $form.lowestPossibleScore.error?.message
          }}
        </Message>
      </div>

      <Button type="submit" severity="secondary" label="Start"/>
    </Form>
  </div>
</template>

<script setup lang="ts">
import { WinCondition } from '~/types/global';
import { ref } from 'vue';

const roomStore = useRoomStore();
const router = useRouter();

const suggestedGameNames = ref<string[]>([]);

const searchGameName = (event: any) => {
  suggestedGameNames.value = roomStore.games.filter(game => game.name.toLowerCase().includes(event.query.toLowerCase())).reduce((acc: string[], game) => {
    if (!acc.includes(game.name)) {
      acc.push(game.name);
    }
    return acc;
  }, []);
}

const lowestPossibleScore = ref(null);

const player = ref({
  name: '',
  startScore: 0,
  endingScore: null,
  winCondition: WinCondition.MostPoints,
  lowestPossibleScore: null
});

const winConditions = ref([WinCondition.MostPoints, WinCondition.LeastPoints]);

const resolver = ({values}) => {
  const errors = {};

  const name = values.name.trim();

  if (!name) {
    errors.name = [{message: 'Name is required.'}];
  }

  if (name && name.length < 1) {
    errors.name = [{message: 'Name must be at least 1 characters.'}];
  }

  if (name && name.length > 48) {
    errors.name = [{message: 'Name must be at most 48 characters.'}];
  }

  if (name && roomStore.players.some(player => player.name === name)) {
    errors.name = [{message: 'Name is already taken.'}];
  }

  if (values.startScore === null) {
    errors.startScore = [{message: 'Start score is required.'}];
  }

  if (values.lowestPossibleScore !== null && values.startScore < values.lowestPossibleScore) {
    errors.startScore = [{message: `Start score must be at least ${values.lowestPossibleScore}.`}];
  }

  if (values.lowestPossibleScore !== null && values.endingScore < values.lowestPossibleScore) {
    errors.endingScore = [{message: `Ending score must be at least ${values.lowestPossibleScore}.`}];
  }

  if (values.endingScore === values.startScore) {
    errors.endingScore = [{message: 'Ending score should be different than start score.'}];
  }

  return {
    errors
  };
};

const onFormSubmit = ({valid, states}) => {
  if (valid) {
    roomStore.startGame(
        states.name.value.trim(),
        states.startScore.value,
        states.endingScore.value,
        states.winCondition.value,
        states.lowestPossibleScore.value
    );
    router.push('/game');
  }
};
</script>
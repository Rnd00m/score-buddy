<template>
  <div>
    <h1 class="mb-6 flex items-center gap-4">
      <NuxtLink to="#" @click.prevent="$router.back()">
        <Button severity="secondary" icon="pi pi-arrow-left"/>
      </NuxtLink>
      <span class="text-3xl">{{ t('newGame.title') }}</span>
    </h1>

    <Form v-slot="$form" :initialValues="player" :resolver :validateOnValueUpdate="false" :validateOnBlur="false" @submit="onFormSubmit" class="flex flex-col gap-4 w-full">
      <div class="flex flex-col gap-1">
        <label for="name">{{ t('common.name') }}</label>
        <InputText
            v-if="!user"
            id="name"
            name="name"
            type="text"
            fluid
        />
        <AutoComplete
            v-else
            id="name"
            :suggestions="suggestedGameNames"
            :loading="isSearchingBggGames"
            :empty-search-message="t('newGame.noGameNameResults')"
            @complete="searchGameName"
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
        <label for="startScore">{{ t('newGame.startScore') }}</label>
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
        <label for="endingScore">{{ t('newGame.endingScore') }}</label>
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
        <label for="winningRounds">{{ t('newGame.winningRounds') }}</label>
        <InputNumber id="winningRounds" name="winningRounds" :min="1" showButtons buttonLayout="horizontal" :step="1" fluid>
          <template #incrementbuttonicon>
            <span class="pi pi-plus" />
          </template>
          <template #decrementbuttonicon>
            <span class="pi pi-minus" />
          </template>
        </InputNumber>
        <Message v-if="$form.winningRounds?.invalid" severity="error" size="small" variant="simple">{{
            $form.winningRounds.error?.message
          }}
        </Message>
      </div>

      <div class="flex flex-col gap-1">
        <label for="winCondition">{{ t('newGame.winner') }}</label>
        <SelectButton id="winCondition" name="winCondition" :options="winConditions" :optionLabel="winConditionLabel" />
        <Message v-if="$form.winCondition?.invalid" severity="error" size="small" variant="simple">{{
            $form.winCondition.error?.message
          }}
        </Message>
      </div>

      <div class="flex flex-col gap-1">
        <label for="lowestPossibleScore">{{ t('newGame.lowestPossibleScore') }}</label>
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

      <Button type="submit" severity="primary" :label="t('common.start')"/>
    </Form>
  </div>
</template>

<script setup lang="ts">
import type {FormResolverOptions, FormSubmitEvent} from '@primevue/forms';
import { WinCondition } from '~/types/global';

const {t} = useI18n();
const roomStore = useRoomStore();
const router = useRouter();
const user = useSupabaseUser();

const gameNameQuery = ref('');
const { data: bggGames, isFetching: isSearchingBggGames } = useBggGameSearch(gameNameQuery);

const searchGameName = (event: any) => {
  gameNameQuery.value = event.query;
}

const suggestedGameNames = computed<string[]>(() => {
  const query = gameNameQuery.value.toLowerCase();

  const localMatches = roomStore.games
    .filter(game => game.name.toLowerCase().includes(query))
    .map(game => game.name);

  const bggMatches = (bggGames.value ?? []).map(game => game.name);

  return [...new Set([...localMatches, ...bggMatches])];
});

const lowestPossibleScore = ref(null);

const player = ref({
  name: '',
  startScore: 0,
  endingScore: null,
  winningRounds: 1,
  winCondition: WinCondition.MostPoints,
  lowestPossibleScore: null
});

const winConditions = ref([WinCondition.MostPoints, WinCondition.LeastPoints]);
const winConditionLabel = (option: WinCondition) => t(`winCondition.${option}`);

const resolver = ({values}: FormResolverOptions) => {
  const errors: Record<string, {message: string}[]> = {};

  const name = values.name.trim();

  if (!name) {
    errors.name = [{message: t('newGame.nameRequired')}];
  }

  if (name && name.length < 1) {
    errors.name = [{message: t('newGame.nameMinLength')}];
  }

  if (name && name.length > 64) {
    errors.name = [{message: t('newGame.nameMaxLength')}];
  }

  if (name && roomStore.players.some(player => player.name === name)) {
    errors.name = [{message: t('newGame.nameTaken')}];
  }

  if (values.startScore === null) {
    errors.startScore = [{message: t('newGame.startScoreRequired')}];
  }

  if (values.lowestPossibleScore !== null && values.startScore < values.lowestPossibleScore) {
    errors.startScore = [{message: t('newGame.startScoreMin', {min: values.lowestPossibleScore})}];
  }

  if (values.lowestPossibleScore !== null && values.endingScore < values.lowestPossibleScore) {
    errors.endingScore = [{message: t('newGame.endingScoreMin', {min: values.lowestPossibleScore})}];
  }

  if (values.endingScore === values.startScore) {
    errors.endingScore = [{message: t('newGame.endingScoreDifferent')}];
  }

  if (values.winningRounds === null) {
    errors.winningRounds = [{message: t('newGame.winningRoundsRequired')}];
  }

  if (values.winningRounds !== null && values.winningRounds < 1) {
    errors.winningRounds = [{message: t('newGame.winningRoundsMin')}];
  }

  return {
    errors
  };
};

const onFormSubmit = ({valid, states}: FormSubmitEvent) => {
  if (valid) {
    roomStore.startGame(
        states.name?.value.trim(),
        states.startScore?.value,
        states.endingScore?.value,
        states.winCondition?.value,
        states.lowestPossibleScore?.value,
        states.winningRounds?.value
    );
    router.push('/game');
  }
};
</script>
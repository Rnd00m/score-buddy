<template>
  <div class="flex flex-col h-full">
    <h1 class="mb-6 flex justify-between items-center shrink-0">
      <span class="text-3xl">{{ t('userGamesHistory.title') }}</span>
      <span class="text-surface-500">{{ t('userGamesHistory.gamesCount', { count: games.length }) }}</span>
    </h1>

    <div v-if="!user" class="flex flex-col gap-4">
      <p>{{ t('userGamesHistory.logInPrompt') }}</p>

      <NuxtLink to="/account/login">
        <Button :label="t('account.logIn')" icon="pi pi-sign-in" fluid/>
      </NuxtLink>
      <NuxtLink to="/account/signup">
        <Button :label="t('account.signUp')" icon="pi pi-user-plus" outlined fluid/>
      </NuxtLink>
    </div>

    <template v-else>
      <BaseConfirmModal
        group="replay"
        icon="pi pi-replay"
        icon-bg-class="bg-primary"
        :accept-label="t('common.yes')"
        :reject-label="t('common.no')"
      >
        <GameInfo v-if="selectedGame" :game="selectedGame" class="mt-2" />
      </BaseConfirmModal>

      <GameHistoryTable
          :games="games"
          :loading="isFetching"
          :empty-message="t('userGamesHistory.noGamesFound')"
          @replay="handleReplayGame"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';
import type {Game} from "~/types/global";
import { WinCondition } from "~/types/global";

const {t} = useI18n();
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const roomStore = useRoomStore();
const router = useRouter();

const { data, isFetching } = useQuery({
  queryKey: ['user-games-history', computed(() => user.value?.id)],
  queryFn: async () => {
    const { data, error } = await supabase.from('games').select('*');
    if (error) throw error;

    return data ?? [];
  },
  enabled: computed(() => !!user.value),
});

const games = computed(() => (data.value ?? []).map((row): Game & { createdAtTime: number } => ({
  uuid: row.local_uuid,
  name: row.name,
  startScore: row.start_score,
  endingScore: row.ending_score,
  lowestPossibleScore: row.lowest_possible_score,
  winCondition: row.win_condition as WinCondition,
  winningRounds: row.winning_rounds ?? 1,
  scores: row.scores,
  rounds: row.rounds ?? [],
  createdAt: new Date(row.created_at),
  endedAt: row.ended_at ? new Date(row.ended_at) : null,
  createdAtTime: new Date(row.created_at).getTime(),
})));

const confirm = useConfirm();
const selectedGame = ref<Game | null>(null);

const handleReplayGame = (game: Game) => {
  selectedGame.value = game;

  confirm.require({
    group: 'replay',
    header: game.name,
    message: roomStore.currentGame !== null
      ? t('gamesHistory.replayCurrentCanceled')
      : t('gamesHistory.replayStartNew'),
    accept: () => {
      if (roomStore.currentGame !== null) {
        roomStore.cancelGame();
      }

      roomStore.startGame(
        game.name,
        game.startScore,
        game.endingScore,
        game.winCondition,
        game.lowestPossibleScore,
        game.winningRounds ?? 1
      );

      router.push('/game');
    },
  });
}
</script>
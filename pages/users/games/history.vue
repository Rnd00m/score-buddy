<template>
  <div class="flex flex-col h-full">
    <h1 class="mb-6 flex justify-between items-center shrink-0">
      <span class="text-3xl">History</span>
    </h1>

    <div v-if="!user" class="flex flex-col gap-4">
      <p>Log in to see the history of every game played on your account, across all devices.</p>

      <NuxtLink to="/account/login">
        <Button label="Log in" icon="pi pi-sign-in" fluid/>
      </NuxtLink>
      <NuxtLink to="/account/signup">
        <Button label="Sign up" icon="pi pi-user-plus" outlined fluid/>
      </NuxtLink>
    </div>

    <template v-else>
      <ConfirmDialog group="replay" class="max-w-96 w-[calc(100%-6rem)]">
        <template #container="{ message, acceptCallback, rejectCallback }">
          <div class="flex flex-col items-center p-8 bg-surface-0 dark:bg-surface-900 rounded">
            <div class="rounded-full bg-primary text-primary-contrast inline-flex justify-center items-center h-24 w-24 -mt-20">
              <i class="pi pi-replay text-5xl"></i>
            </div>
            <span class="font-bold text-2xl block mb-2 mt-6">{{ message.header }}</span>

            <GameInfo v-if="selectedGame" :game="selectedGame" class="mt-2" />

            <p class="mb-0 mt-4">{{ message.message }}</p>
            <div class="flex items-center gap-2 mt-6">
              <Button label="Yes" @click="acceptCallback"></Button>
              <Button label="No" outlined @click="rejectCallback"></Button>
            </div>
          </div>
        </template>
      </ConfirmDialog>

      <GameHistoryTable
          :games="games"
          :loading="isFetching"
          empty-message="No games found."
          @replay="handleReplayGame"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';
import type {Game} from "~/types/global";
import { WinCondition } from "~/types/global";

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
  scores: row.scores,
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
    message: roomStore.players.length === 0
        ? 'Do you want to create a new lobby with the same players and start this game?'
        : 'Do you really want to restart this game?',
    accept: () => {
      if (roomStore.players.length === 0) {
        roomStore.players = game.scores.map(({ player }) => ({ ...player, score: 0 }));
      }

      roomStore.startGame(
          game.name,
          game.startScore,
          game.endingScore,
          game.winCondition,
          game.lowestPossibleScore
      );

      router.push('/game');
    },
  });
}
</script>
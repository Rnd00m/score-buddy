<template>
  <div class="h-[calc(100vh-118px)] grid place-items-center">
    <div class="flex flex-col items-center w-full gap-8" v-if="roomStore.players.length">
      <GameCallToActionCard
          headingText="New game"
          buttonText="Start"
          :buttonStyle="{
            backgroundColor: `var(--p-surface-900)`,
            borderColor: `var(--p-surface-900)`,
            color: `var(--p-primary-500)`,
          }"
          :cardStyle="{
            backgroundColor: `var(--p-primary-500)`,
            borderColor: `var(--p-primary-500)`,
            color: `var(--p-surface-900)`,
          }"
          icon="pi-play-circle"
          @buttonClicked="router.push('/games/new')"
      >
        <template #icon>
          <svg height="5rem" width="5rem" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
               viewBox="0 0 508 508" xml:space="preserve">
<path style="fill:#FFFFFF;" d="M254,28.2C129.5,28.2,28.2,129.5,28.2,254S129.5,479.8,254,479.8S479.8,378.5,479.8,254
	S378.5,28.2,254,28.2z"/>
            <path style="fill:var(--p-primary-500);" d="M254,451.6C145.1,451.6,56.4,363,56.4,254S145.1,56.4,254,56.4S451.6,145,451.6,254
	S362.9,451.6,254,451.6z"/>
            <path style="fill:var(--p-dark-primary-300);" d="M207.4,345.6c3.9,0,7.6-1.3,10.8-3.9l93.4-73.8c4.3-3.4,6.7-8.4,6.7-13.9s-2.4-10.5-6.7-13.9
	l-93.4-73.8c-3.2-2.6-6.9-3.9-10.8-3.9c-8.8,0-17.8,6.6-17.8,17.7v147.7C189.6,338.9,198.7,345.6,207.4,345.6L207.4,345.6z"/>
            <g>
	<path style="fill:var(--p-dark-primary-900);" d="M254,0C113.9,0,0,113.9,0,254s113.9,254,254,254s254-113.9,254-254S394.1,0,254,0z M254,479.8
		C129.5,479.8,28.2,378.5,28.2,254S129.5,28.2,254,28.2S479.8,129.5,479.8,254S378.5,479.8,254,479.8z"/>
              <path style="fill:var(--p-dark-primary-900);" d="M329.2,218l-93.4-73.8c-8.2-6.5-18-10-28.3-10c-25.4,0-46,20.6-46,46v147.7c0,25.3,20.7,46,46,46
		l0,0c10.3,0,20.1-3.4,28.3-9.9l93.4-73.8c11.1-8.8,17.4-21.9,17.4-36C346.6,239.9,340.3,226.8,329.2,218z M311.7,267.9l-93.4,73.8
		c-3.2,2.6-6.9,3.9-10.8,3.9c-8.8,0-17.8-6.6-17.8-17.7v-17.4h22c7.8,0,14.1-6.3,14.1-14.1c0-7.8-6.3-14.1-14.1-14.1h-22V254H254
		c7.8,0,14.1-6.3,14.1-14.1s-6.3-14.1-14.1-14.1h-64.4v-45.6c0-11.1,9.1-17.7,17.8-17.7c3.9,0,7.6,1.3,10.8,3.9l93.4,73.8
		c4.3,3.4,6.7,8.4,6.7,13.9C318.4,259.4,315.9,264.5,311.7,267.9z"/>
</g>
</svg>
        </template>
      </GameCallToActionCard>
      <template v-if="roomStore.games.length">
        <GameCallToActionCard
          :headingText="roomStore.getLastCompletedGame.name"
          buttonText="Replay"
          :buttonStyle="{
            backgroundColor: `var(--p-surface-900)`,
            borderColor: `var(--p-surface-900)`,
            color: `var(--p-green-500)`,
          }"
          :cardStyle="{
            backgroundColor: `var(--p-green-500)`,
            borderColor: `var(--p-green-500)`,
            color: `var(--p-surface-900)`,
          }"
          icon="pi-history"
          @buttonClicked="handleReplayGame"
        >
          <template #icon>
            <svg height="4.9rem" width="4.9rem" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                 viewBox="0 0 392.598 392.598" xml:space="preserve">
<g>
	<path style="fill:var(--p-dark-primary-900);" d="M382.488,286.384c-3.62-3.62-9.438-4.267-13.77-1.422c-30.19,20.105-65.552,30.707-102.077,30.707
		c-45.64,0-88.76-16.485-122.634-46.61l23.725-23.725c7.37-8.21,1.487-18.166-7.758-18.618H40.96
		c-6.012,0-10.925,4.848-10.925,10.925v118.95c0.517,10.279,12.024,14.222,18.618,7.758l24.76-24.76
		c37.947,34.263,86.626,53.01,138.085,53.01c55.143,0,125.285-23.014,172.154-92.444
		C386.69,295.822,386.108,290.069,382.488,286.384z M211.692,370.747c-49.325,0-95.741-19.265-130.586-54.109
		c-4.073-4.073-11.378-4.073-15.451,0L51.95,330.343v-81.842h81.778l-13.059,13.059c-4.202,4.59-4.461,10.99,0,15.451
		c39.046,39.047,90.893,60.509,146.036,60.509c21.85,0,43.378-3.426,63.806-10.02C297.219,355.426,255.651,370.747,211.692,370.747z
		"/>
  <path style="fill:var(--p-dark-primary-900);" d="M248.605,123.475L224.88,147.2c-7.37,8.21-1.487,18.166,7.758,18.618h119.014
		c6.012,0,10.925-4.848,10.925-10.925V35.943c-0.517-10.279-12.024-14.222-18.618-7.758l-24.76,24.76
		C281.122,18.683,232.508,0,180.985,0C125.841,0,55.829,23.014,8.831,92.444c-2.909,4.331-2.327,10.02,1.422,13.77
		c3.62,3.62,9.438,4.267,13.77,1.422C54.213,87.531,89.575,76.929,126.1,76.929C171.611,76.865,214.795,93.349,248.605,123.475z
		 M180.92,21.786c49.325,0,95.741,19.265,130.586,54.109c4.073,4.073,11.378,4.073,15.451,0l13.705-13.705v81.778h-81.778
		l13.059-13.059c4.202-4.59,4.461-10.99,0-15.451c-39.046-39.046-90.893-60.509-146.036-60.509c-21.851,0-43.378,3.426-63.806,10.02
		C95.393,37.107,136.96,21.786,180.92,21.786z"/>
</g>
              <path style="fill:var(--p-green-300);" d="M340.661,62.255L326.956,75.96c-4.073,4.073-11.378,4.073-15.451,0
	c-34.844-34.844-81.261-54.109-130.586-54.109c-43.96,0-85.592,15.192-118.82,43.248c20.428-6.659,41.891-10.02,63.806-10.02
	c55.143,0,107.055,21.463,146.036,60.509c4.461,4.396,4.202,10.796,0,15.451l-13.059,12.994h81.778L340.661,62.255L340.661,62.255z"
              />
              <path style="fill:var(--p-dark-primary-300);" d="M81.041,316.638c34.844,34.844,81.261,54.109,130.586,54.109c43.96,0,85.592-15.192,118.82-43.249
	c-20.428,6.659-41.891,10.02-63.806,10.02c-55.143,0-107.055-21.463-146.036-60.509c-4.461-4.396-4.202-10.796,0-15.451
	l13.059-13.059H51.95v81.778l13.705-13.705C69.728,312.566,76.968,312.566,81.041,316.638z"/>
</svg>
          </template>
        </GameCallToActionCard>
      </template>
    </div>
    <div class="flex flex-col items-center gap-4" v-else>
      <h2 class="text-3xl font-bold">Create a lobby</h2>
      <NuxtLink to="/rooms/players/add">
        <Button
            class="h-16 w-16"
            icon="pi pi-users"
            severity="primary"
            aria-label="Create lobby"
        />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import GameCallToActionCard from "~/components/game/GameCallToActionCard.vue";

const roomStore = useRoomStore();
const router = useRouter();

const handleReplayGame = () => {
  const lastCompletedGame = roomStore.getLastCompletedGame;

  roomStore.startGame(
      lastCompletedGame.name,
      lastCompletedGame.startScore,
      lastCompletedGame.endingScore,
      lastCompletedGame.winCondition,
      lastCompletedGame.lowestPossibleScore
  );

  router.push('/game');
}
</script>
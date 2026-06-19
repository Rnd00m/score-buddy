<template>
  <div class="flex flex-col gap-12">

  </div>
</template>

<script lang="ts" setup>
const router = useRouter();
const roomStore = useRoomStore();

router.push(roomStore.currentGame !== null ? '/game' : '/games');
</script>

<style scoped>

</style>
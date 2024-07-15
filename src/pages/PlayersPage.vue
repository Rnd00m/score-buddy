<template>
  <q-page class="row items-center justify-center">
    <players-component />
  </q-page>
</template>

<script setup lang="ts">
import PlayersComponent from 'components/players/PlayersComponent.vue';

defineOptions({
  name: 'PlayersPage'
});
</script>

<template>
  <div class="color-picker-wrapper">
    <q-btn
      v-for="color in colors"
      :key="color.name"
      :style="{
        color: color.textColor,
        backgroundColor: color.value
      }"
      class="col"
    >
      {{ color.name }}
    </q-btn>
  </div>
</template>

<script setup lang="ts">
import { colors } from 'components/models';
</script>

<style scoped lang="sass">
.color-picker-wrapper
  grid-template-columns: repeat(2, minmax(0, 1fr))
  display: grid
  row-gap: 1rem
  column-gap: 1rem
</style>

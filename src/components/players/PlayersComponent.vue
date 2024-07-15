<template>
  <div class="q-pa-md">
    <q-table
      class="sticky-header-column-table"
      flat
      bordered
      title="Players"
      :rows="store.players"
      :columns="columns"
      row-key="name"
      hide-bottom
    />
  </div>
</template>

<script setup lang="js">

import { useGameStore } from 'stores/game-store';

const store = useGameStore();

const columns = [
  {
    name: 'name',
    required: true,
    label: 'Name',
    field: 'name',
    align: 'left'
  },
  {
    name: 'color',
    required: true,
    label: 'Color',
    field: 'color',
  },
  {
    name: 'score',
    required: true,
    label: 'Score',
    field: 'score',
    sortable: true,
    sort: (a, b) => a - b
  }
];
</script>

<style lang="sass">
.sticky-header-column-table
  max-width: 100vw

  tr th
    position: sticky
    /* higher than z-index for td below */
    z-index: 2

  /* this will be the loading indicator */

  thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
    /* highest z-index */
    z-index: 3

  thead tr:first-child th
    top: 0
    z-index: 1

  tr:first-child th:first-child
    /* highest z-index */
    z-index: 3

  td:first-child
    z-index: 1

  td:first-child, th:first-child
    min-width: 200px
    position: sticky
    left: 0

  /* prevent scrolling behind sticky top row on focus */

  tbody
    /* height of all previous header rows */
    scroll-margin-top: 48px
</style>

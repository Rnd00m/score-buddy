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
    >
      <template v-slot:body-cell-color="props">
        <q-td :props="props">
          <q-btn
            icon="edit"
            round
            size=".75rem"
            :style="{
              color: props.row.color.textColor,
              backgroundColor: props.row.color.value
            }"
            @click="isColorPickerOpen = true"
          />

          <q-dialog
            v-model="isColorPickerOpen"
          >
            <q-card style="width: 700px; max-width: 80vw;">
              <q-card-section>
                <div class="text-h6">Pick a color</div>
              </q-card-section>

              <q-card-section class="q-pt-none">
                <color-picker-component
                  :playerId="props.row.id"
                  @playerColorUpdated="isColorPickerOpen = false"
                />
              </q-card-section>

              <q-card-actions align="right" class="bg-white text-teal">
                <q-btn flat label="Cancel" v-close-popup />
              </q-card-actions>
            </q-card>
          </q-dialog>
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="js">
import { useGameStore } from 'stores/game-store';
import { ref } from 'vue';
import ColorPickerComponent from './ColorPickerComponent.vue';

const store = useGameStore();
const isColorPickerOpen = ref(false);

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
    min-width: 160px
    position: sticky
    left: 0

  tbody
    /* height of all previous header rows */
    scroll-margin-top: 48px
</style>

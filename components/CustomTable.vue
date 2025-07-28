<template>
  <v-data-table
    :headers="headers"
    :items="items"
    :items-per-page="5"
    class="elevation-1"
  >
    <template v-slot:item.image="{ item }">
      <slot name="item.image" :item="item" />
    </template>

    <template v-slot:item.actions="{ item }">
      <slot name="item.actions" :item="item" />
    </template>
  </v-data-table>
</template>

<script setup>
defineProps({
  headers: Array,
  items: Array,
});
</script>

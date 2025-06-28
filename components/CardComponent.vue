<template>
  <v-dialog v-model="dialog" width="500">
    <v-card class="pa-4">
      <v-img :src="selectedItem.image"></v-img>
      <p>{{ selectedItem.name }}</p>
      <p>{{ selectedItem.description }}</p>
      <p>{{ selectedItem.isDestroyed }}</p>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    name: "CardComponent",
    props: {
      dialog: {
        type: Boolean,
        required: true,
      },
      selectedItem: {
        type: Object,
        required: true,
      },
    },
  }
</script>

<template>
  <v-container>
    <h2>Hello Planet {{ this.$route.params.id }}</h2>
  </v-container>
</template>

<script>
  export default {
    name: "PlanetsPage",
  }
</script>

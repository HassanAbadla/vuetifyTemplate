<template>
  <v-container>
    <h2>Re-usable Components Lesson</h2>
  </v-container>
</template>

<script>
  export default {
    name: "ComponentLesson",
    compnents: {},
    layout: "default",
    data() {
      return {
        first_name: "",
        last_name: "",

        item: {
          id: 1,
          first_name: "John",
          last_name: "Doe",
        },

        items: [
          {
            id: 1,
            first_name: "Hassan",
            last_name: "Doe",
          },
          {
            id: 2,
            first_name: "Alaa",
            last_name: "Doe",
          },
          {
            id: 3,
            first_name: "Youssif",
            last_name: "Doe",
          },
        ],
      }
    },

    methods: {
      change() {
        this.first_name = "Hassan"
        this.items[0].first_name = "Hassan"
      },
    },

    computed: {},
  }
</script>

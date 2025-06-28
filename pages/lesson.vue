<template>
  <v-container>
    <h1>This is the lesson page</h1>
    <h4>layouts</h4>
    <p>paragraph</p>
    <span>span</span>
    <small>small</small>

    <v-text-field v-model="first_name" label="First name"></v-text-field>
    <v-text-field v-model="last_name" label="last name"></v-text-field>
    <v-btn color="primary" @click="change">Change First Name</v-btn>
    <p>{{ first_name }}</p>
    <p>{{ last_name }}</p>

    <v-container>
      <v-card>
        <p>{{ item.first_name }} -- {{ item.last_name }}</p>
      </v-card>
    </v-container>
    <v-card>
      <div v-for="item in items" :key="item.id">
        <p>{{ item.first_name }} {{ item.last_name }}</p>
      </div>
    </v-card>

    <div>
      <p>Hassan Dow</p>
      <p>Hassan Dow</p>
    </div>
  </v-container>
</template>

<script>
  export default {
    name: "lesson",
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

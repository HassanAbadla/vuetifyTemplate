<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="12" md="12">
      <v-card class="logo py-4 d-flex justify-center">
        <NuxtLogo />
        <VuetifyLogo />
      </v-card>
      <v-card class="ma-4 pa-4">
        <v-chip>Lesson 1</v-chip>
        <v-btn class="mx-2" fab dark small color="primary">
          <v-icon dark> mdi-minus </v-icon>
        </v-btn>
      </v-card>
      <v-card>
        <v-card-title class="headline">
          Welcome to the Vuetify + Nuxt.js template
        </v-card-title>
        <v-card-text>
          <p>
            Vuetify is a progressive Material Design component framework for
            Vue.js. It was designed to empower developers to create amazing
            applications.
          </p>
          <p>
            For more information on Vuetify, check out the
            <a
              href="https://google.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              documentation
            </a>
          </p>
          <p>
            If you have questions, please join the official
            <a
              href="https://chat.vuetifyjs.com/"
              target="_blank"
              rel="noopener noreferrer"
              title="chat"
            >
              discord
            </a>
          </p>
          <p>
            Find a bug? Report it on the github
            <a
              href="https://github.com/vuetifyjs/vuetify/issues"
              target="_blank"
              rel="noopener noreferrer"
              title="contribute"
            >
              issue board
            </a>
          </p>
          <p>
            Thank you for developing with Vuetify and I look forward to bringing
            more exciting features in the future.
          </p>
          <div class="text-xs-right">
            <em><small>&mdash; John Leider</small></em>
          </div>
          <hr class="my-3" />
          <a
            href="https://nuxtjs.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Nuxt Documentation
          </a>
          <br />
          <a
            href="https://github.com/nuxt/nuxt.js"
            target="_blank"
            rel="noopener noreferrer"
          >
            Nuxt GitHub
          </a>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" nuxt to="/inspire"> Continue </v-btn>
        </v-card-actions>
      </v-card>

      <!-- API Demo Section -->
      <v-card class="mt-4">
        <v-card-title>API Demo</v-card-title>
        <v-card-text>
  
        </v-card-text>
      </v-card>
      <v-card v-if="planets.length > 0" class="mt-4">
        <v-data-table
          :headers="headers"
          :items="planets"
          :per-page="5"
          :search="search"
          class="elevation-1"
        >
          <template v-slot:top>
            <v-text-field
              v-model="search"
              label="Search (UPPER CASE ONLY)"
              class="mx-4"
            ></v-text-field>
          </template>
          <template v-slot:item.image="{ item }">
            <v-img :src="item.image" max-height="50" max-width="50"></v-img>
          </template>
          <template v-slot:item.isDestroyed="{ item }">
            <v-chip :color="item.isDestroyed ? 'red' : 'green'" dark>
              {{ item.isDestroyed ? "Destroyed" : "Not Destroyed" }}
            </v-chip>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-btn
              color="primary"
              @click="() => $router.push(`/planets/${item.id}`)"
            >
              View Details
            </v-btn>
          </template>
        </v-data-table>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
  import { mapState, mapActions } from "vuex"
  export default {
    name: "IndexPage",
    data() {
      return {
        search: "",
        loading: false,
        apiResponse: [],
        apiError: [],
        headers: [
          { text: "ID", value: "id" },
          { text: "Planet Image", value: "image" },
          { text: "Planet Name", value: "name" },
          { text: "Description", value: "description" },
          { text: "isDestroyed", value: "isDestroyed" },
          { text: "Actions", value: "actions" },
        ],
      }
    },

    methods: {
      ...mapActions(["fetchData"]),
      // async fetchData() {
      //   this.loading = true
      //   this.apiResponse = []
      //   this.apiError = []

      //   try {
      //     // Example API call using the configured axios instance
      //     const response = await this.$axios.get(
      //       "https://dragonball-api.com/api/planets"
      //     )
      //     this.apiResponse = response.data.items
      //   } catch (error) {
      //     this.apiError = error.message
      //   } finally {
      //     this.loading = false
      //   }
      // },
    },
    computed: {
      ...mapState(["planets"]),
    },
    watcch: {},
    async mounted() {
      await this.fetchData()
      // You can perform any initial setup here if needed
    },
  }
</script>

<style>
  .labelTrue {
    color: red;
    font-weight: bold;
  }
</style>

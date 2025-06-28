<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
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
          <v-btn color="success" :loading="loading" @click="fetchData">
            Test API Call
          </v-btn>
          <v-alert v-if="apiResponse" type="success" class="mt-3">
            API Response: {{ apiResponse }}
          </v-alert>
          <div v-for="item in apiResponse" :key="item.id" class="pa-4">
            <v-card class="d-inline-flex pa-2">
              <v-img max-height="150" max-width="250" :src="item.image"></v-img>
              <p>Name: {{ item.name }}</p>
              <p>Description: {{ item.description }}</p>
              <p>isDestroyed: {{ item.isDestroyed }}</p>
            </v-card>
            <v-divider class="ma-4"></v-divider>
          </div>
          <v-alert v-if="apiError" type="error" class="mt-3">
            API Error: {{ apiError }}
          </v-alert>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
  export default {
    name: "IndexPage",
    data() {
      return {
        loading: false,
        apiResponse: null,
        apiError: null,
      }
    },

    methods: {
      async fetchData() {
        this.loading = true
        this.apiResponse = null
        this.apiError = null

        try {
          // Example API call using the configured axios instance
          const response = await this.$axios.get(
            "https://dragonball-api.com/api/planets"
          )
          this.apiResponse = response.data.items
        } catch (error) {
          this.apiError = error.message
        } finally {
          this.loading = false
        }
      },
    },
    computed: {},
    watcch: {},
    mounted() {
      // You can perform any initial setup here if needed
    },
  }
</script>

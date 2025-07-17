<template>
  <div>
    <v-row>
      <v-col class="text-center">
        <img src="/v.png" alt="Vuetify.js" class="mb-5" />
        <blockquote class="blockquote">
          &#8220;First, solve the problem. Then, write the code.&#8221;
          <footer>
            <small>
              <em>&mdash;John Johnson</em>
            </small>
          </footer>
        </blockquote>
      </v-col>
    </v-row>
    <div>
      <v-btn @click="getData">Click Me</v-btn>
    </div>
    <!-- <v-card>{{ apiResponse }}</v-card> -->
    <div v-for="item in products" :key="item.id" class="pa-4">
      <v-card class="d-inline-flex pa-2">
        <v-img max-height="150" max-width="250" :src="item.image"></v-img>
        <p>Title: {{ item.title }}</p>
        <p>Description: {{ item.description }}</p>
        <p>Price: {{ item.price }}<span>$</span></p>
      </v-card>
      <v-divider class="ma-4"></v-divider>
    </div>
    <v-divider class="my-5"></v-divider>
    <h2>Planets</h2>
    <div v-for="item in planets" :key="item.id" class="pa-4">
      <v-card class="d-inline-flex pa-2">
        <v-img max-height="150" max-width="250" :src="item.image"></v-img>
        <p>Title: {{ item.name }}</p>
        <p>Description: {{ item.description }}</p>
        <p>Price: {{ item.isDestroyed }}<span>$</span></p>
      </v-card>
      <v-divider class="ma-4"></v-divider>
    </div>
  </div>
</template>

<script>
  import { mapState, mapActions } from "vuex"
  export default {
    name: "InspirePage",
    data() {
      return {
        apiResponse: null,
        apiError: null,
      }
    },
    methods: {
      ...mapActions(["getProducts", "fetchData"]),
      // async getData() {
      //   try {
      //     const response = await this.$axios.$get(
      //       "https://fakestoreapi.com/products"
      //     )
      //     this.apiResponse = response
      //     console.log(response)
      //   } catch (error) {
      //     console.error(error)
      //   }
      // },
    },
    computed: {
      ...mapState(["products", "planets"]),
    },
    async mounted() {
      await this.getProducts()
      await this.fetchData()
    },
  }
</script>

<style></style>

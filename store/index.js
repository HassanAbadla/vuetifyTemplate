export const state = () => ({
  planets: [],
  products: [],
})
export const mutations = {
  setPlanets(state, planets) {
    state.planets = planets
  },
  setProducts(state, products) {
    state.products = products
  },
}

export const actions = {
  async fetchData() {
    try {
      // Example API call using the configured axios instance
      const response = await this.$axios.get(
        "https://dragonball-api.com/api/planets"
      )
      // Commit the response data to the state
      this.commit("setPlanets", response.data.items)
      return response.data.items
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      console.log("Data loaded successfully")
    }
  },

  async getProducts() {
    try {
      const response = await this.$axios.get(
        "https://fakestoreapi.com/products"
      )
      this.commit("setProducts", response.data)
    } catch (error) {
      console.error("Error fetching products:", error)
    }
  },
}

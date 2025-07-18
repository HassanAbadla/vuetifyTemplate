export const state = () => ({
  planets: [],
  products: [],
  foods: [],
  orders: [],
  orderItems: [],
});
export const mutations = {
  setPlanets(state, planets) {
    state.planets = planets;
  },
  setProducts(state, products) {
    state.products = products;
  },
  newProduct(state, product) {
    state.products.unshift(product);
  },
  remove_product(state, id) {
    state.products = state.products.filter((product) => product.id !== id);
  },
  setFoods(state, foods) {
    state.foods = foods;
  },
  New_dish(state, food) {
    state.foods.unshift(food);
  },

  Update_food(state, food) {
    const index = state.foods.findIndex((f) => f.id === food.id);
    if (index !== -1) {
      state.foods.splice(index, 1, food);
    }
  },
  remove_food(state, id) {
    state.foods = state.foods.filter((food) => food.id !== id);
  },
  setOrders(state, orders) {
    state.orders = orders;
  },
  setOrderItems(state, orderItems) {
    state.orderItems = orderItems;
  },
  removeOrder(state, id) {
    state.orders = state.orders.filter((order) => order.id !== id);
  },

  setOrderItem(state, orderItem) {
    state.orderItems.push(orderItem);
  },
  updateOrderItem(state, { id, item }) {
    const index = state.orderItems.findIndex(
      (orderItem) => orderItem.id === id
    );
    if (index !== -1) {
      state.orderItems.splice(index, 1, item);
    }
  },
};

export const actions = {
  async fetchData() {
    try {
      // Example API call using the configured axios instance
      const response = await this.$axios.get(
        "https://dragonball-api.com/api/planets"
      );
      // Commit the response data to the state
      this.commit("setPlanets", response.data.items);
      return response.data.items;
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      console.log("Data loaded successfully");
    }
  },

  async getProducts({ commit }) {
    try {
      const response = await this.$axios.get("https://dummyjson.com/products");
      console.log("Products fetched successfully:", response.data.products);

      commit("setProducts", response.data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  },
  async createProduct({ commit }, product) {
    console.log("Creating product:", product);

    try {
      let item = product;
      commit("newProduct", item); // Update the products state with the new product
      const response = await this.$axios.post(
        "https://dummyjson.com/products/add",
        product
      );
    } catch (error) {
      console.error("Error creating product:", error);
    }
  },
  async deleteProduct({ commit }, item) {
    console.log("Removing product:", item);
    try {
      // Assuming you have an API endpoint to delete the product
      await this.$axios.delete(`https://dummyjson.com/products/${item.id}`);
      commit("remove_product", item.id);
      console.log("Product removed successfully");
    } catch (error) {
      console.error("Error removing product:", error);
    }
  },

  // Food API actions
  async fetchFood({ commit }) {
    try {
      const response = await this.$axios.get(
        "https://food.outcropmediaa.com/api/foods"
      );
      console.log("Food fetched successfully:", response.data);
      commit("setFoods", response.data);
    } catch (error) {
      console.error("Error fetching food:", error);
    }
  },
  async createFood({ commit }, food) {
    console.log("Creating food:", food);

    try {
      let item = food;

      const response = await this.$axios.post(
        "https://food.outcropmediaa.com/api/foods",
        food
      );
      commit("New_dish", response.data); // Update the foods state with the new food item
      console.log("Food created successfully:", response.data);
    } catch (error) {
      console.error("Error creating food:", error);
    }
  },
  async updateFood({ commit }, food) {
    console.log("Updating food:", food);

    try {
      const response = await this.$axios.put(
        `https://food.outcropmediaa.com/api/foods/${food.id}`,
        food
      );
      commit("Update_food", response.data); // Update the foods state with the updated food item
      console.log("Food updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating food:", error);
    }
  },
  async deleteFood({ commit }, itemId) {
    console.log("Removing food:", itemId);
    try {
      // Assuming you have an API endpoint to delete the food item
      await this.$axios.delete(
        `https://food.outcropmediaa.com/api/foods/${itemId}`
      );
      commit("remove_food", itemId);
      console.log("Food removed successfully");
    } catch (error) {
      console.error("Error removing food:", error);
    }
  },
  // orders actions
  async fetchOrders({ commit }) {
    try {
      const response = await this.$axios.get(
        "https://food.outcropmediaa.com/api/orders"
      );
      commit("setOrders", response.data.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  },

  // order items
  async fetchOrderItems({ commit }) {
    try {
      const response = await this.$axios.get(
        "https://food.outcropmediaa.com/api/order-items"
      );
      commit("setOrderItems", response.data.data);
    } catch (error) {
      console.error("Error fetching order items:", error);
    }
  },

  async createOrderItem({ commit }, orderItem) {
    console.log("Creating order item:", orderItem);

    try {
      const response = await this.$axios.post(
        "https://food.outcropmediaa.com/api/order-items",
        orderItem
      );
      commit("setOrderItem", response.data.data); // Update the order items state with the new item
      console.log("Order item created successfully:", response.data);
    } catch (error) {
      console.error("Error creating order item:", error);
    }
  },
  async deleteOrder({ commit }, item) {
    console.log("Removing order:", item);
    try {
      // Assuming you have an API endpoint to delete the order
      await this.$axios.delete(
        `https://food.outcropmediaa.com/api/orders/${item.id}`
      );
      commit("removeOrder", item.id);
      console.log("Order removed successfully");
    } catch (error) {
      console.error("Error removing order:", error);
    }
  },
  async updateOrderItem({ commit }, { id, item }) {
    console.log("Removing order item:", item);
    try {
      // Assuming you have an API endpoint to delete the order item
      await this.$axios.put(
        `https://food.outcropmediaa.com/api/order-items/${id}`,
        item
      );
      commit("updateOrderItem", { id, item });
      console.log("Order item update successfully");
    } catch (error) {
      console.error("Error update order item:", error);
    }
  },
};

<template>
  <div>
    <v-card flat>
      <div class="d-flex justify-space-between align-center my-4">
        <h2>Orders</h2>
        <v-btn @click.stop="drawer = !drawer">Add an Order</v-btn>
      </div>
      <v-data-table
        :headers="headers"
        :items="orderItems"
        :items-per-page="5"
        class="elevation-1"
      >
        <template v-slot:item.actions="{ item }">
          <v-btn icon small @click.stop="openDialog(item)">
            <v-icon small>mdi-eye</v-icon>
          </v-btn>
        </template>
        <!-- image -->
        <template v-slot:item.image="{ item }">
          <v-img :src="item.food.image" max-height="50" max-width="50"></v-img>
        </template>
      </v-data-table>
    </v-card>
    <v-navigation-drawer v-model="drawer" absolute temporary right width="500">
      <v-card class="pa-4 ma-2">
        <v-card-title>Add Order Item</v-card-title>
        <v-card-text>
          <v-form>
            <v-select
              v-model="orderForm.order_id"
              label="Order Number"
              item-text="id"
              item-value="id"
              :items="orders"
              required
            ></v-select>
            <v-select
              v-model="orderForm.food_id"
              label="Food Item"
              item-text="name"
              item-value="id"
              :items="foods"
              required
            ></v-select>
            <v-text-field
              v-model="orderForm.quantity"
              label="Quantity"
              type="number"
              required
            ></v-text-field>
            <v-text-field
              v-model="orderForm.price"
              label="Price"
              type="number"
              required
            ></v-text-field>
            <v-card-actions class="mt-4 d-flex align-center w-100">
              <v-btn
                color="primary"
                @click="submitOrderItem"
                class="w-50"
                width="200"
                >Send</v-btn
              >
              <v-btn @click="closeDrawer" width="200">Cancel</v-btn>
            </v-card-actions>
          </v-form>
        </v-card-text>
      </v-card>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  name: "OrdersPage",
  data() {
    return {
      drawer: false,
      orderForm: {
        order_id: null,
        food_id: null,
        quantity: 1,
        price: 0,
      },
      headers: [
        { text: "Order ID", value: "order_id" },
        { text: "Image", value: "image" },
        { text: "item", value: "food.name" },
        { text: "Quantity", value: "quantity" },
        { text: "Price", value: "price" },
        { text: "Actions", value: "actions", sortable: false },
      ],
    };
  },
  methods: {
    ...mapActions([
      "fetchOrders",
      "fetchOrderItems",
      "fetchFood",
      "createOrderItem",
      "deleteOrder",
    ]),
    submitOrderItem() {
      this.$store.dispatch("createOrderItem", this.orderForm);
      this.drawer = false;
    },
    closeDrawer() {
      this.drawer = false;
      this.orderForm = {
        order_id: null,
        food_id: null,
        quantity: 1,
        price: 0,
      };
    },
  },
  computed: {
    ...mapState(["orders", "orderItems", "foods"]),
  },
  mounted() {
    this.fetchFood();
    this.fetchOrders();
    this.fetchOrderItems();
  },
};
</script>

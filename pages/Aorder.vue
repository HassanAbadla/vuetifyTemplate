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
          <v-btn icon small @click="viewOrderDetails(item)">
            <v-icon small>mdi-eye</v-icon>
          </v-btn>

          <v-btn icon small @click="removeOrder(item)">
            <v-icon small>mdi-delete</v-icon>
          </v-btn>

          <v-btn icon small @click="editOrderDialog(item)">
            <v-icon small>mdi-pencil</v-icon>
          </v-btn>
        </template>

        <!-- image -->
        <template v-slot:item.image="{ item }">
          <v-img :src="item.food.image" max-height="50" max-width="50"></v-img>
        </template>
      </v-data-table>
    </v-card>

    <!-- Dialog Component -->
    <v-dialog v-model="dialog" max-width="400px">
      <v-card>
        <v-card-title class="headline">Order Details</v-card-title>
        <v-card-text v-if="SelectedItem">
          <div>
            <v-img
              :src="SelectedItem.food?.image"
              max-height="100"
              max-width="100"
              class="mb-4"
              cover
            ></v-img>
          </div>
          <div><strong>Order ID:</strong> {{ SelectedItem.order_id }}</div>
          <div><strong>Food:</strong> {{ SelectedItem.food?.name }}</div>
          <div><strong>Quantity:</strong> {{ SelectedItem.quantity }}</div>
          <div><strong>Price:</strong> {{ SelectedItem.price }}</div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="dialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!--<v-dialog v-model="dialog" max-width="400px">
      <v-card>
        <v-card-title class="headline">Details</v-card-title>
        <v-card-text> Here are the details you wanted to view. </v-card-text>

        <v-card-actions>
          <v-btn color="primary" text @click="dialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>-->

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
      dialog: false,
      drawer: false,
      SelectedItem: {},
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
      "updateOrderItem",
    ]),
    submitOrderItem() {
      this.$store.dispatch("createOrderItem", this.orderForm);
      this.drawer = false;
      this.orderForm = {
        order_id: null,
        food_id: null,
        quantity: 1,
        price: 0,
      };
    },
    //submitOrderItem() {
    // const itemId = this.SelectedItem.id;
    // this.updateOrderItem({
    //   id: itemId,
    //   data: this.orderForm,
    // });
    // this.drawer = false;
    //},
    closeDrawer() {
      this.drawer = false;
      this.orderForm = {
        order_id: null,
        food_id: null,
        quantity: 1,
        price: 0,
      };
    },
    viewOrderDetails(item) {
      this.SelectedItem = item;
      this.dialog = true;
    },
    async removeOrder(item) {
      await this.deleteOrder({ id: item.order_id });
    },

    editOrderDialog(item) {
      this.SelectedItem = item;
      this.orderForm = {
        order_id: item.order_id,
        food_id: item.food_id,
        quantity: item.quantity,
        price: item.price,
      };
      this.drawer = true;
    },
  },
  computed: {
    ...mapState(["orders", "orderItems", "foods"]),
  },
  mounted() {
    this.fetchFood();
    this.fetchOrders();
    this.fetchOrderItems();

    this.createOrderItem();
  },
};
</script>

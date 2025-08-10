<template>
  <v-card flat>
    <div class="d-flex justify-space-between align-center my-4">
      <h2>Orders 2</h2>
      <v-btn color="primary" @click="openForm()">Create Order</v-btn>
    </div>
    <!-- Custom Table Component -->
    <custom-table :headers="headers" :items="orderItems">
      <template v-slot:item.image="{ item }">
        <v-img :src="item?.food?.image" max-height="50" max-width="50"></v-img>
      </template>

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
    </custom-table>
    <!-- Order Form Dialog -->
    <order-form
      :dialog.sync="dialog"
      :order="selectedOrder"
      :isEdit="isEdit"
      @update:dialog="dialog = $event"
      @save="handleSave"
      :orders="orders"
      :foods="foods"
    ></order-form>
    <!-- Dialog Component -->
    <v-dialog v-model="viewDialog" max-width="400px">
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
          <v-btn color="primary" text @click="viewDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import { mapState, mapActions } from "vuex";
import CustomTable from "@/components/CustomTable.vue";
import orderForm from "@/components/orderForm.vue";

export default {
  // Define the component name
  name: "Orders2",
  // Define the component's emits to allow parent components to listen for events
  components: { CustomTable, orderForm },
  // Define props to receive dialog state and selected order
  props: {
    dialog: Boolean,
    selectedOrder: Object,
    isEdit: Boolean,
  },
  data() {
    return {
      dialog: false,
      selectedOrder: null,
      isEdit: false,
      SelectedItem: null,
      viewDialog: false,
      // Initialize the form data for creating or editing an order
      orderForm: {
        order_id: null,
        food_id: null,
        quantity: 1,
        price: 0,
      },
      // Define the headers for the custom table
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
    // Open the order form dialog with the selected order or a new order

    openForm(order = null) {
      // console.log("Open form clicked");
      this.selectedOrder = order;
      //this.isEdit = !!order;
      this.dialog = true;
    },

    handleSave(order) {
      if (this.isEdit) {
        this.$store.dispatch("updateOrderItem", order);
      } else {
        this.$store.dispatch("createOrderItem", order);
      }
      this.dialog = false;
      this.selectedOrder = null;
      this.fetchOrderItems();
      this.isEdit = false;
    },

    editOrderDialog(item) {
      // Open the order form dialog for editing an existing order item
      console.log("Editing order item:", item);
      this.openForm(item);
      // Set the selected item for editing
      this.SelectedItem = item;
      //Populate the order form with the selected item's data
      this.orderForm = {
        order_id: item.order_id,
        food_id: item.food.id,
        quantity: item.quantity,
        price: item.price,
      };
      this.isEdit = true;
      this.dialog = true;
      // Logic to open a dialog for editing an order item
      console.log("Editing order item:", item);
      console.log("Opening edit dialog for:", item);
    },
    // Method to view order details (optional, can be implemented as needed)
    // This can be used to open the form in view-only mode
    viewOrderDetails(item) {
      this.SelectedItem = item;
      this.viewDialog = true;
    },
    // Method to remove an order item
    async removeOrder(item) {
      if (!confirm("Are you sure you want to delete this order?")) return;
      await this.deleteOrder({ id: item.order_id });
      this.$toast.success("Order deleted successfully");
      // Refresh the order items after deletion
      this.fetchOrderItems(); // refresh
      this.dialog = false;
    },
  },

  computed: {
    ...mapState(["orders", "orderItems", "foods"]),
  },
  mounted() {
    this.fetchFood();
    this.fetchOrders();
    this.fetchOrderItems();
    //this.createOrderItem();
    //this.deleteOrder();
    //this.updateOrderItem();
  },
};
</script>

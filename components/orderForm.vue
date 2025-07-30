<template>
  <v-dialog v-model="internalDialog" max-width="500px" persistent>
    <v-card>
      <v-card-title>
        <span class="text-h6">{{ isEdit ? "Edit" : "Add" }} Order</span>
      </v-card-title>
      <v-card-text>
        <!-- Form fields for order creation/editing -->
        <v-select
          v-model="form.order_id"
          :items="orders"
          item-text="id"
          item-value="id"
          label="Select Order"
          required
        ></v-select>
        <v-select
          v-model="form.food_id"
          :items="foods"
          item-text="name"
          item-value="id"
          label="Select Food Item"
          required
        ></v-select>
        <v-text-field
          v-model="form.quantity"
          type="number"
          label="Quantity"
          min="1"
          required
        ></v-text-field>
        <v-text-field
          v-model="form.price"
          type="number"
          label="Price"
          min="0"
          required
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" @click="submit">Save</v-btn>
        <v-btn @click="close">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  // Define the component name
  name: "OrderForm",
  // Define the component's emits to allow parent components to listen for events
  emits: ["update:dialog", "save"],

  // Define props to receive dialog state, order data, and food items
  props: {
    dialog: Boolean,
    order: Object,
    isEdit: Boolean,
    orders: Array,
    foods: Array,
  },
  data() {
    return {
      internalDialog: false,

      // Initialize the form data for creating or editing an order
      orderForm: {
        order_id: null,
        food_id: null,
        quantity: 1,
        price: 0,
      },
    };
  },
  computed: {
    isEdit() {
      return !!this.order?.id;
    },
    form() {
      return this.order
        ? { ...this.order }
        : {
            order_id: null,
            food_id: null,
            quantity: 1,
            price: 0,
          };
    },
  },
  // Watch for changes in the dialog prop to update the internal dialog state
  // This allows the dialog to be reactive to changes in the parent component
  watch: {
    dialog(val) {
      this.internalDialog = val;
    },
    internalDialog(val) {
      this.$emit("update:dialog", val);
    },
    // Watch for changes in the order prop to update the form
    // This allows the form to be reactive to changes in the order prop
    order: {
      handler(val) {
        this.form = val
          ? { ...val }
          : {
              order_id: null,
              food_id: null,
              quantity: 1,
              price: 0,
            };
      },
      immediate: true,
    },
  },
  methods: {
    // Submit the form data
    // This method is called when the Save button is clicked
    submit() {
      this.$emit("save", { ...this.form });
      this.close();
    },
    // Close the dialog and reset the form
    // This method is called when the Cancel button is clicked
    close() {
      this.internalDialog = false;
    },
  },
};
</script>

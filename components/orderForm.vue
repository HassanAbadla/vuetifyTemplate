<template>
  <v-dialog v-model="dialog" max-width="600px" persistent>
    <v-card>
      <v-card-title>
        <span class="text-h6">{{ isEdit ? 'Edit Order' : 'Add Order' }}</span>
      </v-card-title>

      <v-card-text>
        <v-form ref="form" @submit.prevent="submitForm">
          <v-select
            v-model="form.orderId"
            :items="orders"
            item-text="name"
            item-value="id"
            label="Select Order"
            required
          />

         <v-select
            v-model="form.foodId"
            :items="foods"
            item-text="name"
            item-value="id"
            label="Select Item"
            required
          />

          <v-text-field
            v-model.number="form.quantity"
            label="Quantity"
            type="number"
            required
          />

          <v-text-field
            v-model="form.price"
            label="Price"
            type="number"
            required
          />
          <v-card-actions class="justify-end">
            <v-btn color="primary" type="submit">Save</v-btn>
            <v-btn text @click="close">Cancel</v-btn>
          </v-card-actions>

        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "OrderForm",

  props: {
    dialog: Boolean,
    order: Object,
    isEdit: Boolean,
    orders: Array,
    foods: Array,
    },
  emits: ["update:dialog", "submit"],


  data() {
    return {
      form: {
        orderId: null,
        foodId: null,
        quantity: 1,
        price: 0,
      },
    };
  },
  watch: {
    immediate: true,
      handler(order) {
        if (order) {
          this.form = { ...order };
        } else {
          this.form = {
            orderId: null,
            foodId: null,
            quantity: 1,
            price: 0,
          };
        }
      },
  },
  methods: {
    submitForm() {
      this.$emit("submit", { ...this.form });
      this.close();
    },
    close() {
      this.$emit("update:dialog", false);
    },
  },
};
</script>

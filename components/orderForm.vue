<template>
  <v-dialog v-model="dialog" max-width="600px" persistent>
    <v-card>
      <v-card-title>
        <span class="text-h6">{{ formTitle }}</span>
      </v-card-title>

      <v-card-text>
        <v-form ref="form" @submit.prevent="submitForm">
          <v-text-field
            v-model="form.customer"
            label="Customer"
            required
          ></v-text-field>

         <v-text-field
            v-model="form.image"
            label="Image URL"
            required
          ></v-text-field>

          <v-text-field
            v-model.number="form.total"
            label="Total"
            type="number"
            required
          ></v-text-field>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="submitForm">Save</v-btn>
        <v-btn text @click="cancel">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "OrderForm",
  props: {
    existingOrder: {
      type: Object,
      default: null,
    },
    formTitle: {
      type: String,
      default: "Order Form",
    },
  },
  data() {
    return {
      dialog: true,
      form: {
        customer: "",
        total: 0,
        image: "",
      },
    };
  },
  watch: {
    existingOrder: {
      immediate: true,
      handler(order) {
        if (order) {
          this.form = { ...order };
        } else {
          this.form = {
            customer: "",
            total: 0,
            image: "",
          };
        }
      },
    },
  },
  methods: {
    submitForm() {
      this.$emit("submit", { ...this.form });
      this.dialog = false;
      this.$emit("close");
    },
    cancel() {
      this.dialog = false;
      this.$emit("close");
    },
  },
};
</script>

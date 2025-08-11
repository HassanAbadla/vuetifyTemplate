<template>
  <v-data-table
    :headers="headers"
    :items="items"
    :items-per-page="5"
    class="elevation-1"
    item-value="id"
  >
    <template v-slot:item="{ item, index }">
      <tr>
        <td v-for="header in headers" :key="header.value">
          <slot :name="`item.${header.value}`" :item="item">
            {{ header.value.split(".").reduce((o, key) => o?.[key], item) }}
          </slot>
        </td>
      </tr>
    </template>

    <!-- <template v-slot:item.image="{ item }">
      <slot name="item.image" :item="item" />
    </template>

    <template v-slot:item.actions="{ item }">
      <slot name="item.actions" :item="item" />
    </template>-->
  </v-data-table>
</template>

<script>
export default {
  name: "CustomTable",
  props: {
    headers: Array,
    items: Array,
    //ordersList: Array,
  },
  methods: {
    async updateOrder(item, newOrderId) {
      item.orderNumber = newOrderId;

      try {
        await this.$axios.put("/api/orders/${item.id}", {
          orderNumber: newOrderId,
        });
        console.log("Order updated successfully");
      } catch (error) {
        console.error("Error updating order:", error);
      }
    },
  },
};
</script>

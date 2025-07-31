<template>
    <v-container>
      <div class="d-flex justify-space-between align-center mb-4">
        <h2>Orders 2</h2>
        <v-btn @click="openForm(null)">Add Order</v-btn>
      </div>
  <!--use custom table-->
      <custom-table
        :headers="headers"
        :items="orders"
        @edit="openForm"
        @delete="deleteOrder"
      >
      <template #item.image="{ item }">
        <v-img :src="item.image" width="50" height="50" class="rounded" />
      </template>

      <template #item.actions="{ item }">
        <v-btn icon @click="$emit('edit', item)" @click.native.prevent="openForm(item)">
          <v-icon color="primary">mdi-pencil</v-icon>
        </v-btn>
        <v-btn icon @click="$emit('delete', item)" @click.native.prevent="confirmDelete(item)">
          <v-icon color="red">mdi-delete</v-icon>
        </v-btn>
      </template>
      </custom-table>

      <orderForm
      :dialog="showForm"
      :order="selectedOrder"
      :isEdit="!!selectedOrder"
      :orders="orders"
      :foods="foods"
     @update:dialog="showForm = $event"
     @submit="handleSubmit"
    />
    </v-container>
  </template>
  
  <script>
  import CustomTable from '../components/CustomTable.vue'
  import { mapState, mapActions } from "vuex"
  import orderForm from '../components/orderForm.vue'

  export default{
    components:{CustomTable, orderForm},
  data(){
    return {
      
      headers: [
      { text: 'Order ID', value: 'orderID' },
      { text: 'Image', value: 'image' },
      { text: 'Item', value: 'item' },
      { text: 'Quantity', value: 'quantity' },
      { text: 'Price', value: 'price' },
      { text: 'Actions', value: 'actions', sortable: false }
      ],
      showForm: false,
      selectedOrder: null,
    }
  },
  computed:{
    ...mapState(['orders','foods'])
  },
   async mounted() {
      try {
        await this.fetchOrders();
        await this.fetchFoods();
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    },
  methods:{
    ...mapActions(['fetchOrders','fetchFoods','deleteOrder', 'addOrder', 'updateOrder']),

    openForm(order) {
      if (order) {
        this.selectedOrder = { ...order }
      } else {
        this.selectedOrder = null
      }
      this.showForm = true
    },
    closeForm() {
      this.showForm = false
      this.selectedOrder = null
    },
    async handleSubmit(orderData) {
      try {
        if (this.selectedOrder) {
      
          await this.updateOrder({ id: this.selectedOrder.id, ...orderData })
        } else {
        
          await this.addOrder(orderData)
        }
        await this.fetchOrders()
        this.closeForm()
      } catch (error) {
        console.error("Error submitting order:", error)
      }
    }

  }
}
</script>
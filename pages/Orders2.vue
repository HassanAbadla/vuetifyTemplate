<template>
    <v-container>
      <div class="d-flex justify-space-between align-center mb-4">
        <h2>Orders2</h2>
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
      </custom-table>
      <orderForm
      v-if="showForm"
      :existingOrder="selectedOrder"
      :formTitle="selectedOrder ? 'Edit Order' : 'Add New Order'"
      @submit="handleSubmit"
      @close="closeForm"
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
        { text: 'ID', value: 'id' },
        { text: 'Customer', value: 'customer' },
        { text: 'Image', value: 'image' },
        { text: 'Total', value: 'total' },
        { text: 'Actions', value: 'actions', sortable: false }
      ],
      showForm: false,
      selectedOrder: null,
    }
  },
  computed:{
    ...mapState(['orders'])
  },
   async mounted() {
      try {
        await this.fetchOrders()
      } catch (error) {
        console.error("Error fetching foods:", error)
      }
    },
  methods:{
    ...mapActions(['fetchOrders','deleteOrder', 'addOrder', 'updateOrder']),

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
          // تحديث الطلب
          await this.updateOrder({ id: this.selectedOrder.id, ...orderData })
        } else {
          // إضافة طلب جديد
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
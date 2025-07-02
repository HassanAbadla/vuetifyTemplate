<template>
  <v-container>
    <h1>Products</h1>
    <v-btn @click="openProductModal">Create Product</v-btn>
    <v-card>
      <v-data-table
        :headers="headers"
        :items="products"
        :per-page="5"
        :search="search"
        class="elevation-1"
      >
        <template v-slot:top>
          <v-text-field
            v-model="search"
            label="Search Products"
            class="mx-4"
          ></v-text-field>
        </template>
        <template v-slot:item.images="{ item }">
          <v-img
            v-for="(image, idx) in item.images"
            :key="idx"
            :src="image"
            max-height="50"
            max-width="50"
          ></v-img>
        </template>
        <template v-slot:item.actions="{ item }">
          <div class="d-flex justify-center">
            <v-btn
              icon
              small
              @click="() => $router.push(`/products/${item.id}`)"
            >
              <v-icon small>mdi-eye</v-icon>
            </v-btn>
            <v-btn icon small @click="editProductDialog(item)">
              <v-icon small>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon small @click="removeProduct(item)">
              <v-icon small>mdi-delete</v-icon>
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- Creat Product Form Modal -->
    <v-dialog v-model="productModal" max-width="600px">
      <v-card>
        <v-card-title>Create Product</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="product.title"
            label="Product Name"
          ></v-text-field>
          <v-text-field
            v-model="product.description"
            label="Description"
          ></v-text-field>
          <v-text-field
            v-model="product.price"
            label="Price"
            type="number"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="addProduct">Save</v-btn>
          <v-btn @click="productModal = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
  import { mapState, mapActions } from "vuex"
  export default {
    name: "ProductsIndex",
    head() {
      return {
        title: "Products",
        meta: [
          { name: "description", content: "Browse our products" },
          { name: "keywords", content: "products, shop, buy" },
        ],
      }
    },
    data() {
      return {
        productModal: false,
        search: "",
        headers: [
          { text: "ID", value: "id" },
          { text: "Product Image", value: "images" },
          { text: "Product Name", value: "title" },
          { text: "Description", value: "description" },
          { text: "Price", value: "price" },
          { text: "Actions", value: "actions" },
        ],
        product: {
          title: "",
          description: "",
          price: 0,
        },
      }
    },
    methods: {
      ...mapActions(["getProducts", "createProduct", "deleteProduct"]),
      openProductModal() {
        this.productModal = true
      },
      async addProduct() {
        let data = {
          title: this.product.title,
          description: this.product.description,
          price: this.product.price,
        }
        await this.createProduct(data)
        this.product = {
          title: "",
          description: "",
          price: 0,
        }
        this.productModal = false
      },
      async removeProduct(item) {
        await this.deleteProduct(item)
      },
      editProductDialog(item) {
        this.product = {
          title: item.title,
          description: item.description,
          price: item.price,
        }
        this.productModal = true
      },
    },
    computed: {
      ...mapState(["products"]),
    },
    async mounted() {
      await this.getProducts()
    },
  }
</script>

<template>
  <v-container>
  
    <div class="d-flex justify-space-between align-center mb-4">
      <h2>Food</h2>
      <v-btn @click="openFormDialog">Add a Dish</v-btn>
    </div>
    <CustomTable :headers="headers" :items="foods">
  <!-- image -->
  <template #item.image="{ item }">
    <v-img :src="item.image" max-width="80" />
  </template>

  <!-- actions -->
  <template #item.actions="{ item }">
    <v-btn icon @click="openDialog(item)">
      <v-icon>mdi-eye</v-icon>
    </v-btn>
    <v-btn icon @click="openEditDialog(item)">
      <v-icon>mdi-pencil</v-icon>
    </v-btn>
    <v-btn icon @click="openConfermDialog(item)">
      <v-icon>mdi-delete</v-icon>
    </v-btn>
  </template>
</CustomTable>
    <!-- add dish dialog -->
    <v-dialog v-model="foodForm" max-width="600px" persistent>
      <v-card>
        <v-card-title>{{ editForm ? "Edit Dish" : "Add a Dish" }}</v-card-title>
        <v-card-text>
          <v-text-field v-model="item.name" label="Dish Name"></v-text-field>
          <v-text-field
            v-model="item.description"
            label="Dish Details"
          ></v-text-field>
          <v-text-field
            v-model="item.price"
            label="Price"
            type="number"
          ></v-text-field>
          <v-text-field v-model="item.image" label="Image"></v-text-field>
          <v-text-field
            v-model="item.ingredients"
            label="Ingredients (comma separated)"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="submitDish">{{
            editForm ? "Update" : "Add"
          }}</v-btn>
          <v-btn @click="closFormDialog">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- confirm dialog -->
    <v-dialog v-model="confirmDialog" max-width="400px">
      <v-card>
        <v-card-title>Confirm Deletion</v-card-title>
        <v-card-text>
          Are you sure you want to delete {{ selectedItem.name }} dish?
        </v-card-text>
        <v-card-actions>
          <v-btn color="red" @click="removeFood(selectedItem.id)">Delete</v-btn>
          <v-btn @click="closFormDialog">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>

  import { mapState, mapActions } from "vuex"
  import CustomTable from "../components/CustomTable.vue"
  export default {
    name: "FoodPage",
    components:{CustomTable},
    data() {
      return {
        foodForm: false,
        editForm: false,
        selectedItem: {},
        confirmDialog: false,
        item: {
          image: "",
          name: "",
          description: "",
          price: 0,
          ingredients: [],
        },
        headers: [
         { text: "name", value: "name" },
         { text: "price", value: "price" },
         { text: "image", value: "image" },
         { text: "actions", value: "actions", sortable: false }
],
      }
    },
    methods: {
      ...mapActions(["fetchFood", "createFood", "updateFood", "deleteFood"]),

      //  View details
      openDialog(item) {
        // Logic to open a dialog with item details
        console.log("Opening dialog for:", item)
      },
      openFormDialog() {
        this.foodForm = true
      },
      async submitDish() {
        !this.editForm
          ? (this.item.ingredients = this.item.ingredients
              .split(",")
              .map((ingredient) => ingredient.trim()))
          : (this.item.ingredients = this.item.ingredients)
        this.editForm
          ? await this.updateFood(this.item)
          : await this.createFood(this.item)
        this.foodForm = false
        this.item = {
          image: "",
          name: "",
          description: "",
          price: 0,
          ingredients: [],
        }
      },
      openEditDialog(item) {
        console.log("Editing item:", item)

        this.editForm = true
        this.foodForm = true
        this.item = { ...item }
        // Logic to open a dialog for editing an item
        console.log("Opening edit dialog for:", item)
      },
      closFormDialog() {
        this.editForm = false
        this.foodForm = false
        this.item = {
          image: "",
          name: "",
          description: "",
          price: 0,
          ingredients: [],
        }
      },
      openConfermDialog(item) {
        this.selectedItem = item
        this.confirmDialog = true
      },
      closeConfirmDialog() {
        this.confirmDialog = false
      },
      async removeFood(id) {
        try {
          await this.deleteFood(id)
          this.confirmDialog = false
          this.selectedItem = {}
        } catch (error) {
          console.error("Error deleting food:", error)
        }
      },
    },
    computed: {
      ...mapState(["foods"]),
    },
    async mounted() {
      try {
        await this.fetchFood()
      } catch (error) {
        console.error("Error fetching foods:", error)
      }
    },
  }
</script>

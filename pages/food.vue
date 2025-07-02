<template>
    <div>
        <h1> Hello in Food Page</h1>
        <v-btn color="primary" @click="dialog = true">Add Food</v-btn>
        <v-dialog v-model="dialog" max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline">Add Food Item</span>
                </v-card-title>
                <v-card-text>
                    <v-form ref="form" v-model="valid">
                        <v-text-field v-model="newFood.name" :rules="nameRules" label="Food Name" required />
                        <v-text-field v-model="newFood.description" label="Description" required />
                        <v-text-field v-model="newFood.price" :rules="priceRules" label="Food Price" required />
                        <v-text-field v-model="newFood.image" :rules="imageRules" label="Food Image URL" required />
                        <v-text-field v-model="newFood.ingredientsInput" label="Ingredients (comma separated)"
                            required />
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="primary" @click="addFood">Add</v-btn>
                    <v-btn @click="dialog = false">Cancel</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <div class="mt-4 d-flex flex-wrap" v-if="selectedItems.length">
            <FoodComponent v-for="item in selectedItems" :key="item.id" :selectedItem="item" @edit="openEditDialog"
                @delete="deleteFoodItem" />
        </div>
        <div v-else>
            <p>No foods available.</p>
        </div>

        <!-- Edit Food Dialog -->
        <v-dialog v-model="editDialog" max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline">Edit Food Item</span>
                </v-card-title>
                <v-card-text>
                    <v-form ref="editForm" v-model="editValid">
                        <v-text-field v-model="editFood.name" :rules="nameRules" label="Food Name" required />
                        <v-text-field v-model="editFood.description" label="Description" required />
                        <v-text-field v-model="editFood.price" :rules="priceRules" label="Food Price" required />
                        <v-text-field v-model="editFood.image" :rules="imageRules" label="Food Image URL" required />
                        <v-text-field v-model="editFood.ingredientsInput" label="Ingredients (comma separated)"
                            required />
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="primary" @click="saveEditFood">Save</v-btn>
                    <v-btn @click="editDialog = false">Cancel</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>

import FoodComponent from '../components/FoodComponent.vue'
import { mapState, mapActions } from 'vuex'


export default {
    name: 'food',
    layout: 'default',
    components: {
        FoodComponent
    },
    data() {
        return {
            dialog: false,
            editDialog: false,
            loading: false,
            apiResponse: [],
            apiError: null,
            valid: false,
            editValid: false,
            newFood: {
                name: '',
                description: '',
                price: '',
                image: '',
                ingredientsInput: '',
            },
            editFood: {
                id: null,
                name: '',
                description: '',
                price: '',
                image: '',
                ingredientsInput: '',
            },
            nameRules: [v => !!v || 'Name is required'],
            priceRules: [v => !!v || 'Price is required', v => !isNaN(parseFloat(v)) || 'Price must be a number'],
            imageRules: [v => !!v || 'Image URL is required'],
        }
    },
    computed: {
        ...mapState(['foods']),
        selectedItems() {
            return this.foods || [];
        }
    },
    methods: {
        ...mapActions({
            fetchFoods: 'fetchFoods',
            createFood: 'createFood',
            deleteFood: 'deleteFood',
            editFoodAction: 'editFood'
        }),
        async addFood() {
            if (this.$refs.form.validate()) {
                const newId = this.selectedItems.length ? Math.max(...this.selectedItems.map(f => f.id)) + 1 : 1;
                const food = {
                    id: newId,
                    name: this.newFood.name,
                    description: this.newFood.description,
                    price: parseFloat(this.newFood.price).toFixed(2),
                    image: this.newFood.image,
                    ingredients: this.newFood.ingredientsInput.split(',').map(s => s.trim()).filter(Boolean)
                };
                await this.createFood(food);
                this.dialog = false;
                this.$refs.form.reset();
                this.newFood = { name: '', description: '', price: '', image: '', ingredientsInput: '' };
            }
        },
        async deleteFoodItem(id) {
            await this.deleteFood(id);
        },
        openEditDialog(item) {
            this.editFood = {
                id: item.id,
                name: item.name,
                description: item.description,
                price: item.price,
                image: item.image,
                ingredientsInput: (item.ingredients || []).join(', ')
            };
            this.editDialog = true;
        },
        async saveEditFood() {
            if (this.$refs.editForm.validate()) {
                const updatedFood = {
                    id: this.editFood.id,
                    name: this.editFood.name,
                    description: this.editFood.description,
                    price: parseFloat(this.editFood.price).toFixed(2),
                    image: this.editFood.image,
                    ingredients: this.editFood.ingredientsInput.split(',').map(s => s.trim()).filter(Boolean)
                };
                await this.editFoodAction(updatedFood);
                this.editDialog = false;
            }
        }
    },
    async mounted() {
        await this.fetchFoods();
    },

}
</script>

<style scoped></style>
<template>
    <v-card class="pa-4 mx-auto" max-width="400">
        <v-img :src="selectedItem.image"></v-img>
        <div class="d-flex justify-space-between align-center mb-2 pt-2">
            <p class="font-weight-bold">{{ selectedItem.name }}</p>
            <p class="font-weight-bold">{{ selectedItem.price }} $</p>
        </div>
        <p>{{ selectedItem.description }}</p>
        <v-btn icon color="red" class="mt-4" @click="$emit('delete', selectedItem.id)">
            <v-icon>mdi-delete</v-icon>
        </v-btn>
        <v-btn icon color="green" class="mt-4" @click="$emit('edit', selectedItem)">
            <v-icon>mdi-pen</v-icon>
        </v-btn>
    </v-card>
    <!-- <v-btn color="primary" class="mt-4">Add to Cart</v-btn> -->
</template>

<script>
export default {
    name: 'FoodComponent',
    props: {
        selectedItem: {
            type: Object,
            required: true
        },
    },
}
</script>

<style scoped></style>
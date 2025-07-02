<template>
    <div>
        <h1> Hello in Food Page</h1>
        <FoodComponent :selectedItem="selectedItem" />
    </div>
</template>

<script>
import FoodComponent from '../components/FoodComponent.vue'

export default {
    name: 'food',
    layout: 'default',
    components: {
        FoodComponent
    },
    data() {
        return {
            dialog: false,
            loading: false,
            apiResponse: [],
            apiError: null,
            selectedItem: {
                id: 1,
                name: 'Makloba',
                description: 'A traditional Middle Eastern dish',
                price: 12.99,
                image: 'https://t4.ftcdn.net/jpg/02/57/02/67/360_F_257026750_ckdlvzplvocnCn8aGQhdD8tZ430O4hgX.jpg'
            },
        }
    },
    
}
</script>

<style scoped></style>
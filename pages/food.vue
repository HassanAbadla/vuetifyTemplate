<template>
    <div>
        <h1> Hello in Food Page</h1>
        <div v-if="selectedItems.length">
            <FoodComponent v-for="item in selectedItems" :key="item.id" :selectedItem="item" />
        </div>
        <div v-else>
            <p>No foods available.</p>
        </div>
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
            loading: false,
            apiResponse: [],
            apiError: null,
            selectedItems: [],
        }
    },
    computed: {
        ...mapState(['foods'])
    },
    methods: {
        ...mapActions(['fetchFoods'])
    },
    async mounted() {
        await this.fetchFoods()
        this.selectedItems = this.foods || []
    },
    
}
</script>

<style scoped></style>
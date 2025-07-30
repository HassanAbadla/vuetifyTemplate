<template>
    <v-data-table
        :headers="headers"
        :items="items"
        class="elevation-1"
     >
     <!-- Slot for image -->
     <template v-slot:item.image="{ item }">
      <slot name="item.image" :item="item" />
    </template>
    <!-- Slot for actions -->
    <template v-slot:item.actions="{ item }">
      <slot name="item.actions" :item="item" >
  
  <v-btn icon @click="$emit('edit', item)">
    <v-icon>mdi-pencil</v-icon>
  </v-btn>
  <v-btn icon @click="$emit('delete', item.id)">
    <v-icon>mdi-delete</v-icon>
  </v-btn>
  </slot>
  </template>
    </v-data-table>
</template>
<script>
export default{
    name:'CustomTable',
    props:{
        headers:Array,
        items:Array,
    }
}
</script>
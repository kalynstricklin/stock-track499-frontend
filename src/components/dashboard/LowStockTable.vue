<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getStatusColor, showSnackbar, snackbar } from '@/utils/utils'
import { auth } from '@/firebase'
import {
  fetchInventoryRequest, type InventoryItem
} from '@/server/services/InventoryHandler'


const headers = [
  { title: 'Part Name', key: 'part_name', sortable: true },
  { title: 'Part Number', key: 'part_number', sortable: true },
  { title: 'Current Stock', key: 'stock_level', sortable: true },
  { title: 'Price', key: 'outbound_price', sortable: true },
  { title: 'Status', key: 'status', sortable: true },
];

const lowStockItems = ref<InventoryItem[]>([])


async function initialize() {

  if(!auth.currentUser){
    showSnackbar('No authenticated user found.', 'error');
    return;
  }

  showSnackbar('User Authenticated', 'success')
  try{
    const token = await auth.currentUser.getIdToken();

    const inventoryItems = await fetchInventoryRequest(token);
    console.log('inventory items', inventoryItems)
    lowStockItems.value = inventoryItems.filter((item: any) => item.status === 'Low Stock');

    showSnackbar('Loaded low stock items!', 'success');
  } catch (error: any) {
    showSnackbar(`Error loading inventory: ${error.message}`, 'error');
  }
}

onMounted(() => {
  initialize();
});
</script>


<template>
  <v-data-table
    :headers="headers"
    :items="lowStockItems"
    item-value="part_number"
  >

    <!--  status styling -->
    <template v-slot:item.status="{ value }">
      <v-chip :color="getStatusColor(value)">
        {{ value }}
      </v-chip>
    </template>

    <template v-slot:item.outbound_price="{ value }">
      {{value.toFixed(2) }}
    </template>


    <!--    title of table-->
    <template v-slot:top>
      <v-toolbar flat>
        <v-card-title class="d-flex align-center pe-2">Low Stock Items</v-card-title>
      </v-toolbar>
    </template>

  </v-data-table>

  <!-- Reorder snackbar -->
  <v-snackbar v-model="snackbar.visible" :timeout="snackbar.timeout" location="top" :color="snackbar.color">
    {{ snackbar.message }}
  </v-snackbar>
</template>


<style scoped>
.search-bar {
  margin: 16px;
  width: 500px;
}
</style>
<script setup lang="ts">
import { ref, computed, nextTick, onMounted } from 'vue'
import { getStatusColor, showSnackbar, snackbar } from '@/utils/utils'
import { auth } from '@/firebase'
import {
  fetchInventoryRequest, type InventoryItem
} from '@/server/services/InventoryHandler'
//import { createOrderRequest } from '@/server/services/OrdersHandler'



const headers = [
  { title: 'Part Name', key: 'part_name', sortable: true },
  { title: 'Part Number', key: 'part_number', sortable: true },
  { title: 'Current Stock', key: 'stock_level', sortable: true },
  // { title: 'Reorder Level', key: 'reorder_point', sortable: true },
  { title: 'Price', key: 'outbound_price', sortable: true },
  { title: 'Status', key: 'status', sortable: true },
  // { title: 'Action', key: 'action', sortable: false }
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

const actionItem = (item: InventoryItem) => {
  console.log('Reorder action for:', item.part_number);
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

    <template v-slot:item.outbound_price="{ value }">
      {{ '$' + value }}
    </template>

    <!--  Display current stock quantity and reorder level -->
    <template v-slot:item.stock_level="{ value }">
      <v-chip>{{ value }}</v-chip>
    </template>

    <!--    title of table-->
    <template v-slot:top>
      <v-toolbar flat>
        <v-card-title class="d-flex align-center pe-2">Low Stock Items</v-card-title>
      </v-toolbar>
    </template>

<!--    &lt;!&ndash; Action buttons &ndash;&gt;-->
<!--    <template v-slot:item.action="{ item }">-->
<!--      <v-icon-->
<!--        v-if="role === 'manager' || role === 'admin'"-->
<!--        dark-->
<!--        elevation="0"-->
<!--        size="small"-->
<!--        class="me-2"-->
<!--        icon="mdi-alert"-->
<!--        @click="actionItem(item)"-->
<!--      ></v-icon>-->
<!--    </template>-->
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
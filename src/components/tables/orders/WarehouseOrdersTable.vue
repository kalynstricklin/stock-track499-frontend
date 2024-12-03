<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getStatusColor, showSnackbar } from '@/utils/utils'
import { auth } from '@/firebase'
import { fetchOrderRequest, type Order } from '@/server/services/OrdersHandler'


const headers = [
  { title: 'Purchase Order ID', key: 'PO_number' },
  { title: 'Part Number', key: 'part_number' },
  { title: 'Supplier', key: 'supplier_id' },
  { title: 'Order Date', key: 'created' },
  { title: 'Delivery Date', key: 'due_date' },
  { title: 'Quantity', key: 'qty' },
  // { title: 'Unit Price', key: 'inbound_price' },
  { title: 'Total', key: 'value' },
  { title: 'Status', key: 'status' },
];

const order = ref<Order[]>([])


async function initialize() {

  if(!auth.currentUser){
    showSnackbar('No authenticated user found.', 'error');
    return;
  }


  try{
    const token = await auth.currentUser.getIdToken();

    const warehouseOrders = await fetchOrderRequest(token);
    if(warehouseOrders){
      order.value = Array.isArray(warehouseOrders) ? warehouseOrders : [];
      showSnackbar(`Loaded all warehouse orders!`, 'success');

    }else{
      showSnackbar(`Error loading warehouse orders!`, 'error');

    }

  }catch(error: any){
    showSnackbar(`Error loading warehouse orders: ${error.message}`, 'error');
  }
}

// search bar
const search = ref('')

//when component is mounted data will load
onMounted(() => {
  initialize();
});

</script>


<template>
    <v-data-table
      v-model:search="search"
      :headers="headers"
      :items="order"
      item-value="orderId"
      :filter-keys="['product_name','supplier_ID', 'part_number', 'PO_number', 'status', 'order_date', 'due_date', 'received_date', 'manufacturer_ID']"
    >
      <template v-slot:item.PO_number="{ value }">
        {{ '#' + value }}
      </template>

      <template v-slot:item.status="{ value }">
        <v-chip :color="getStatusColor(value)">
          {{ value }}
        </v-chip>
      </template>

      <template v-slot:item.value="{ value }">
          {{'$' + value }}
      </template>


      <template v-slot:top>
        <v-toolbar flat>
          <v-card-title class="d-flex align-center pe-2">Warehouse Orders</v-card-title>
        </v-toolbar>

        <!-- Search Orders -->
        <v-text-field
          v-model="search"
          density="compact"
          label="Search Orders"
          prepend-inner-icon="mdi-magnify"
          variant="solo-filled"
          class="search-bar"
          hide-details
          single-line
        ></v-text-field>

      </template>
    </v-data-table>

</template>

<style scoped>
.search-bar {
  margin: 16px;
  width: 500px;
}

</style>
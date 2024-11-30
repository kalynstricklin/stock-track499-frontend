<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getStatusColor, showSnackbar } from '@/utils/utils'
import { auth } from '@/firebase'
import { type Order } from '@/server/services/OrdersHandler'


const headers = [
  { title: 'Purchase Order ID', key: 'PO_number' },
  { title: 'Product Name', key: 'product_name' },
  { title: 'Part Number', key: 'part_number' },
  { title: 'Supplier', key: 'supplier_ID' },
  { title: 'Manufacturer', key: 'manufacturer_ID' },
  { title: 'Order Date', key: 'order_date' },
  { title: 'Delivery Date', key: 'due_date' },
  { title: 'Received Date', key: 'received_date' },
  { title: 'Quantity', key: 'qty' },
  { title: 'Unit Price', key: 'inbound_price' },
  { title: 'Total', key: 'total_cost' },
  { title: 'Status', key: 'status' },
];

const order = ref<Order[]>([])


async function initialize() {

  order.value = [
    {
      PO_number: 9,
      product_name: 'Nails',
      part_number: 233,
      supplier_ID: '233',
      manufacturer_ID: '33',
      order_date: '11-20-2023',
      due_date: '11-28-2023',
      received_date: '11-28-2023',
      qty: 15,
      inbound_price: 5,
      outbound_price: 7,
      customer_ID: 'Stock',
      total_cost: 105,
      status: 'Pending',
    },
    {
      PO_number: 8,
      product_name: 'Hammer',
      part_number: 234,
      supplier_ID: '234',
      manufacturer_ID: '34',
      order_date: '11-20-2023',
      due_date: '11-28-2023',
      received_date: '11-28-2023',
      qty: 10,
      inbound_price: 12,
      outbound_price: 15,
      customer_ID: 'Retail',
      total_cost: 150,
      status: 'Shipped',
    },
  ];

  // if(!auth.currentUser){
  //   return;
  // }
  //
  // const token = (await (auth.currentUser.getIdTokenResult())).token;
  //
  // try{
  //   const warehouseOrders = await fetchOrdersRequest(token);
  //   order.value = warehouseOrders;
  //   showSnackbar(`Loaded all warehouse orders!`, 'success');
  //
  // }catch(error: any){
  //   showSnackbar(`Error loading warehouse orders: ${error.message}`, 'error');
  // }
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

      <template v-slot:item.inbound_price="{ value }">
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
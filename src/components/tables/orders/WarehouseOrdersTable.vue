<script setup lang="ts">
import { ref, computed } from 'vue';
import { getStatusColor } from '@/utils/utils'


const headers = [
  { title: 'Purchase Order ID', key: 'PO_order' },
  { title: 'Product Name', key: 'product_name' },
  { title: 'Part Number', key: 'part_number' },
  { title: 'Supplier', key: 'supplier_ID' },
  { title: 'Manufacturer', key: 'manufacturer_ID' },
  { title: 'Order Date', key: 'order_date' },
  { title: 'Delivery Date', key: 'due_date' },
  { title: 'Received Date', key: 'received_date' },
  { title: 'Quantity', key: 'qty' },
  { title: 'Unit Price', key: 'inbound_price' },
  // { title: 'Total Cost', key: 'total_cost' },
  { title: 'Status', key: 'status' },
];

const order = ref([
  { PO_order: 9, product_name: "Nails", part_number: 233, supplier_ID: 233, manufacturer_ID: 233, order_date: '11-20-2023', due_date: '11-28-2023', received_date: '11-28-2023', qty: 15, inbound_price: 5, status: 'Pending'},
  { PO_order: 8, product_name: "Hammer", part_number: 233, supplier_ID: 233, manufacturer_ID: 233, order_date: '11-20-2023', due_date: '11-28-2023', received_date: '11-28-2023', qty: 15, inbound_price: 5, status: 'Pending'},
  { PO_order: 7, product_name: "Screws", part_number: 233, supplier_ID: 233, manufacturer_ID: 233, order_date: '11-20-2023', due_date: '11-28-2023', received_date: '11-28-2023', qty: 15, inbound_price: 5, status: 'Shipped'},
  { PO_order: 6, product_name: "Drill", part_number: 233, supplier_ID: 233, manufacturer_ID: 233, order_date: '11-20-2023', due_date: '11-28-2023', received_date: '11-28-2023', qty: 15, inbound_price: 5, status: 'Shipped'},
  { PO_order: 5, product_name: "Paint", part_number: 233, supplier_ID: 233, manufacturer_ID: 233, order_date: '11-20-2023', due_date: '11-28-2023', received_date: '11-28-2023', qty: 15, inbound_price: 5, status: 'Shipped'},
  { PO_order: 4, product_name: "Wire", part_number: 233, supplier_ID: 233, manufacturer_ID: 233, order_date: '11-20-2023', due_date: '11-28-2023', received_date: '11-28-2023', qty: 15, inbound_price: 5, status: 'Delivered'},
  { PO_order: 3, product_name: "Nails", part_number: 233, supplier_ID: 233, manufacturer_ID: 233, order_date: '11-20-2023', due_date: '11-28-2023', received_date: '11-28-2023', qty: 15, inbound_price: 5, status: 'Delivered'},
  { PO_order: 2, product_name: "Nails", part_number: 233, supplier_ID: 233, manufacturer_ID: 233, order_date: '11-20-2023', due_date: '11-28-2023', received_date: '11-28-2023', qty: 15, inbound_price: 5, status: 'Delivered'},
  { PO_order: 1, product_name: "Nails", part_number: 233, supplier_ID: 233, manufacturer_ID: 233, order_date: '11-20-2023', due_date: '11-28-2023', received_date: '11-28-2023', qty: 15, inbound_price: 5, status: 'Delivered'},
]);


// search bar
const search = ref('')


</script>


<template>
    <v-data-table
      v-model:search="search"
      :headers="headers"
      :items="order"
      item-value="orderId"
      :filter-keys="['product_name','supplier_ID', 'part_number', 'PO_order', 'status', 'order_date', 'due_date', 'received_date', 'manufacturer_ID']"
    >
      <template v-slot:item.PO_order="{ value }">
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
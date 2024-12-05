<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getStatusColor, showSnackbar } from '@/utils/utils'
import { auth } from '@/firebase'
import { fetchOrderRequest, type Order } from '@/server/services/OrdersHandler'
import { fetchUserRequest } from '@/server/services/UserHandler'


const headers = [
  { title: 'Order ID', key: 'PO_number' },
  { title: 'Part Number', key: 'part_number' },
  { title: 'Supplier ID', key: 'supplier_id' },
  { title: 'Order Date', key: 'created' },
  { title: 'Delivery Date', key: 'due_date' },
  { title: 'Quantity', key: 'qty' },
  // { title: 'Inbound Price', key: 'inbound_price' },
  { title: 'Total', key: 'value' },
  // { title: 'Status', key: 'status' },
];

const order = ref<Order[]>([])


//user roles
const role = ref('')

async function initialize() {

  if(!auth.currentUser){
    showSnackbar('No authenticated user found.', 'error');
    return;
  }


  try{
    const token = await auth.currentUser.getIdToken();

    //set user role
    let users = await fetchUserRequest(token);

    if (!users || users.length === 0) {
      return;
    }


    const currUser = users.find((u: any) => u.email === auth?.currentUser?.email);
    if(!currUser){
      showSnackbar('User role not found', 'info')
      return;
    }

    role.value = currUser.role;


    const allOrders = await fetchOrderRequest(token);

    if (!allOrders || allOrders.length === 0) {
      showSnackbar('No orders found.', 'info');
      return;
    }

    console.log('all orders', allOrders.message)

    const inbound_orders = allOrders.message.filter((order: any) => {

      return !order.is_outbound
    });
    order.value = Array.isArray(inbound_orders) ? inbound_orders : [];
    showSnackbar(`Loaded all warehouse orders!`, 'success');


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
      item-value="PO_number"
      :filter-keys="['supplier_id', 'part_number', 'PO_number', 'status', 'created', 'due_date', 'received_date']"
    >
      <template v-slot:item.PO_number="{ value }">
        {{ '#' + value }}
      </template>

<!--      <template v-slot:item.status="{ value }">-->
<!--        <v-chip :color="getStatusColor(value)">-->
<!--          {{ value }}-->
<!--        </v-chip>-->
<!--      </template>-->

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
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getStatusColor, showSnackbar } from '@/utils/utils'
import { auth } from '@/firebase'
import { fetchOrders, type Order } from '@/server/services/OrdersHandler'
import { fetchUserByUid } from '@/server/services/UserHandler'


const headers = [
  // { title: 'Order ID', key: 'po_number' },
  { title: 'Part Name', key: 'part_name' },
  { title: 'Part Number', key: 'part_number' },
  { title: 'Supplier ID', key: 'supplier_id' },
  { title: 'Order Date', key: 'created' },
  { title: 'Delivery Date', key: 'due_date' },
  { title: 'Quantity', key: 'qty' },
  // { title: 'Inbound Price', key: 'inbound_price' },
  { title: 'Total', key: 'value' },
  { title: 'Status', key: 'status' },
];

const order = ref<Order[]>([])


//user roles
const role = ref('')

async function initialize() {

  if(!auth.currentUser){
    showSnackbar('No authenticated user found.', 'error');
    return;
  }

  showSnackbar('User Authenticated', 'success')

  try{
    const token = await auth.currentUser.getIdToken();

    //set user role
    let user = await fetchUserByUid(auth.currentUser.uid, token);

    if (!user) {
      showSnackbar('No user found.', 'info');
      return;
    }

    role.value = user.role;

    const inbound_orders = await fetchOrders(token);

    if (!inbound_orders || inbound_orders.length === 0) {
      showSnackbar('No orders found.', 'info');
      return;
    }

    console.log('all orders', inbound_orders.message)

    // const inbound_orders = allOrders.message.filter((order: any) => {return !order.is_outbound});
    order.value = Array.isArray(inbound_orders.message) ? inbound_orders.message : [];
    showSnackbar(`Loaded all warehouse orders!`, 'success');

    order.value.forEach((ord) => {
      if (ord.status === 'Pending') {
        updateOrderStatus(ord);
      }
    });


  }catch(error: any){
    showSnackbar(`Error loading warehouse orders: ${error.message}`, 'error');
  }
}

// timer for order status
const updateOrderStatus = (order: Order) => {
  if (order.status === 'Pending') {
    setTimeout(() => {
      order.status = 'Shipped';
      showSnackbar(`Order #${order.po_number} status updated to Shipped.`, 'info');
    }, 5000); // 5 seconds for testing

    setTimeout(() => {
      order.status = 'Delivered';
      showSnackbar(`Order #${order.po_number} status updated to Delivered.`, 'info');
    }, 10000); // 10 seconds for testing
  }
};



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
      item-value="po_number"
      :filter-keys="['supplier_id', 'part_name','part_number', 'status', 'created', 'due_date', 'received_date']"
    >
      <template v-slot:item.po_number="{ value }">
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
<script setup lang="ts">
import { ref, computed, nextTick, onMounted } from 'vue'
import { getStatusColor, showSnackbar, snackbar } from '@/utils/utils'
import { auth } from '@/firebase'
import {
  createInventoryRequest,
  deleteInventoryRequest,
  editInventoryRequest, fetchInventoryRequest, type InventoryItem
} from '@/server/services/InventoryHandler'
import { createOrderRequest } from '@/server/services/OrdersHandler'


const headers =[
    { title: 'Product Name', key: 'product_name',   sortable: true, },
    { title: 'Part Number', key: 'part_number',   sortable: true, },
    { title: 'Item Sold', key: 'count',   sortable: true, },
    { title: 'Status', key: 'status',   sortable: true, },
    { title: 'Price', key: 'outbound_price',   sortable: true, },
    { title: 'Action', key: 'action', sortable: false },
  ];



const topSelling = ref([])


//user roles
const role = ref('admin')

async function initialize() {

  // if(!auth.currentUser){
  //   return;
  // }
  //
  // const token = (await (auth.currentUser.getIdTokenResult())).token;
  //
  // try{
  //   const inventoryItems = await fetchInventoryRequest(token);
  //   inventory.value = inventoryItems;
  //   showSnackbar(`Loaded all items in the inventory!`, 'success');
  //
  // }catch(error: any){
  //   showSnackbar(`Error loading inventory: ${error.message}`, 'error');
  // }
}

const actionItem = (item: any) =>{
  console.log('item')
}

//when component is mounted data will load
onMounted(() => {
  initialize();
});
</script>


<template>

    <v-data-table
      :headers="headers"
      :items="topSelling"
      item-value="part_number"
    >

      <template v-slot:item.outbound_price="{ value }">
        {{'$' + value}}
      </template>

      <!--  status styling -->
      <template v-slot:item.status="{ value }">
        <v-chip :color="getStatusColor(value)">
          {{ value }}
        </v-chip>
      </template>

      <!--    title of table-->
      <template v-slot:top>
        <v-toolbar flat>
          <v-card-title class="d-flex align-center pe-2">Top Selling Product</v-card-title>
        </v-toolbar>
      </template>



      <template v-slot:item.action="{ item }">
        <v-icon
          v-if="role === 'manager' || role === 'admin'"
          dark
          elevation="0"
          size="small"
          class="me-2"
          icon="mdi-dots-horizontal"
          @click="actionItem(item)"
        ></v-icon>
      </template>



    </v-data-table>



<!--  Re Order button snackbar-->
  <v-snackbar v-model="snackbar.visible" :timeout="snackbar.timeout" location="top" :color="snackbar.color">
    {{snackbar.message}}
  </v-snackbar>
</template>

<style scoped>
.search-bar {
  margin: 16px;
  width: 500px;
}
</style>
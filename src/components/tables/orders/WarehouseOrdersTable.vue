<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { getStatusColor, showSnackbar, snackbar } from '@/utils/utils'
import { auth } from '@/firebase'
import { editOrderRequest, fetchOrders, type Order } from '@/server/services/OrdersHandler'
import { fetchUserByUid } from '@/server/services/UserHandler'


const defaultOrder = {
  id: 0,
  part_name: '',
  part_number: 0,
  supplier_id: 0,
  qty: 0,
  due_date: new Date().toISOString().split('T')[0],
  created: new Date().toISOString().split('T')[0],
  value: 0,
  status: '',
  customer_id: '',
  is_outbound: false
};



const headers = computed (() => {
  const base = [

      { title: 'Order ID', key: 'id', sortable: true},

      { title: 'Part Name', key: 'part_name', sortable: true },
      { title: 'Part Number', key: 'part_number', sortable: true },
      { title: 'Supplier ID', key: 'supplier_id', sortable: true },
      { title: 'Order Date', key: 'created', sortable: true },
      { title: 'Delivery Date', key: 'due_date', sortable: true },
      { title: 'Quantity', key: 'qty', sortable: true },
      { title: 'Total', key: 'value', sortable: true },
      // {title: 'Employee', key: 'customer_id', sortable: true},
      {title: 'Employee', key: 'employee', sortable: true},
      { title: 'Status', key: 'status',  sortable: true },

  ];

  if(role.value === 'employee' || role.value==='manager' || role.value ==='admin'){
    base.push(
      { title: 'Edit', key: 'edit', sortable: false},
    )
  }

  return base;
})

const order = ref<Order[]>([])
const dialogEdit= ref(false);
const editedIndex = ref(-1);
const editedItem = ref({ ...defaultOrder });
const defaultItem = ref({ ...defaultOrder });

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

    //fetch all orders
    const inbound_orders = await fetchOrders(token);

    if (!inbound_orders.message || !inbound_orders || inbound_orders.message.length === 0) {
      showSnackbar('No orders found.', 'info');
      return;
    }

    const inbound = inbound_orders.message.filter((order: any) => {return !order.is_outbound});

    //update customer id from uid to username
    const updatedOrderWithUser = await Promise.all(inbound.map(async (order: any) =>{

      const customer = await fetchUserByUid(order.customer_id, token);
      return {
        ...order,
        employee: customer ? customer.username : 'Unknown Employee'
      }
    })
    );

    console.log('updated order', inbound)
    order.value = Array.isArray(updatedOrderWithUser) ? updatedOrderWithUser : [];
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


function editItem(item: any){
  editedIndex.value = order.value.indexOf(item)
  editedItem.value = {...item }
  dialogEdit.value= true
}



async function save() {

  //check if authorized user
  if(!auth.currentUser){
    showSnackbar('No authenticated user found.', 'error');
    return;
  }
  showSnackbar('User Authenticated', 'success')

  const originalItem = order.value[editedIndex.value];
  if (JSON.stringify(originalItem) === JSON.stringify(editedItem.value)) {
    showSnackbar('No changes made.', 'info');
    dialogEdit.value = false;
    return;
  }
  const index = order.value.findIndex(o => o.id === editedItem.value.id)

  editedItem.value.part_number = Number(editedItem.value.part_number);
  editedItem.value.qty = Number(editedItem.value.qty);


  try{
    const token = await auth.currentUser.getIdToken();

      const updatedItem = {
        ...editedItem.value,
        due_date: (new Date()).toISOString().split('T')[0],
        customer_id: auth.currentUser.uid
      }

      const response = await editOrderRequest(updatedItem, token);
      console.log('response', response)

      if(response === 'Success'){
        showSnackbar(`Order Status updated: ${updatedItem.id}`, 'success');
        order.value[index] = {...editedItem.value}
        close();
      }else{
        showSnackbar(`Failed to update order status: ${updatedItem.id}`, 'error');
      }
      close();


  } catch (error: any) {
    showSnackbar(`Error saving order: ${error.message}`, 'error');
  }
};

const close = () => {
  dialogEdit.value = false;
  nextTick(() => {
    editedItem.value = {...defaultItem.value};
  });
};

</script>


<template>
    <v-data-table
      v-model:search="search"
      :headers="headers"
      :items="order"
      item-value="id"
      :filter-keys="['id','supplier_id', 'part_name','part_number', 'status', 'created', 'due_date']"
    >
      <template v-slot:item.id="{ value }">
        {{ '#' + value }}
      </template>

      <template v-slot:item.status="{ value }">
        <v-chip :color="getStatusColor(value)">
          {{ value }}
        </v-chip>
      </template>

      <template v-slot:item.value="{ value }">
          {{'$' + (value).toFixed(2) }}
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



        <!--edit dialog-->
        <v-dialog v-model="dialogEdit" max-width="600px">
          <v-card>
            <v-card-title>
              Edit Status
            </v-card-title>
            <v-card-text>
              <v-row dense>
                <v-col cols="3">
                  <v-text-field
                    v-model="editedItem.id"
                    label="Order ID"
                    disabled
                  ></v-text-field>
                </v-col>
                <v-col cols="3">
                  <v-text-field
                    v-model="editedItem.part_number"
                    label="Part Number"
                    disabled
                  ></v-text-field>
                </v-col>
                <v-col cols="3">
                  <v-select
                    v-model="editedItem.status"
                    :items="['Pending', 'Received']"
                    label="Status"
                  ></v-select>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text="Cancel" @click="dialogEdit = false">Cancel</v-btn>
              <v-btn color="primary" @click="save">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>


      </template>



      <!--      edit warehouse order to status-->
      <template v-slot:item.edit="{ item }">
        <v-icon
          dark
          elevation="0"
          size="small"
          class="me-2"
          color="green"
          @click="editItem(item)"
        >
          mdi-pencil
        </v-icon>
      </template>

    </v-data-table>

  <v-snackbar v-model="snackbar.visible" :timeout="snackbar.timeout" location="top" :color="snackbar.color" >
    {{snackbar.message}}
  </v-snackbar>

</template>

<style scoped>
.search-bar {
  margin: 16px;
  width: 500px;
}

</style>
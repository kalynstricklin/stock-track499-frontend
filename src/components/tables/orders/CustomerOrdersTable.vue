<script setup lang="ts">
import { ref, computed, nextTick, onMounted, watch } from 'vue'
import { getStatusColor, showSnackbar, snackbar } from '@/utils/utils'
import { auth } from '@/firebase'
import {
  createOrderRequest,
  editOrderRequest,
  fetchItemDetails,
  fetchOrderRequest,
  type Order
} from '@/server/services/OrdersHandler'
import { fetchUserRequest } from '@/server/services/UserHandler'




const defaultOrder: any = {
  PO_number: 0,
  part_number: 0,
  supplier_id: 0,

  customer_id: '',

  created: new Date().toDateString(),
  due_date: new Date().toDateString(),
  outbound_price: 0,
  // inbound_price: 0,
  value: 0,
  qty: 0,
  is_outbound: true,
  status: 'Pending'
};
interface OrderItems {
  PO_number: number;

  part_number: number;
  supplier_id: number;
  customer_id: string;
  is_outbound: boolean;

  created: Date;
  due_date: Date;
  outbound_price: number;
  // inbound_price: number;
  value: number;
  qty: number;
  status: string;

}

const dialog = ref(false);
const dialogEdit= ref(false);

const editedItem = ref({ ...defaultOrder });
const defaultItem = ref({ ...defaultOrder });

const editedIndex = ref(-1);

const buttonTitle = computed(() => {
  return editedIndex.value === -1 ? 'Create Order' : 'Update Order';
});

const orders = ref<OrderItems[]>([]);

// search bar
const search = ref('')
//user roles
const role = ref('')

const cxHeaders = computed(() =>{
  const base = [
    { title: 'Order ID', key: 'PO_number', align: 'start', sortable: true, class: 'styled-header' },
    { title: 'Customer', key: 'customer_id', align: 'start', sortable: true, class: 'styled-header'},
    { title: 'Part Number', key: 'part_number', align: 'start', sortable: true, class: 'styled-header' },
    { title: 'Order Date', key: 'created', align: 'start', sortable: true, class: 'styled-header' },
    { title: 'Delivery Date', key: 'due_date', align: 'start', sortable: true, class: 'styled-header' },
    { title: 'Quantity', key: 'qty', align: 'start', sortable: true,class: 'styled-header' },
    { title: 'Unit Price', key: 'outbound_price', align: 'start', sortable: true, class: 'styled-header' },
    { title: 'Total Cost', key: 'value', align: 'start', sortable: true, class: 'styled-header' },
    { title: 'Status', key: 'status', align: 'start', sortable: true, class: 'styled-header' },

  ];

  if(role.value === 'employee' || role.value==='manager' || role.value ==='admin'){
    base.push(
      { title: 'Edit', key: 'edit', align: 'center', sortable: false, class: 'styled-header' },
    )
  }

  return base;
});



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
      showSnackbar('No users found.', 'info');
      return;
    }


    const currUser = users.find((u: any) => u.email === auth?.currentUser?.email);
    if(!currUser){
      showSnackbar('User role not found', 'info')
      return;

    }

    role.value = currUser.role;
    console.log('role', currUser)


    const customerOrders = await fetchOrderRequest(token);

    if(customerOrders){
      orders.value = Array.isArray(customerOrders) ? customerOrders : [];
      showSnackbar(`Loaded all customer orders!`, 'success');

    }else{
      showSnackbar(`Error loading customer orders!`, 'error');
    }
  }catch(error: any){
    showSnackbar(`Error loading customer orders: ${error.message}`, 'error');
  }
}

watch(
  () => editedItem.value.part_number,
  async(newPartNumber) => {
    if(!newPartNumber) return;

    if(!auth.currentUser){
      showSnackbar('You must be logged in to fetch item details.', 'error');
      return;
    }


    try{
      const token = (await auth.currentUser.getIdTokenResult()).token;
      const itemDetails = await fetchItemDetails(newPartNumber, token);

      editedItem.value ={
        ...editedItem.value,
        value: editedItem.value.qty * (3.5 || itemDetails.outbound_price),
        supplier_id: itemDetails.supplier_id || 78,
        outbound_price: itemDetails.outbound_price || 3.5,
      };

      showSnackbar(`Item details for part #${newPartNumber} found!`, 'success')
    }catch(error: any){
      showSnackbar(`Error: ${error.message}`, 'error')
    }
  }
)

const close = () => {
  dialog.value = false;
  nextTick(() => {
    editedItem.value = Object.assign({}, defaultItem.value);
    editedIndex.value = -1;
  });
};

async function save() {
  //check if authorized user
  if(!auth.currentUser){
    return;
  }

  const token = (await (auth.currentUser.getIdTokenResult())).token;
  try{
    const newOrder = {
      ...editedItem.value,
      PO_number: orders.value.length + 1,
      // total_cost: editedItem.value.outbound_price * editedItem.value.qty,
      // status: 'Pending'
    };

    console.log('new order', newOrder)
    const response = await createOrderRequest(newOrder, token);
    if (response === 'Success') {
      showSnackbar(`Order #${newOrder.PO_number} created successfully!`, 'success');
      orders.value = [newOrder, ...orders.value];
      close();
    } else {
      showSnackbar(`Failed to create order: ${response}`, 'error');
    }
  } catch (error: any) {
    showSnackbar(`Error saving order: ${error.message}`, 'error');
  }
};


async function openDialog(){

  if(!auth.currentUser){
    showSnackbar('No authenticated user found.', 'error');
    return;
  }

  try {
    const token = await auth.currentUser.getIdToken();
    let customerName = ''

    //set user role
    let users = await fetchUserRequest(token);

    const currUser = users.find((u:any)=> u.email === auth?.currentUser?.email);


    if(currUser.role === 'customer') {
      customerName = currUser.username || currUser.email;
      editedItem.value.customer_id = customerName
    }else{
      editedItem.value.customer_id = '';
    }
  }catch(error: any){
    showSnackbar(`Failed to assign customer ID: ${error.message}`, 'error')
  }


  dialog.value = true;
  editedItem.value = {...defaultOrder};
};

function editItem(item: any){
  if(!canEdit(item.status)){
    showSnackbar('Cannot edit an order that is in Shipped or Delivered status.', 'error');
    return;
  }
  editedIndex.value = orders.value.indexOf(item)
  editedItem.value = Object.assign({}, item)
  dialogEdit.value= true
}

// const saveStatus = () => {
//   if(editedIndex.value !== -1){
//     orders.value[editedIndex.value].status = editedItem.value.status;
//     showSnackbar(`PO #${editedItem.value.PO_number} Order Status Updated to ${editedItem.value.status}`, 'info');
//   }
//   dialogEdit.value = false;
//
// }

const  canEdit = (status: string): boolean => {
  return status === 'Pending';
};



//when component is mounted data will load
onMounted(() => {
  initialize();
});

const formattedTotal = computed(() => {
  return `$${editedItem.value.toFixed(2)}`;
});
</script>


<template>
    <v-data-table
      v-model:search="search"
      :headers="cxHeaders"
      :items="orders"
      item-value="PO_order"
      :filter-keys="['PO_number','customer_id', 'part_number', 'status', 'created', 'due_date', 'value', 'qty', 'is_outbound', 'supplier_id']"
    >

      <template v-slot:item.status="{ value }">
        <v-chip :color="getStatusColor(value)">
          {{ value }}
        </v-chip>
      </template>

      <template v-slot:item.value="{ value }">
          {{'$'+ value }}
      </template>

      <template v-slot:item.outbound_price="{ value }">
        {{'$'+ value }}
      </template>


      <template v-slot:top>
        <v-toolbar flat>
          <v-card-title class="d-flex align-center pe-2">Customer Orders</v-card-title>
        </v-toolbar>


        <v-row dense justify="space-between" align="center">
          <!-- Search Orders -->
          <v-col cols="8">

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

          </v-col>

        <!--Create a new customer order-->
          <v-col cols="4" class="text-end" style="padding-right: 15px">
            <v-dialog v-model="dialog" max-width="600px">

                <!--new order button-->
                <template v-slot:activator="{ props }">
                  <v-btn
                    class="text-none font-weight-regular"
                    prepend-icon= "mdi-cart"
                    text="New Order"
                    variant="tonal"
                    v-bind="props"
                    @click="openDialog">
                  </v-btn>
                </template>


              <!--new order pop up to create an order-->
              <v-card
                prepend-icon="mdi-cart"
                title="Customer Order"
              >

                <v-card-text>
                  <v-row dense>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="editedItem.customer_id"
                        label="Customer ID*"
                        required

                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="editedItem.part_number"
                        label="Part Number*"
                        required
                      ></v-text-field>
                    </v-col>

                    <v-text-field
                      v-model="editedItem.qty"
                      label="Quantity*"
                      :rules="[v => v > 0 || 'Quantity must be greater than 0']"
                      required
                    ></v-text-field>


                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="editedItem.supplier_id"
                        label="Supplier"
                        disabled
                      ></v-text-field>
                    </v-col>


                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="editedItem.value"
                        label="Total"
                        disabled
                        prepend-inner-icon="$"

                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-checkbox
                        v-model="editedItem.is_outbound"
                        label="Is Outbound"
                      ></v-checkbox>
                    </v-col>


                  </v-row>
                  <small class="text-caption text-medium-emphasis">*indicates required field</small>
                </v-card-text>

                <v-card-actions>

                  <v-spacer></v-spacer>

                  <!--button to close dialog-->
                  <v-btn
                    text="Close"
                    variant="plain"
                    @click="dialog=false"
                  ></v-btn>

                  <!--button to update/create order-->
                  <v-btn
                    color="primary"
                    variant="tonal"
                    @click="save"
                  >{{buttonTitle}}</v-btn>

                </v-card-actions>

              </v-card>
            </v-dialog>
          </v-col>
        </v-row>


        <!--edit dialog-->
<!--        <v-dialog v-model="dialogEdit" max-width="600px">-->
<!--          <v-card>-->
<!--            <v-card-title>-->
<!--              Edit Status-->
<!--            </v-card-title>-->
<!--            <v-card-text>-->
<!--              <v-row dense>-->
<!--                <v-col cols="3">-->
<!--                  <v-text-field-->
<!--                    v-model="editedItem.PO_number"-->
<!--                    label="Order ID"-->
<!--                    disabled-->
<!--                  ></v-text-field>-->
<!--                </v-col>-->
<!--                <v-col cols="3">-->
<!--                  <v-text-field-->
<!--                    v-model="editedItem.customer_id"-->
<!--                    label="Customer"-->
<!--                    disabled-->
<!--                  ></v-text-field>-->
<!--                </v-col>-->
<!--                <v-col cols="3">-->
<!--                  <v-text-field-->
<!--                    v-model="editedItem.part_number"-->
<!--                    label="Part Number"-->
<!--                    disabled-->
<!--                  ></v-text-field>-->
<!--                </v-col>-->
<!--                <v-col cols="3">-->
<!--                  <v-select-->
<!--                    v-model="editedItem.status"-->
<!--                    :items="['Pending', 'Shipped', 'Delivered']"-->
<!--                    label="Status"-->
<!--                  ></v-select>-->
<!--                </v-col>-->
<!--              </v-row>-->
<!--            </v-card-text>-->
<!--            <v-card-actions>-->
<!--              <v-spacer></v-spacer>-->
<!--              <v-btn text="Cancel" @click="dialogEdit = false">Cancel</v-btn>-->
<!--              <v-btn color="primary" @click="saveStatus">{{ buttonTitle }}</v-btn>-->
<!--            </v-card-actions>-->
<!--          </v-card>-->
<!--        </v-dialog>-->

      </template>


<!--edit order status using this button. i feel like we shouldnt change the persons order only the status -->
<!--      <template v-slot:item.edit="{ item }">-->
<!--          <v-icon-->
<!--            dark-->
<!--            elevation="0"-->
<!--            size="small"-->
<!--            class="me-2"-->
<!--            color="green"-->
<!--            @click="canEdit(item.status) && editItem(item)"-->
<!--            :disabled="!canEdit(item.status)"-->
<!--          >-->
<!--            mdi-pencil-->
<!--          </v-icon>-->
<!--      </template>-->



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

.styled-header{
  font-weight: bold;
  color: #4a4a4a;
  text-transform: uppercase;
}
</style>



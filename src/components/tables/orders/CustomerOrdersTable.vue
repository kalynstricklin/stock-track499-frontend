<script setup lang="ts">
import { ref, computed, nextTick, onMounted, watch } from 'vue'
import { getStatusColor, showSnackbar, snackbar } from '@/utils/utils'
import { auth } from '@/firebase'
import {
  createOrderRequest, editOrderRequest, fetchOrders,
  type Order
} from '@/server/services/OrdersHandler'
import { fetchUserByUid } from '@/server/services/UserHandler'
import { fetchInventoryRequest } from '@/server/services/InventoryHandler'
import {fetchSuppliersRequest, type Supplier} from "@/server/services/SupplierHandler";



const defaultOrder = {
  id: 0,
  part_name: '',
  part_number: 0,
  supplier_id: 0,
  qty: 0,
  due_date: new Date().toDateString(),
  created: new Date().toDateString(),
  value: 0,
  customer_id: '',
  is_outbound: true,
  status: ''
};



const dialog = ref(false);
const dialogEdit= ref(false);

const editedItem = ref({ ...defaultOrder });
const defaultItem = ref({ ...defaultOrder });

const editedIndex = ref(-1);

const buttonTitle = computed(() => {
  return editedIndex.value === -1 ? 'Create Order' : 'Update Order';
});

const orders = ref<Order[]>([]);

const suppliers = ref<Supplier[]>([])

// search bar
const search = ref('')
//user roles
const role = ref('')

const cxHeaders = computed(() =>{
  let base = [
    { title: 'Order ID', key: 'id', sortable: true, class: 'styled-header' },

    { title: 'Part Name', key: 'part_name',   sortable: true, class: 'styled-header' },
    { title: 'Part Number', key: 'part_number',   sortable: true, class: 'styled-header' },
    { title: 'Supplier', key: 'supplier',   sortable: true, class: 'styled-header' },
    { title: 'Order Date', key: 'created',   sortable: true, class: 'styled-header' },
    { title: 'Delivery Date', key: 'due_date',   sortable: true, class: 'styled-header' },
    { title: 'Quantity', key: 'qty',   sortable: true,class: 'styled-header' },
    // { title: 'Unit Price', key: 'outbound_price',   sortable: true, class: 'styled-header' },
    { title: 'Total Cost', key: 'value',   sortable: true, class: 'styled-header' },
    { title: 'Status', key: 'status',  class: 'styled-header' },
  ];


  if(role.value === 'employee' || role.value==='manager' || role.value ==='admin'){
    base =[{ title: 'Customer', key: 'customer', sortable: true, class: 'styled-header'}, ...base]

    base.push(
        { title: 'Edit', key: 'edit', sortable: false, class: 'styled-header' },
    )
  }

  return base;
});


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

    const allOrders = await fetchOrders(token);
    console.log(allOrders.message)

    if (!allOrders || !allOrders.message || allOrders.message.length === 0) {
      showSnackbar('No outbound orders found.', 'info');
      return;
    }

    const outbound_orders = allOrders.message.filter((order: any) => {return order.is_outbound});

    const supplierResponse = await fetchSuppliersRequest(token);
    if (supplierResponse && Array.isArray(supplierResponse)) {
      suppliers.value = supplierResponse;
    }

    //update customer id from uid to username
    const updatedOrderWithUser = await Promise.all(outbound_orders.map(async (order: any) =>{

        const customer = await fetchUserByUid(order.customer_id, token);
        const supplier = suppliers.value.find(s => s.id === order.supplier_id);

        console.log('suppliers', supplier)

        return {
          ...order,
          supplier: supplier ? supplier.supplier_name: supplier.supplier_id,
          customer: customer ? customer.username : order.customer_id
        }
      })
    );

    const my_orders = updatedOrderWithUser.filter((order: any) => user.uid === order.customer_id);

    if(role.value === 'customer'){
      orders.value = Array.isArray(my_orders) ? my_orders : [];
      showSnackbar(`Successfully loaded all my orders!`, 'success');
    }else {
      orders.value = Array.isArray(updatedOrderWithUser) ? updatedOrderWithUser : [];
      showSnackbar(`Successfully loaded all outbound orders!`, 'success');
    }

  }catch(error: any){
    showSnackbar(`Error loading customer orders: ${error.message}`, 'error');
  }
}


const close = () => {
  dialog.value = false;
  dialogEdit.value = false;
  nextTick(() => {
    editedItem.value = {...defaultItem.value};
    editedIndex.value = -1;
  });
};


async function save() {

  if( !editedItem.value.part_number || !editedItem.value.qty){
    showSnackbar("Please fill out all required fields", 'error')
    return;
  }

  const index = orders.value.findIndex(o => o.id === editedItem.value.id)

  editedItem.value.part_number = Number(editedItem.value.part_number);
  editedItem.value.qty = Number(editedItem.value.qty);

  //check if authorized user
  if(!auth.currentUser){
    showSnackbar('No authenticated user found.', 'error');
    return;
  }

  showSnackbar('User Authenticated', 'success')

  try{
    const token = await auth.currentUser.getIdToken();

    if(editedIndex.value === -1 ){

      //fetch inv item details based on that part number
      const itemDetails = await fetchInventoryRequest(token);

      if (!itemDetails || itemDetails.length === 0) {
        showSnackbar('No inventory items found.', 'info');
        return;
      }

      const invItem = itemDetails.filter((u: any) => u.part_number === editedItem.value.part_number);


      if (!invItem) {
        showSnackbar(`No inventory item found with part number ${editedItem.value.part_number}.`, 'info');
        return;
      }

      const dueDate = new Date();
      const createDate = new Date();

      dueDate.setDate(dueDate.getDate() + invItem[0].lead_time)

      const create =  createDate.getFullYear() + '-' +  (createDate.getMonth() + 1) + '-' + createDate.getDate();


      const newOrder = {
        // po_number: orders.value.length + 1,
        id: orders.value.length +1,
        customer_id: editedItem.value.customer_id,
        part_name: invItem[0].part_name,
        part_number: editedItem.value.part_number,
        supplier_name: invItem[0].supplier_name,
        due_date: dueDate.toISOString().split('T')[0],
        created:  create,
        // due_date: due,
        // created:  create,
        qty: editedItem.value.qty,
        value: editedItem.value.qty * invItem[0].outbound_price,
        is_outbound: editedItem.value.is_outbound,
        status: 'Pending'
      };


      console.log('new order', newOrder)
      const response = await createOrderRequest(newOrder, token);


      if (response === 'Success') {
        showSnackbar(`Order #${newOrder.id} created successfully!`, 'success');
        orders.value = [newOrder, ...orders.value];
        close();
      } else {
        showSnackbar(`Failed to create order: ${response}`, 'error');
      }
    }else{
      const updatedItem = {
        ...editedItem.value,
      }

      const response = await editOrderRequest(updatedItem, token);
      console.log('response', response)

      if(response === 'Success'){
        showSnackbar(`Order Status updated: ${updatedItem.id}`, 'success');
        orders.value[index] = {...editedItem.value}
        close();
      }else{
        showSnackbar(`Failed to update order status: ${updatedItem.id}`, 'error');
      }
      close();

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
  dialog.value = true;
  editedItem.value = {...defaultOrder};
};

function editItem(item: any){
  editedIndex.value = orders.value.indexOf(item)
  editedItem.value = {...item }
  dialogEdit.value= true
}


//when component is mounted data will load
onMounted(() => {
  initialize();
});


</script>


<template>
    <v-data-table
      v-model:search="search"
      :headers="cxHeaders"
      :items="orders"
      item-value="customer_id"
      :filter-keys="['status', 'part_name', 'customer_id', 'part_number','created', 'due_date', 'value', 'qty', 'is_outbound', 'supplier']"
    >

      <template v-slot:item.status="{ value }">
        <v-chip :color="getStatusColor(value)">
          {{ value }}
        </v-chip>
      </template>

      <template v-slot:item.value="{ value }">
          {{'$'+ Number(value).toFixed(2) }}
      </template>

      <template v-slot:item.outbound_price="{ value }">
       {{`$` + Number(value).toFixed(2) }}
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
                    v-if="role === 'customer'"
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
                        v-model="editedItem.part_number"
                        label="Part Number*"
                        required
                        type="number"
                      ></v-text-field>
                    </v-col>

                    <v-text-field
                      type="number"
                      v-model="editedItem.qty"
                      label="Quantity*"
                      :rules="[v => v > 0 || 'Quantity must be greater than 0']"
                      required
                    ></v-text-field>

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
                    v-model="editedItem.customer_id"
                    label="Customer"
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
                    :items="['Pending', 'Shipped']"
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



      <!--edit order status using this button. -->
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

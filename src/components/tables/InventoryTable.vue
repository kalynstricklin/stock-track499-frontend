<script setup lang="ts">
import { ref, computed, nextTick, onMounted } from 'vue'
import { getStatusColor, showSnackbar, snackbar } from '@/utils/utils'
import { auth } from '@/firebase'
import {
  createInventoryRequest,
  deleteInventoryRequest,
  editInventoryRequest, fetchInventoryRequest, type InventoryItem
} from '@/server/services/InventoryHandler'
import { createOrderRequest, fetchOrders } from '@/server/services/OrdersHandler'
import { fetchUserByUid } from '@/server/services/UserHandler'




const headers = computed(() => {
  const base= [
    { title: 'Part Name', key: 'part_name',  sortable: true, },
    { title: 'Part Number', key: 'part_number',  sortable: true, },
    { title: 'Supplier', key: 'supplier_id', sortable: true, },
    { title: 'Stock Level', key: 'stock_level',  sortable: true, },
    { title: 'Price', key: 'outbound_price',  sortable: true, },
    { title: 'Status', key: 'status',  sortable: true, },

  ];

  // Employee and Admin roles should see the full
  if(role.value === 'employee' || role.value === 'admin' || role.value === 'manager'){
    base.push(

      { title: 'Inbound Price', key: 'inbound_price', sortable: true, },
      { title: 'Reorder Point', key: 'reorder_point',  sortable: true, },
      { title: 'Lead Time (Days)', key: 'lead_time', sortable: true, },

    );

    if(role.value === 'admin' || role.value === 'manager'){
      base.push(
        { title: 'Reorder', key: 'reorder',  sortable: false },
        { title: 'Edit', key: 'edit',  sortable: false },
        { title: 'Delete', key: 'delete', sortable: false },
      );
    }
  }

  return base;
});


const dialog = ref(false)
const dialogDelete = ref(false)
const editedItem = ref({  part_name: '',  lead_time: 0, part_number: 0, supplier_id: 0, reorder_point: 0, stock_level: 0, inbound_price: 0.0, outbound_price: 0.0, status:'In Stock'});
const defaultItem = ref({ part_name: '',  lead_time: 0, part_number: 0, supplier_id: 0, reorder_point: 0, stock_level: 0, inbound_price: 0.0, outbound_price: 0.0, status:'In Stock'});
const editedIndex = ref(-1);

const buttonTitle = computed(()=>{return editedIndex.value === -1 ? 'Add' : 'Update'})
const inventory = ref<any[]>([])

// search bar
const search = ref('')

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


    //now fetch inventory items
    const inventoryItems = await fetchInventoryRequest(token);

    console.log('inv items', inventoryItems)
    inventory.value = Array.isArray(inventoryItems) ? inventoryItems : [];


    showSnackbar(`Loaded all items in the inventory!`, 'success');

  }catch(error: any){
    showSnackbar(`Error loading inventory: ${error.message}`, 'error');
  }
}


function close() {
  dialog.value = false;
  nextTick(() => {
    editedItem.value = Object.assign({}, defaultItem.value);
    editedIndex.value = -1;
  });
}

async function save() {

  if( !editedItem.value.part_number || !editedItem.value.supplier_id || !editedItem.value.inbound_price || !editedItem.value.outbound_price || !editedItem.value.stock_level || !editedItem.value.reorder_point){
    showSnackbar("Please fill out all required fields", 'error')
    return;
  }

  //check if authorized user
  if(!auth.currentUser){
    return;
  }



  try {
    const token = await auth.currentUser.getIdToken();

    if (editedIndex.value === -1) {

      const newItem: InventoryItem = {
        part_name: editedItem.value.part_name,
        part_number: Number(editedItem.value.part_number),
        supplier_id: editedItem.value.supplier_id,
        inbound_price: Number(editedItem.value.inbound_price),
        outbound_price: Number(editedItem.value.outbound_price),
        stock_level: Number(editedItem.value.stock_level),
        reorder_point: Number(editedItem.value.reorder_point),
        lead_time: Number(editedItem.value.lead_time),
        status: editedItem.value.status

      };

      console.log(newItem)
      const response = await createInventoryRequest(newItem, token);

      if (response === 'Success') {
        showSnackbar(`New Item created: ${newItem.part_number}`, 'success');
        inventory.value = [newItem, ...inventory.value];
        close();

      } else {
        showSnackbar(response, 'error');

      }

    }
    else {

      const updatedItem = {
        ...editedItem.value,
      }

      const response = await editInventoryRequest(updatedItem, token);

      if (response === 'Success') {
        showSnackbar(`Inventory Item updated: ${updatedItem.part_number}`, 'success');

        // inventory.value[editedIndex.value] = {...editedItem.value}
        inventory.value.splice(editedIndex.value, 1, updatedItem);
        close();
      } else {
        showSnackbar(`Failed to update inventory item: ${updatedItem.part_number}`, 'error');
      }
    }
  }catch(error: any){
    showSnackbar(`Error: ${error.message}`, 'error');
  }

  editedItem.value = defaultItem.value;
  editedIndex.value = -1;
}


function openDialog(){
  dialog.value = true;
  editedItem.value = defaultItem.value
}


async function deleteItem(item: any){
  editedIndex.value = inventory.value.indexOf(item)
  editedItem.value = Object.assign({}, item)
  dialogDelete.value = true
}

function editItem(item: any){
  editedIndex.value = inventory.value.indexOf(item)
  editedItem.value = Object.assign({}, item)
  dialog.value= true
}

async function deleteItemConfirm() {

  if(!auth.currentUser){
    return;
  }

  try{
    const token = await auth.currentUser.getIdToken();
    const response = await deleteInventoryRequest(editedItem.value, token);

    if(response === 'Success'){
      showSnackbar(`Successfully deleted inventory item: ${editedItem.value.part_number}`, 'success');

      inventory.value.splice(editedIndex.value, 1);
    }else{
      showSnackbar(`Failed to delete inventory item: ${editedItem.value.part_number}`, 'error');
    }

  }catch(error: any){
    showSnackbar(`Error: ${error.message}`, 'error');
  }finally {
    closeDelete();
  }
}

function closeDelete () {
  dialogDelete.value = false
  nextTick(() => {
    editedItem.value = Object.assign({}, defaultItem.value)
    editedIndex.value = -1
  })
}

async function reorder(item: InventoryItem){
  //check if authorized user
  if(!auth.currentUser){
    showSnackbar('No authenticated user found.', 'error');
    return;
  }

  const dueDate = new Date();
  const createDate = new Date();

  dueDate.setDate(dueDate.getDate() + item.lead_time)

  var create =  createDate.getFullYear() + '-' +  (createDate.getMonth() + 1) + '-' + createDate.getDate();


  if(item.stock_level >= item.reorder_point){
    showSnackbar(`Stock does not need to be reordered`, 'info');
    return;
  }

  try{
    const token = await auth.currentUser.getIdToken();

    let reserved = 0;

    //get all orders then filter orders by pending orders to see what the reserved quantity is
    const ordersPlaced = await fetchOrders(token);

    console.log('Orders', ordersPlaced)
    if(ordersPlaced){
      const pendingItemsInOrders = ordersPlaced.message.filter((order: any) => order.is_outbound && order.status === "Pending" && (item.part_number === order.part_number));

      console.log(pendingItemsInOrders);

      reserved = pendingItemsInOrders.reduce((total: number, order: any) => total + order.qty, 0);
      console.log('reserved', reserved)

    }

    const qtyToReorder = item.reorder_point - (item.stock_level + reserved);

    if(qtyToReorder <= 0){
      showSnackbar('Invalid quantity to reorder. ', 'error');
      return;
    }

    const purchaseOrder = {
      part_name: item.part_name,
      part_number: item.part_number,
      supplier_id: item.supplier_id,
      qty: qtyToReorder,
      due_date: dueDate,
      created:  create,
      value: item.inbound_price * qtyToReorder,
      customer_id: auth.currentUser.uid,
      is_outbound:  false,
      status: 'Pending'
    };

    //send po to backend
    const response = await createOrderRequest(purchaseOrder, token);

    if(response === 'Success'){
      showSnackbar(`New Warehouse order created!`, 'success');
    }else{
      showSnackbar(`Failed to create new Warehouse order!`, 'error');
    }

  }catch(error: any){
    showSnackbar(`Error: ${error.message}`, 'error');
  }

}


//when component is mounted data will load
onMounted(() => {
  initialize();
});
</script>


<template>
  <v-data-table
    v-model:search="search"
    :headers="headers"
    :items="Array.isArray(inventory) ? inventory : []"
    item-value="part_number"
    :filter-keys="['product_name', 'part_name','supplier_id', 'part_number', 'inbound_price', 'outbound_price']"
  >

    <template v-slot:item.inbound_price="{ value }">
      {{'$' + value}}
    </template>


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
        <v-card-title class="d-flex align-center pe-2">Warehouse Inventory</v-card-title>
      </v-toolbar>

      <v-row dense justify="space-between" align="center">

        <!-- Search Inventory -->
        <v-col cols="8">
          <v-text-field
            v-model="search"
            density="compact"
            label="Search Inventory"
            prepend-inner-icon="mdi-magnify"
            variant="solo-filled"
            class="search-bar"
            hide-details
            single-line
          ></v-text-field>
        </v-col>

        <!--Add new item to inventory-->
        <v-col cols="4" class="text-end" style="padding-right: 15px" v-if="role === 'admin' || role=== 'manager'">
          <v-dialog v-model="dialog" max-width="600px">

            <template v-slot:activator="{ props }">
              <v-btn
                class="text-none font-weight-regular"
                prepend-icon= "mdi-clipboard-list-outline"
                text="New Item"
                variant="tonal"
                v-bind="props"
                @click="openDialog">
              </v-btn>
            </template>

            <v-card
              prepend-icon="mdi-clipboard-list-outline"
              title="Inventory Item"
            >
              <v-card-text>
                <v-row dense>

                  <v-col cols="12" md="4" sm="6">
                    <v-text-field
                      v-model="editedItem.part_name"
                      label="Part Name*"
                      required
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="4" sm="6">
                    <v-text-field
                      v-model="editedItem.part_number"
                      label="Part Number*"
                      required
                      type="number"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="4" sm="6">
                    <v-text-field
                      v-model="editedItem.supplier_id"
                      label="Supplier*"
                      required
                      type="number"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="4" sm="6">
                    <v-text-field
                      v-model="editedItem.stock_level"
                      label="Stock Level*"
                      required
                      type="number"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="4" sm="6">
                    <v-text-field
                      v-model="editedItem.inbound_price"
                      label="Inbound Price"
                      :rules="[v => v>=0 || 'Price must be non-negative']"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="4" sm="6">
                    <v-text-field
                      v-model="editedItem.outbound_price"
                      label=" Outbound Price"
                      :rules="[v => v>=0 || 'Price must be non-negative']"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="4" sm="6">
                    <v-text-field
                      v-model="editedItem.reorder_point"
                      label="Reorder Threshold*"
                      required
                      type="number"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="4" sm="6">
                    <v-text-field
                      v-model="editedItem.lead_time"
                      label="Lead Time*"
                      required
                      type="number"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="3">
                    <v-select
                      v-model="editedItem.status"
                      :items="['Out of Stock', 'Low Stock', 'In Stock']"
                      label="Status"

                    ></v-select>
                  </v-col>

                </v-row>
                <small class="text-caption text-medium-emphasis">*indicates required field</small>
              </v-card-text>


              <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn
                  text="Close"
                  variant="plain"
                  @click="dialog=false"
                ></v-btn>

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


        <!--Remove item from inventory-->
        <v-dialog v-model="dialogDelete" max-width="600px">

          <v-card>
            <v-card-text>Are you sure you want to delete this item from inventory?</v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn
                text="Cancel"
                variant="plain"
                @click="dialogDelete=false"
              ></v-btn>

              <v-btn
                color="primary"
                text="Delete"
                variant="tonal"
                @click="deleteItemConfirm"
              ></v-btn>

            </v-card-actions>
          </v-card>
        </v-dialog>

    </template>



    <template v-slot:item.edit="{ item }">
      <v-icon
        v-if="role === 'manager' || role === 'admin'"
        dark
        elevation="0"
        size="small"
        class="me-2"
        color="green"
        icon="mdi-pencil"
        @click="editItem(item)"
      ></v-icon>
    </template>

    <template v-slot:item.delete="{ item }">
      <v-icon
        v-if="role === 'manager' || role === 'admin'"
        dark
        elevation="0"
        size="small"
        class="me-2"
        color="red"
        icon="mdi-delete"
        @click="deleteItem(item)"
      ></v-icon>
    </template>

    <template v-slot:item.reorder="{ item }">
      <v-icon
        v-if="role === 'manager' || role === 'admin' || role === 'employee'"
        dark
        elevation="0"
        size="small"
        class="me-2"
        color="blue"
        icon="mdi-plus-thick"
        @click="reorder(item)"
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
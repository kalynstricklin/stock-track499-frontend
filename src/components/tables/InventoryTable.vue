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




const headers = computed(() => {
  const base= [
    { title: 'Product Name', key: 'product_name', align: 'start', sortable: true, },
    { title: 'Part Number', key: 'part_number', align: 'start', sortable: true, },
    { title: 'Supplier', key: 'supplier_ID', align: 'start', sortable: true, },
    { title: 'Manufacturer', key: 'manufacturer_ID', align: 'start', sortable: true, },
    { title: 'On Hand', key: 'on_hand', align: 'start', sortable: true, },
    { title: 'Status', key: 'status', align: 'start', sortable: true, },
    { title: 'Price', key: 'outbound_price', align: 'start', sortable: true, },

  ];

  // Employee and Admin roles should see the full
  if(role.value === 'employee' || role.value === 'admin' || role.value === 'manager'){
    base.push(
      { title: 'Stock Level', key: 'stock_level', align: 'start', sortable: true, },
      { title: 'Reserved', key: 'reserved', align: 'start', sortable: true, },
      { title: 'Lead time', key: 'lead_time', align: 'start', sortable: true, },
      { title: 'Inbound Price', key: 'inbound_price', align: 'start', sortable: true, },
      { title: 'Reorder', key: 'reorder', align: 'center', sortable: false },
    );

    if(role.value === 'admin' || role.value === 'manager'){
      base.push(
        { title: 'Edit', key: 'edit', align: 'center', sortable: false },
        { title: 'Delete', key: 'delete', align: 'center',sortable: false },
      );
    }
  }

  return base;
});


const dialog = ref(false)
const dialogDelete = ref(false)
const editedItem = ref({ product_name: '', part_number: 0, supplier_ID: '', manufacturer_ID: '', reorder_point: 0, stock_level: 0, status: '', inbound_price: 0, outbound_price: 0, on_hand: 0, reserved: 0, lead_time: 0});
const defaultItem = ref({ product_name: '', part_number: 0, supplier_ID: '', manufacturer_ID: '',reorder_point: 0, stock_level: 0, status: '', inbound_price: 0, outbound_price: 0, on_hand: 0, reserved: 0, lead_time: 0  });
const editedIndex = ref(-1);

const buttonTitle = computed(()=>{return editedIndex.value === -1 ? 'Add' : 'Update'})
const inventory = ref<InventoryItem[]>([])

// search bar
const search = ref('')

//user roles
const role = ref('employee')

async function initialize() {
  inventory.value = [
    { product_name: 'item 1', part_number: 1, supplier_ID: '1', manufacturer_ID: '1', reorder_point: 5, stock_level: 5, inbound_price: 12, outbound_price: 12, on_hand: 10, reserved: 2, status: 'In Stock', lead_time: 1},
    { product_name: 'item 2', part_number: 1, supplier_ID: '1', manufacturer_ID: '1', reorder_point: 5, stock_level: 5, inbound_price: 12, outbound_price: 12, on_hand: 10, reserved: 2, status: 'In Stock',lead_time: 1 },
    { product_name: 'item 3', part_number: 1, supplier_ID: '1', manufacturer_ID: '1', reorder_point: 5, stock_level: 5, inbound_price: 12, outbound_price: 12, on_hand: 0, reserved: 2, status: 'Out of Stock',lead_time: 1},
    { product_name: 'item 4', part_number: 1, supplier_ID: '1', manufacturer_ID: '1', reorder_point: 5, stock_level: 5, inbound_price: 12, outbound_price: 12, on_hand: 2, reserved: 2, status: 'Low Stock',lead_time: 1},
    { product_name: 'item 5', part_number: 1, supplier_ID: '1', manufacturer_ID: '1', reorder_point: 5, stock_level: 5, inbound_price: 12, outbound_price: 12, on_hand: 0, reserved: 2, status: 'Out of Stock', lead_time: 1},
    { product_name: 'item 6', part_number: 1, supplier_ID: '1', manufacturer_ID: '1', reorder_point: 5, stock_level: 5, inbound_price: 12, outbound_price: 12, on_hand: 10, reserved: 2, status: 'In Stock', lead_time: 1 },
    { product_name: 'item 7', part_number: 1, supplier_ID: '1', manufacturer_ID: '1', reorder_point: 5, stock_level: 5, inbound_price: 12, outbound_price: 12, on_hand: 3, reserved: 2, status: 'Low Stock', lead_time: 1 },
    { product_name: 'item 8', part_number: 1, supplier_ID: '1', manufacturer_ID: '1', reorder_point: 5, stock_level: 5, inbound_price: 12, outbound_price: 12, on_hand: 0, reserved: 2, status: 'Out of Stock', lead_time: 1},
    { product_name: 'item 9', part_number: 1, supplier_ID: '1', manufacturer_ID: '1', reorder_point: 5, stock_level: 5, inbound_price: 12, outbound_price: 12, on_hand: 10, reserved: 2, status: 'In Stock', lead_time: 1 },
    { product_name: 'item 10',part_number: 1, supplier_ID: '1', manufacturer_ID: '1', reorder_point: 5, stock_level: 5, inbound_price: 12, outbound_price: 12, on_hand: 10, reserved: 2, status: 'In Stock', lead_time:1 },
  ];

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


function close() {
  dialog.value = false;
  nextTick(() => {
    editedItem.value = Object.assign({}, defaultItem.value);
    editedIndex.value = -1;
  });
}

async function save() {

  if(!editedItem.value.product_name || !editedItem.value.part_number || !editedItem.value.supplier_ID || !editedItem.value.manufacturer_ID || !editedItem.value.inbound_price || !editedItem.value.outbound_price || !editedItem.value.stock_level || !editedItem.value.lead_time){
    showSnackbar("Please fill out all required fields", 'error')
    return;
  }

  //check if authorized user
  if(!auth.currentUser){
    return;
  }

  const token = (await (auth.currentUser.getIdTokenResult())).token;
  try {
    if (editedIndex.value === -1) {
      const newItem = {
        product_name: editedItem.value.product_name,
        part_number: editedItem.value.part_number,
        supplier_ID: editedItem.value.supplier_ID,
        manufacturer_ID: editedItem.value.manufacturer_ID,
        inbound_price: editedItem.value.inbound_price,
        outbound_price: editedItem.value.outbound_price,
        on_hand: editedItem.value.stock_level,
        reserved: 0,
        lead_time: editedItem.value.lead_time,
        reorder_point: editedItem.value.reorder_point,
        stock_level: editedItem.value.stock_level,
        status: "In Stock",
      };

      const response = await createInventoryRequest(newItem, token);

      if (response === 'Success') {
        showSnackbar(`New Item created: ${newItem.product_name}`, 'success');
        inventory.value = [newItem, ...inventory.value];
        close();

      } else {
        showSnackbar(`Failed to create new item: ${newItem.product_name}`, 'error');
      }
    }else {

      const updatedItem = {
        ...editedItem.value,
      }

      const response = await editInventoryRequest(updatedItem, token);

      if (response === 'Success') {
        showSnackbar(`Supplier updated: ${updatedItem.product_name}`, 'success');
        //     inventory.value[editedIndex.value] = {...editedItem.value}
        inventory.value.splice(editedIndex.value, 1, updatedItem);
        close();
      } else {
        showSnackbar(`Failed to update Supplier: ${updatedItem.product_name}`, 'error');
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

  const token = (await (auth.currentUser.getIdTokenResult())).token;

  try{
    const response = await deleteInventoryRequest(editedItem.value.part_number, token);

    if(response === 'Success'){
      showSnackbar(`Successfully deleted supplier: ${editedItem.value.product_name}`, 'success');
      inventory.value.splice(editedIndex.value, 1);
    }else{
      showSnackbar(`Failed to delete supplier: ${editedItem.value.product_name}`, 'error');
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
    return;
  }

  const token = (await (auth.currentUser.getIdTokenResult())).token;

  try{
    const qtyToReorder = item.reorder_point - item.on_hand + item.reserved;

    const purchaseOrder = {
      PO_number: 233,
      product_name: item.product_name,
      part_number: item.part_number,
      supplier_ID: item.supplier_ID,
      manufacturer_ID: item.manufacturer_ID,
      order_date: new Date().toISOString(),
      due_date: new Date(Date.now() + item.lead_time * 24 * 60 * 60 * 1000).toISOString(),
      received_date: null,
      qty: qtyToReorder, //this should be replaced automatically with the value associated with the restock value
      price: item.inbound_price * qtyToReorder,
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
    :items="inventory"
    item-value="part_number"
    :filter-keys="['product_name','supplier_ID', 'part_number', 'status', 'manufacturer_ID', 'inbound_price', 'on_hand', 'reserved', 'outbound_price']"
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
                      v-model="editedItem.product_name"
                      label="Product Name*"
                      required
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="4" sm="6">
                    <v-text-field
                      v-model="editedItem.part_number"
                      label="Part Number*"
                      required
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="4" sm="6">
                    <v-text-field
                      v-model="editedItem.supplier_ID"
                      label="Supplier*"
                      required
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="4" sm="6">
                    <v-text-field
                      v-model="editedItem.manufacturer_ID"
                      label="Manufacturer*"
                      required
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="4" sm="6">
                    <v-text-field
                      v-model="editedItem.stock_level"
                      label="Stock Level*"
                      required
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="4" sm="6">
                    <v-text-field
                      v-model="editedItem.inbound_price"
                      label="Purchasing Price"
                      :rules="[v => v>=0 || 'Price must be non-negative']"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="4" sm="6">
                    <v-text-field
                      v-model="editedItem.outbound_price"
                      label=" Selling Price"
                      :rules="[v => v>=0 || 'Price must be non-negative']"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="4" sm="6">
                    <v-text-field
                      v-model="editedItem.lead_time"
                      label="Lead Time*"
                      required
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="4" sm="6">
                    <v-text-field
                      v-model="editedItem.reorder_point"
                      label="Reorder Threshold*"
                      required
                    ></v-text-field>
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
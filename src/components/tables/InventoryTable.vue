<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'


interface InventoryItem {
  product_name: string;
  part_number: number;
  supplier_ID: string;
  manufacturer_ID: string;
  inbound_price: number;
  outbound_price: number;
  reserved: number;
  on_hand: number;
  lead_time: number;
  reorder_point: number;
  stock_level: number;
  status: string;
}


const dialog = ref(false)
const dialogDelete = ref(false)
const editedItem = ref({ product_name: '', part_number: 0, supplier_ID: '', manufacturer_ID: '', reorder_point: 0, stock_level: 0, status: '', inbound_price: 0, outbound_price: 0, on_hand: 0, reserved: 0, lead_time: 0});
const defaultItem = ref({ product_name: '', part_number: 0, supplier_ID: '', manufacturer_ID: '',reorder_point: 0, stock_level: 0, status: '', inbound_price: 0, outbound_price: 0, on_hand: 0, reserved: 0, lead_time: 0  });
const editedIndex = ref(-1);

const formTitle = computed(()=>{return editedIndex.value === -1 ? 'Add New Item to Inventory' : 'Edit Item'})
const buttonTitle = computed(()=>{return editedIndex.value === -1 ? 'Add' : 'Update'})
const inventory = ref<InventoryItem[]>([])


const headers = [
  { title: 'Product Name', key: 'product_name' },
  { title: 'Part Number', key: 'part_number' },
  { title: 'Supplier', key: 'supplier_ID' },
  { title: 'Manufacturer', key: 'manufacturer_ID' },
  { title: 'Inbound Price', key: 'inbound_price' },
  { title: 'Outbound Price', key: 'outbound_price' },
  { title: 'On Hand', key: 'on_hand' },
  { title: 'Stock Level', key: 'stock_level' },
  { title: 'Reserved', key: 'reserved' },
  { title: 'Lead time', key: 'lead_time' },
  { title: 'Status', key: 'status' },
  { title: '', key: 'actions', sortable: false },
  // { title: '', key: 'reorder', sortable: false },
];

function initialize() {
  inventory.value = [
    { product_name: 'item 1', part_number: 1, supplier_ID: '1', manufacturer_ID: '1', reorder_point: 5, stock_level: 5, inbound_price: 12, outbound_price: 12, on_hand: 10, reserved: 2, status: 'Active', lead_time: 1},
    { product_name: 'item 2', part_number: 1, supplier_ID: '1', manufacturer_ID: '1', reorder_point: 5, stock_level: 5, inbound_price: 12, outbound_price: 12, on_hand: 10, reserved: 2, status: 'Active',lead_time: 1 },
    { product_name: 'item 3', part_number: 1, supplier_ID: '1', manufacturer_ID: '1', reorder_point: 5, stock_level: 5, inbound_price: 12, outbound_price: 12, on_hand: 0, reserved: 2, status: 'Out of Stock',lead_time: 1},
    { product_name: 'item 4', part_number: 1, supplier_ID: '1', manufacturer_ID: '1', reorder_point: 5, stock_level: 5, inbound_price: 12, outbound_price: 12, on_hand: 2, reserved: 2, status: 'Low Stock',lead_time: 1},
    { product_name: 'item 5', part_number: 1, supplier_ID: '1', manufacturer_ID: '1', reorder_point: 5, stock_level: 5, inbound_price: 12, outbound_price: 12, on_hand: 0, reserved: 2, status: 'Out of Stock', lead_time: 1},
    { product_name: 'item 6', part_number: 1, supplier_ID: '1', manufacturer_ID: '1', reorder_point: 5, stock_level: 5, inbound_price: 12, outbound_price: 12, on_hand: 10, reserved: 2, status: 'Active', lead_time: 1 },
    { product_name: 'item 7', part_number: 1, supplier_ID: '1', manufacturer_ID: '1', reorder_point: 5, stock_level: 5, inbound_price: 12, outbound_price: 12, on_hand: 3, reserved: 2, status: 'Low Stock', lead_time: 1 },
    { product_name: 'item 8', part_number: 1, supplier_ID: '1', manufacturer_ID: '1', reorder_point: 5, stock_level: 5, inbound_price: 12, outbound_price: 12, on_hand: 0, reserved: 2, status: 'Out of Stock', lead_time: 1},
    { product_name: 'item 9', part_number: 1, supplier_ID: '1', manufacturer_ID: '1', reorder_point: 5, stock_level: 5, inbound_price: 12, outbound_price: 12, on_hand: 10, reserved: 2, status: 'Active', lead_time: 1 },
    { product_name: 'item 10',part_number: 1, supplier_ID: '1', manufacturer_ID: '1', reorder_point: 5, stock_level: 5, inbound_price: 12, outbound_price: 12, on_hand: 10, reserved: 2, status: 'Active', lead_time:1 },
  ];
}


function close() {
  dialog.value = false;
  nextTick(() => {
    editedItem.value = Object.assign({}, defaultItem.value);
    editedIndex.value = -1;
  });
}

function save() {
  if (editedItem.value.part_number) {
    const index = inventory.value.findIndex(o => o.part_number === editedItem.value.part_number);
    if (index !== -1) {
      inventory.value[index] = { ...editedItem.value };
    }
  } else {

    const newItem = {
      product_name: editedItem.value.product_name,
      part_number: Math.random(),
      supplier_ID: editedItem.value.supplier_ID,
      manufacturer_ID: editedItem.value.manufacturer_ID,
      inbound_price: editedItem.value.inbound_price,
      outbound_price: editedItem.value.outbound_price,
      on_hand: 10,
      reserved: 1,
      lead_time: 2,
      reorder_point: 3,
      stock_level: 15,
      status: "Active",
    };
    inventory.value.push(newItem);
  }

  close();
  inventory.value = [...inventory.value]

  editedItem.value = { product_name: '', part_number: 0, supplier_ID: '', manufacturer_ID: '', reorder_point: 0, stock_level: 0,status: '', inbound_price: 0,outbound_price: 0, on_hand: 0, reserved: 0, lead_time: 0 };

};


function openDialog(){
  dialog.value = true;
  formTitle.value = "New Item";
  editedItem.value = {  product_name: '', part_number: 0, supplier_ID: '', manufacturer_ID: '',reorder_point: 0, stock_level: 0, status: '', inbound_price: 0, outbound_price: 0, on_hand: 0, reserved: 0, lead_time: 0};
};

// status color
const getColor = (status: string) =>{
  if(status === 'Active') return 'green'
  else if(status === 'Out of Stock') return 'red'
  else if(status === 'Low Stock') return 'orange'
}

function deleteItem(item: any){
  editedIndex.value = inventory.value.indexOf(item)
  editedItem.value = Object.assign({}, item)
  dialogDelete.value = true
}

function editItem(item: any){
  editedIndex.value = inventory.value.indexOf(item)
  editedItem.value = Object.assign({}, item)
  dialog.value= true
}

function deleteItemConfirm() {
  if (editedIndex.value !== -1) {
    inventory.value.splice(editedIndex.value, 1);
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
  console.log(`reorder placed for ${item.product_name}`);
//   TODO: reorder should automatically create a purchase order for the item and that order will be displayed in the inbound order table

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
  try{
    const response = await fetch('/django/whatever-the-api-is-for-requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ item }),
    });

    if(response.ok){
      const result = await response.json();

      snackbar.value ={
        visible: true,
        message: `PO #${purchaseOrder.PO_number} created for ${item.product_name}`,
        timeout: 3000
      }
    }else{
      throw new Error('Failed to create PO');
    }

  }catch(error){
    snackbar.value ={
      visible: true,
      message: `Failed to create PO #${purchaseOrder.PO_number}`,
      timeout: 3000
    };
  }




}

// search bar
const search = ref('')


// snack bar for reorder
const snackbar = ref({
  visible: false,
  message: '',
  timeout: 3000,
});



initialize();
</script>


<template>
  <v-data-table
    v-model:search="search"
    :headers="headers"
    :items="inventory"
    item-value="part_number"

    :filter-keys="['product_name','supplier_ID', 'part_number', 'status', 'manufacturer_ID', 'inbound_price', 'on_hand', 'reserved']"
  >

    <template v-slot:item.inbound_price="{ value }">
      {{'$' + value}}
    </template>


    <template v-slot:item.outbound_price="{ value }">
      {{'$' + value}}
    </template>

    <!--  status styling -->
      <template v-slot:item.status="{ value }">
        <v-chip :color="getColor(value)">
          {{ value }}
        </v-chip>
      </template>

<!--    title of table-->
    <template v-slot:top>
      <v-toolbar flat>

        <v-card-title class="d-flex align-center pe-2">Warehouse Inventory</v-card-title>

        <v-spacer></v-spacer>

        <!-- Search Inventory -->
        <v-text-field
          v-model="search"
          density="compact"
          label="Search Inventory"
          prepend-inner-icon="mdi-magnify"
          variant="solo-filled"
          flat
          hide-details
          single-line
        ></v-text-field>

        <!--Add new item to inventory-->
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
                      label="Price"
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


      </v-toolbar>
    </template>



    <template v-slot:item.actions="{ item }">

      <v-tooltip text="Edit" location="top">
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            size="small"
            class="me-2"
            color="blue"
            icon="mdi-pencil"
            @click="editItem(item)"
          ></v-btn>
        </template>
      </v-tooltip>


      <v-tooltip text="Delete" location="top">
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            size="small"
            class="me-2"
            color="red"
            icon="mdi-delete"
            @click="deleteItem(item)"
          ></v-btn>
        </template>
      </v-tooltip>

      <v-tooltip text="Reorder" location="top">
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            size="small"
            class="me-2"
            color="green"
            icon="mdi-plus-thick"
            @click="reorder(item)"
          ></v-btn>
        </template>
      </v-tooltip>

    </template>
  </v-data-table>

<!--  Re Order button snackbar-->
  <v-snackbar v-model="snackbar.visible" :timeout="snackbar.timeout" location="top">
    {{snackbar.message}}
  </v-snackbar>
</template>

<style scoped>
</style>
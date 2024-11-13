<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import router from '@/router'
interface InventoryItem {
  productName: string;
  productId: string;
  supplier: string;
  category: string;
  price: number;
  status: string;
}


const dialog = ref(false)
const dialogDelete = ref(false)
const editedItem = ref({ productName: '', productId: '', category: '', supplier: '', status: '', price: 0 });
const defaultItem = ref({ productName: '', productId: '', category: '', supplier: '', status: '', price: 0 });
const editedIndex = ref(-1);

const formTitle = computed(()=>{
  return editedIndex.value === -1 ? 'New Item' : 'Edit Item'
})
const inventory = ref<InventoryItem[]>([])
const selected = ref([])

const headers = [
  { title: 'Product Name', key: 'productName'},
  { title: 'Category', key: 'category' },
  { title: 'Product ID', key: 'productId' },
  { title: 'Supplier', key: 'supplier' },
  { title: 'Price', key: 'price' },
  { title: 'Status', key: 'status' },
  { title: '', key: 'actions', sortable: false },
];


function initialize() {
  inventory.value = [
    { productName: 'item 1', productId: 'TS124323', supplier: 'supp 1', category: 'Clothing', price: 12, status: 'Active' },
    { productName: 'item 2', productId: 'TS123243', supplier: 'supp 2', category: 'Jewelry', price: 12, status: 'Active' },
    { productName: 'item 3', productId: 'TS532223', supplier: 'supp 3', category: 'cat 3', price: 12, status: 'Out of Stock' },
    { productName: 'item 4', productId: 'TS532224', supplier: 'supp 3', category: 'cat 3', price: 12, status: 'Active' },
    { productName: 'item 5', productId: 'TS532225', supplier: 'supp 3', category: 'cat 3', price: 12, status: 'Out of Stock' },
    { productName: 'item 6', productId: 'TS532226', supplier: 'supp 3', category: 'cat 3', price: 12, status: 'Active' },
    { productName: 'item 7', productId: 'TS532227', supplier: 'supp 3', category: 'cat 3', price: 12, status: 'Active' },
    { productName: 'item 8', productId: 'TS532228', supplier: 'supp 3', category: 'cat 3', price: 12, status: 'Out of Stock' },
    { productName: 'item 9', productId: 'TS532229', supplier: 'supp 3', category: 'cat 3', price: 12, status: 'Active' },
    { productName: 'item 10', productId: 'TS532230', supplier: 'supp 3', category: 'cat 3', price: 12, status: 'Active' },
  ]
}


function close() {
  dialog.value = false;
  nextTick(() => {
    editedItem.value = Object.assign({}, defaultItem.value);
    editedIndex.value = -1;
  });
}
function save() {
  if (editedItem.value.productId) {
    const index = inventory.value.findIndex(o => o.productId === editedItem.value.productId);
    if (index !== -1) {
      inventory.value[index] = { ...editedItem.value };
    }
  } else {

    const newItem = {
      productName: editedItem.value.productName,
      productId: crypto.randomUUID(),
      supplier: editedItem.value.supplier,
      category: editedItem.value.category,
      price: editedItem.value.price,
      status: "Active",
    };
    inventory.value.push(newItem);
  }

  close();
  inventory.value = [...inventory.value]

  editedItem.value = { productName: '', productId: '', category: '', supplier: '', status: '', price: 0 };

};


function openDialog(){
  dialog.value = true;
  formTitle.value = "New Item";
  editedItem.value = {  productName: '', productId: '', category: '', supplier: '', status: '', price: 0};
};



// status color
const getColor = (status: string) =>{
  if(status === 'Active') return 'green'
  else if(status === 'Out of Stock') return 'red'
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


initialize();
</script>


<template>
  <v-data-table
    v-model="selected"
    :headers="headers"
    :items="inventory"
    item-value="productId"
    show-select
  >

    <template v-slot:item.category="{ value }">
      {{value.toUpperCase()}}
    </template>

    <template v-slot:item.price="{ value }">
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
        <v-card-title class="d-flex align-center pe-2">Inventory</v-card-title>
        <v-spacer></v-spacer>

        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ props }">
            <v-btn color="primary" dark v-bind="props" @click="openDialog">
              Add Product
            </v-btn>
          </template>

          <v-card>
            <v-card-title>
              <span>{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" md="4" sm="6">
                    <v-text-field
                      v-model="editedItem.productName"
                      label="Product Name"
                    ></v-text-field>
                  </v-col>
<!--                  <v-col cols="12" md="4" sm="6">-->
<!--                    <v-text-field-->
<!--                      v-model="editedItem.productId"-->
<!--                      label="Product ID"-->
<!--                    ></v-text-field>-->
<!--                  </v-col>-->
                  <v-col cols="12" md="4" sm="6">
                    <v-text-field
                      v-model="editedItem.category"
                      label="Category"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4" sm="6">
                    <v-text-field
                      v-model="editedItem.supplier"
                      label="Supplier"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4" sm="6">
                    <v-text-field
                      v-model="editedItem.price"
                      label="Price"
                    ></v-text-field>
                  </v-col>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue-darken-1" variant="text" @click="close">
                      Cancel
                    </v-btn>
                    <v-btn color="blue-darken-1" variant="text" @click="save">
                      Save
                    </v-btn>
                  </v-card-actions>
                </v-row>
              </v-container>
            </v-card-text>
          </v-card>

        </v-dialog>

        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="closeDelete">Cancel</v-btn>
              <v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm">Delete</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>

    <template v-slot:item.actions="{ item }">
      <v-icon
      class="me-2"
      size="small"
      @click="editItem(item)">
        mdi-pencil
      </v-icon>
      <v-icon
        size="small"
        @click="deleteItem(item)">
        mdi-delete
      </v-icon>
    </template>

  </v-data-table>
</template>

<style scoped>
</style>
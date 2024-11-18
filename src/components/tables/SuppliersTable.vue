<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'


interface SupplierItems {
  supplier_name: string;
  supplier_ID: number;
  created_on: string;

}


const dialog = ref(false)
const dialogDelete = ref(false)
const editedItem = ref({ supplier_name: '', supplier_ID: 0});
const defaultItem = ref({ supplier_name: '', supplier_ID: 0});
const editedIndex = ref(-1);


const buttonTitle = computed(()=>{return editedIndex.value === -1 ? 'Add' : 'Update'})
const suppliers = ref<SupplierItems[]>([])

// search bar
const search = ref('')

// snack bar
const snackbar = ref({
  visible: false,
  message: '',
  timeout: 3000,
});


const headers = [
  { title: 'Supplier Name', key: 'supplier_name'},
  { title: 'Supplier ID', key: 'supplier_ID'},
  { title: 'Created On', key: 'created_on' },
  { title: 'Edit', key: 'edit', sortable: false },
  { title: 'Delete', key: 'delete', sortable: false },
];


function initialize() {
  suppliers.value = [
    { supplier_name: 'Amazon', supplier_ID: 1, created_on: '2024-10-12' },
    { supplier_name: 'Walmart', supplier_ID: 2,created_on: '2024-10-12' },
    { supplier_name: 'Target',supplier_ID: 3, created_on: '2024-10-12' },
    { supplier_name: 'Home Depot',supplier_ID: 4, created_on: '2024-10-12' },
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
  if (editedItem.value.supplier_ID) {
    const index = suppliers.value.findIndex(o => o.supplier_ID === editedItem.value.supplier_ID);
    if (index !== -1) {
      suppliers.value[index] = { ...editedItem.value };
    }
  } else {

    const newItem = {
      supplier_name: editedItem.value.supplier_name,
      supplier_ID: editedItem.value.supplier_ID,
      created_on: new Date().toISOString()
    };

    suppliers.value =[newItem, ...suppliers.value]

    snackbar.value ={
      visible: true,
      message: `Supplier ${editItem.value.supplier_name} Created.`,
      timeout: 3000
    }

  }

  close();
  suppliers.value = [...suppliers.value]

  editedItem.value = { supplier_name: '', supplier_ID: 0};

};


function openDialog(){
  dialog.value = true;
  editedItem.value = { supplier_name: '', supplier_ID: 0};
};


function deleteItem(item: any){
  editedIndex.value = suppliers.value.indexOf(item)
  editedItem.value = Object.assign({}, item)
  dialogDelete.value = true
}

function editItem(item: any){
  editedIndex.value = suppliers.value.indexOf(item)
  editedItem.value = Object.assign({}, item)
  dialog.value= true
}

function deleteItemConfirm() {
  if (editedIndex.value !== -1) {
    suppliers.value.splice(editedIndex.value, 1);
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
    v-model:search="search"
    :headers="headers"
    :items="suppliers"
    item-value="supplier_ID"
    :filter-keys="['supplier_name', 'supplier_ID', 'created_on']"
  >


    <!--    title of table-->
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Suppliers</v-toolbar-title>
      </v-toolbar>

      <v-row dense justify="space-between" align="center">

        <!-- Search Orders -->
        <v-col cols="8" class="text-center">
          <v-text-field
            v-model="search"
            density="compact"
            label="Search Suppliers"
            prepend-inner-icon="mdi-magnify"
            variant="solo-filled"
            class="search-bar"
            hide-details
            single-line
          ></v-text-field>
        </v-col>

        <v-col cols="4" class="text-end" style="padding-right: 15px">
          <v-dialog v-model="dialog" max-width="600px">

            <template v-slot:activator="{ props }">
              <v-btn
                class="text-none font-weight-regular"
                prepend-icon= "mdi-account-multiple"
                text="New Supplier"
                variant="tonal"
                v-bind="props"
                @click="openDialog">
              </v-btn>
            </template>

            <v-card
              prepend-icon="mdi-account-multiple"
              title="Supplier"
            >

              <v-card-text>
                <v-row dense>

                  <v-col cols="12" md="4" sm="6">
                    <v-text-field
                      v-model="editedItem.supplier_name"
                      label="Supplier Name*"
                      required
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="4" sm="6">
                    <v-text-field
                      v-model="editedItem.supplier_ID"
                      label="Supplier ID*"
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

      <!--delete dialog-->
      <v-dialog v-model="dialogDelete" max-width="600px">
        <v-card>
          <v-card-text>Are you sure you want to delete this supplier?</v-card-text>

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


<!--    edit supplier button-->
    <template v-slot:item.edit="{ item }">
      <v-icon
        dark
        elevation="0"
        size="small"
        class="me-2"
        color="green"
        icon="mdi-pencil"
        @click="editItem(item)"
      ></v-icon>

    </template>

    <!--    delete supplier button-->
    <template v-slot:item.delete="{ item }">
        <v-icon
          dark
          elevation="0"
          size="small"
          class="me-2"
          color="red"
          icon="mdi-delete"
          @click="deleteItem(item)"
        ></v-icon>
    </template>

  </v-data-table>

  <v-snackbar v-model="snackbar.visible" :timeout="snackbar.timeout" location="top">
    {{snackbar.message}}
  </v-snackbar>

</template>

<style scoped>
.search-bar {
  margin: 16px;
  width: 500px;
}
</style>
<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'


interface SupplierItems {
  supplier_name: string;
  supplier_ID: number;
  createdOn: string;

}


const dialog = ref(false)
const dialogDelete = ref(false)
const editedItem = ref({ supplier_name: '', supplier_ID: 0});
const defaultItem = ref({ supplier_name: '', supplier_ID: 0});
const editedIndex = ref(-1);

const formTitle = computed(()=>{return editedIndex.value === -1 ? 'New Supplier' : 'Edit Supplier'})
const buttonTitle = computed(()=>{return editedIndex.value === -1 ? 'Add' : 'Update'})

const suppliers = ref<SupplierItems[]>([])


const headers = [
  { title: 'Supplier Name', key: 'supplier_name'},
  { title: 'Supplier ID', key: 'supplier_ID'},
  { title: 'Created On', key: 'createdOn' },
  { title: '', key: 'actions', sortable: false },
];


function initialize() {
  suppliers.value = [
    { supplier_name: 'Amazon', supplier_ID: 1, createdOn: '2024-10-12' },
    { supplier_name: 'Walmart', supplier_ID: 2,createdOn: '2024-10-12' },
    { supplier_name: 'Target',supplier_ID: 3, createdOn: '2024-10-12' },
    { supplier_name: 'Home Depot',supplier_ID: 4, createdOn: '2024-10-12' },
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
  if (editedIndex.value === -1) {
    const newItem = {
      supplier_name: editedItem.value.supplier_name,
      supplier_ID: editedItem.value.supplier_ID,
      createdOn: new Date().toISOString()
    };
    suppliers.value.push(newItem);
  }else{
    suppliers.value[editedIndex.value] = {...editedItem.value}
  }

  close();
  suppliers.value = [...suppliers.value]

  editedItem.value = { supplier_name: '', supplier_ID: 0};
  editedIndex.value = -1;

};


function openDialog(){
  dialog.value = true;
  formTitle.value = "New Supplier";
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
    :headers="headers"
    :items="suppliers"
    item-value="supplier_ID"
  >


    <!--    title of table-->
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Suppliers</v-toolbar-title>
        <v-spacer></v-spacer>

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
    </template>

  </v-data-table>
</template>

<style scoped>
</style>
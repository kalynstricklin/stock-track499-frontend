<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
import { getStatusColor, showSnackbar, snackbar } from '@/utils/utils'
import {
  createSupplierRequest,
  deleteSupplierRequest,
  editSupplierRequest, fetchSuppliersRequest,
  type Supplier
} from '@/server/services/SupplierHandler'
import { auth } from '@/firebase'
import { fetchUserByUid } from '@/server/services/UserHandler'




const dialog = ref(false)
const dialogDelete = ref(false)
const editedItem = ref({ supplier_name: '', supplier_id: 0});
const defaultItem = ref({ supplier_name: '', supplier_id: 0});
const editedIndex = ref(-1);


const buttonTitle = computed(()=>{return editedIndex.value === -1 ? 'Add' : 'Update'})
const suppliers = ref<Supplier[]>([])

// search bar
const search = ref('')


const headers = computed(() => {
  const base = [
    { title: 'Supplier Name', key: 'supplier_name', sortable: true, }, {
      title: 'Supplier ID',
      key: 'supplier_id',
      sortable: true,
    },
    // { title: 'Created On', key: 'created' },
    // { title: 'Status', key: 'status' },
  ];

  if (role.value === 'admin' || role.value === 'manager') {
    base.push(
      { title: 'Edit', key: 'edit', sortable: false },
      { title: 'Delete', key: 'delete', sortable: false },
    )
  }

  return base;
});

//user roles
const role = ref('')


async function initialize() {

  if(!auth.currentUser){
    showSnackbar('No authenticated user found.', 'error');
    return;
  }


  try{
    const token = await auth.currentUser.getIdToken();

    //set user role
    let user = await fetchUserByUid(auth.currentUser.uid, token);

    if (!user) {
      showSnackbar('No user found.', 'info');
      return;
    }

    role.value = user.role;

    const supplierList = await fetchSuppliersRequest(token);
    console.log('suppliers', supplierList)

    suppliers.value = Array.isArray(supplierList) ? supplierList : [];

    showSnackbar(`Loaded all suppliers!`, 'success');

  }catch(error: any){
    showSnackbar(`Error loading suppliers: ${error.message}`, 'error');
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
  //check if required fields are filled
  if (!editedItem.value.supplier_name || !editedItem.value.supplier_id) {
    showSnackbar("Please fill out all required fields", 'error');
    return;
  }

  const index = suppliers.value.findIndex(o => o.supplier_name === editedItem.value.supplier_name)

  //check if authorized user
  if(!auth.currentUser){
    showSnackbar('No authenticated user found.', 'error');
    return;
  }

  showSnackbar('User Authenticated', 'success')
  try{

    const token = await auth.currentUser.getIdToken();

    if(editedIndex.value === -1){

      //create new supplier with edited fields
      const newItem: Supplier = {
        supplier_name: editedItem.value.supplier_name,
        supplier_id: editedItem.value.supplier_id,

      };

      const response = await createSupplierRequest(newItem, token);
      console.log("response", response)

      if(response === 'Success'){
        showSnackbar(`New Supplier created: ${newItem.supplier_name}`, 'success');
        suppliers.value =[newItem, ...suppliers.value];
        close();

      }
      else{
        showSnackbar(`Failed to create new Supplier: ${newItem.supplier_name}`, 'error');
      }

    }else{
      const updatedItem = {
        ...editedItem.value,
      }

      const response = await editSupplierRequest(updatedItem, token);

      if(response === 'Success'){
        showSnackbar(`Supplier updated: ${updatedItem.supplier_name}`, 'success');
        suppliers.value[index] = {...editedItem.value}
        close();
      }else{
        showSnackbar(`Failed to update Supplier: ${updatedItem.supplier_name}`, 'error');
      }

    }
  }catch(error: any){
    showSnackbar(`Error: ${error.message}`, 'error');
  }
}


function openDialog(){
  dialog.value = true;
  editedItem.value = { supplier_name: '', supplier_id: 0};
}


function deleteItem(item: any){
  editedIndex.value = suppliers.value.indexOf(item)
  editedItem.value = Object.assign({}, item)
  dialogDelete.value = true

}

function editItem(item: any){
  editedIndex.value = suppliers.value.indexOf(item)
  editedItem.value = { ...item };
  dialog.value= true
}

async function deleteItemConfirm() {

  if(!auth.currentUser){
    showSnackbar('No authenticated user found.', 'error');
    return;
  }
  showSnackbar('User Authenticated', 'success')


  try{
    const token = await auth.currentUser.getIdToken();

    const response = await deleteSupplierRequest(editedItem.value, token);

    if(response === 'Success'){
      showSnackbar(`Successfully deleted supplier: ${editedItem.value.supplier_name}`, 'success');
      suppliers.value.splice(editedIndex.value, 1);
    }else{
      showSnackbar(`Failed to delete supplier: ${editedItem.value.supplier_name}`, 'error');
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

//when component is mounted data will load
onMounted(() => {
  initialize();
});


onUnmounted(()=> {
})
</script>


<template>
  <v-data-table
    v-model:search="search"
    :headers="headers"
    :items="suppliers"
    item-value="supplier_id"
    :filter-keys="['supplier_name', 'supplier_id']"
  >

<!--    <template v-slot:item.status="{ value }">-->
<!--      <v-chip :color="getStatusColor(value)">-->
<!--        {{ value }}-->
<!--      </v-chip>-->
<!--    </template>-->


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
                v-if="role === 'admin' || role==='manager'"
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
                      v-model="editedItem.supplier_id"
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
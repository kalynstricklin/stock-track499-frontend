<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'


interface RoleItems {
  roleName: string;
  createdOn: string;

}


const dialog = ref(false)
const dialogDelete = ref(false)
const editedItem = ref({ roleName: ''});
const defaultItem = ref({ roleName: ''});
const editedIndex = ref(-1);

const formTitle = computed(()=>{
  return editedIndex.value === -1 ? 'New Role' : 'Edit Role'
})
const roles = ref<RoleItems[]>([])
const selected: any[] = [];

const headers = [
  { title: 'Role Name', key: 'roleName'},
  { title: 'Created On', key: 'createdOn' },
  { title: '', key: 'actions', sortable: false },
];


function initialize() {
  roles.value = [
    { roleName: 'Admin', createdOn: '2024-10-12' },
    { roleName: 'Customer', createdOn: '2024-10-12' },
    { roleName: 'Manager', createdOn: '2024-10-12' },
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
      roleName: editedItem.value.roleName,
      createdOn: new Date().toLocaleDateString()
    };
    roles.value.push(newItem);
  }else{
    roles.value[editedIndex.value] = {...editedItem.value}
  }

  close();
  roles.value = [...roles.value]

  editedItem.value = { roleName: ''};
  editedIndex.value = -1;

};


function openDialog(){
  dialog.value = true;
  formTitle.value = "New Role";
  editedItem.value = {  roleName: ''};
};


function deleteItem(item: any){
  editedIndex.value = roles.value.indexOf(item)
  editedItem.value = Object.assign({}, item)
  dialogDelete.value = true
}

function editItem(item: any){
  editedIndex.value = roles.value.indexOf(item)
  editedItem.value = Object.assign({}, item)
  dialog.value= true
}
function deleteItemConfirm() {
  if (editedIndex.value !== -1) {
    roles.value.splice(editedIndex.value, 1);
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
    :items="roles"
    item-value="roleNames"
    show-select
  >


    <!--    title of table-->
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Roles and Permissions</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ props }">
            <v-btn color="primary" dark v-bind="props" @click="openDialog">
              Add New Role
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
                      v-model="editedItem.roleName"
                      label="Role Name"
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
            <v-card-title class="text-h5">Are you sure you want to delete this role?</v-card-title>
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
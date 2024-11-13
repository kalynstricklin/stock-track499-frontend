<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'


const expanded = ref([]);
const dialog = ref(false);
const dialogDelete = ref(false)
const editedItem = ref({ userName: '', email: '', role: '', createdOn: '', status: ''});
const defaultItem = ref({ userName: '', email: '', role: '', createdOn: '', status: ''});
const editedIndex = ref(-1);
const selected = ref([])

const formTitle = computed(()=>{
  return editedIndex.value === -1 ? 'New User' : 'Edit User'
})

const headers = [
  { title: 'User Name', key: 'userName' },
  { title: 'Email', key: 'email' },
  { title: 'Role', key: 'role' },
  { title: 'Created On', key: 'createdOn' },
  { title: 'Status', key: 'status' },
  { title: '', key: 'actions', sortable: false },
];


const users = ref([
  { userName: 'Kalyn', email: 'kms0081@uah.edu', role: 'Admin', createdOn: '2024-11-13', status: 'Active' },
  { userName: 'Alex', email: 'alex@uah.edu', role: 'Manager', createdOn: '2024-11-13', status: 'Active' },
  { userName: 'Ashley', email: 'ashley@uah.edu', role: 'Customer', createdOn: '2024-11-13', status: 'Active' },
  { userName: 'Josh', email: 'josh1@uah.edu', role: 'Customer', createdOn: '2024-11-13', status: 'Active' },
  { userName: 'Josh', email: 'josh2@uah.edu', role: 'Manager', createdOn: '2024-11-13', status: 'Active' },
  { userName: 'Jack', email: 'jack@uah.edu', role: 'Customer', createdOn: '2024-11-13', status: 'Inactive' },
]);


const close = () => {
  dialog.value = false;
  editedItem.value = { userName: '', email: '', role: '', createdOn: '', status: ''};
};

const save = () => {
  if (!editedItem.value.userName || !editedItem.value.email || !editedItem.value.role) {
    alert("Please fill out all fields");
    return;
  }
  if (editedIndex.value === -1) {
    const newItem = {
      userName: editedItem.value.userName,
      email: editedItem.value.email,
      role: editedItem.value.role,
      createdOn: new Date().toLocaleDateString(),
      status: 'Active'
    };
    users.value.push(newItem);
  }else{
    users.value[editedIndex.value] = {...editedItem.value}
  }

  close();
  users.value = [...users.value]

  editedItem.value = { userName: '', email: '', role: '', createdOn: '', status: ''};
  editedIndex.value = -1;
};

const openDialog = () => {
  dialog.value = true;
  formTitle.value = "New User";
  editedItem.value = { userName: '', email: '', role: '', createdOn: '', status: ''};
};

// search bar
const search = ref('')

// status color
const getColor = (status: string) =>{
  if(status === 'Active') return 'green'
  else if(status === 'Inactive') return 'red'
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

function deleteItem(item: any){
  editedIndex.value = users.value.indexOf(item)
  editedItem.value = Object.assign({}, item)
  dialogDelete.value = true
}

function editItem(item: any){
  editedIndex.value = users.value.indexOf(item)
  editedItem.value = Object.assign({}, item)
  dialog.value= true
}

const roles = ['Admin', 'Manager', 'Customer'];

</script>


<template>

    <v-data-table
      v-model="selected"
      v-model:search="search"
      :headers="headers"
      :items="users"
      item-value="userName"
      :filter-keys="['userName', 'createdOn', 'status', 'role', 'email']"
    >


      <template v-slot:item.status="{ value }">
        <v-chip :color="getColor(value)">
          {{ value }}
        </v-chip>
      </template>

      <template v-slot:top>
        <v-toolbar flat>
          <v-card-title class="d-flex align-center pe-2">Users</v-card-title>

          <v-spacer></v-spacer>

          <!-- Search Users -->
          <v-text-field
            v-model="search"
            density="compact"
            label="Search Users"
            prepend-inner-icon="mdi-magnify"
            variant="solo-filled"
            flat
            hide-details
            single-line
          ></v-text-field>


          <!-- New User Popup dialog  -->
          <v-dialog v-model="dialog" max-width="600px">

            <template v-slot:activator="{ props }">
              <v-btn color="primary" dark v-bind="props" @click="openDialog">
                New User
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
                        v-model="editedItem.userName"
                        label="UserName"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4" sm="6">
                      <v-text-field
                        v-model="editedItem.email"
                        label="Email"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4" sm="6">
                      <v-select
                        v-model="editedItem.role"
                        :items="roles"
                        label="User Roles">
                      </v-select>
                    </v-col>

                  </v-row>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue-darken-1" variant="text" @click="close">
                      Cancel
                    </v-btn>
                    <v-btn color="blue-darken-1" variant="text" @click="save">
                      Save
                    </v-btn>
                  </v-card-actions>
                </v-container>
              </v-card-text>
            </v-card>
          </v-dialog>

          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h5">Are you sure you want to delete this user?</v-card-title>
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
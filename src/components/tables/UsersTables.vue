<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'


const expanded = ref([]);
const dialog = ref(false);
const dialogDelete = ref(false)
const editedItem = ref({ user_name: '', email: '', role: '', createdOn: '', status: ''});
const defaultItem = ref({ user_name: '', email: '', role: '', createdOn: '', status: ''});
const editedIndex = ref(-1);
const selected = ref([])

const formTitle = computed(()=>{
  return editedIndex.value === -1 ? 'New User' : 'Edit User'
})

const buttonTitle = computed(()=>{return editedIndex.value === -1 ? 'Add' : 'Update'})

const headers = [
  { title: 'User Name', key: 'user_name' },
  { title: 'Email', key: 'email' },
  { title: 'Role', key: 'role' },
  { title: 'Created On', key: 'createdOn' },
  { title: 'Status', key: 'status' },
  { title: '', key: 'actions', sortable: false },
];


const users = ref([
  { user_name: 'Kalyn', email: 'kms0081@uah.edu', role: 'Admin', createdOn: '2024-11-13', status: 'Active' },
  { user_name: 'Alex', email: 'alex@uah.edu', role: 'Manager', createdOn: '2024-11-13', status: 'Active' },
  { user_name: 'Ashley', email: 'ashley@uah.edu', role: 'Customer', createdOn: '2024-11-13', status: 'Active' },
  { user_name: 'Josh', email: 'josh1@uah.edu', role: 'Customer', createdOn: '2024-11-13', status: 'Active' },
  { user_name: 'Josh', email: 'josh2@uah.edu', role: 'Manager', createdOn: '2024-11-13', status: 'Active' },
  { user_name: 'Jack', email: 'jack@uah.edu', role: 'Customer', createdOn: '2024-11-13', status: 'Inactive' },
]);


const close = () => {
  dialog.value = false;
  editedItem.value = { user_name: '', email: '', role: '', createdOn: '', status: ''};
};

const save = () => {
  if (!editedItem.value.user_name || !editedItem.value.email || !editedItem.value.role) {
    alert("Please fill out all fields");
    return;
  }
  if (editedIndex.value === -1) {
    const newItem = {
      user_name: editedItem.value.user_name,
      email: editedItem.value.email,
      role: editedItem.value.role,
      createdOn: new Date().toISOString(),
      status: 'Active'
    };
    users.value.push(newItem);
  }else{
    users.value[editedIndex.value] = {...editedItem.value}
  }

  close();
  users.value = [...users.value]

  editedItem.value = { user_name: '', email: '', role: '', createdOn: '', status: ''};
  editedIndex.value = -1;
};

const openDialog = () => {
  dialog.value = true;
  formTitle.value = "New User";
  editedItem.value = { user_name: '', email: '', role: '', createdOn: '', status: ''};
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

const roles = ['Admin', 'Manager', 'Customer', 'Employee'];

</script>


<template>

    <v-data-table
      v-model="selected"
      v-model:search="search"
      :headers="headers"
      :items="users"
      item-value="user_name"
      :filter-keys="['user_name', 'createdOn', 'status', 'role', 'email']"
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

<!--            <template v-slot:activator="{ props }">-->
<!--              <v-btn-->
<!--                class="text-none font-weight-regular"-->
<!--                prepend-icon= "mdi-account-multiple"-->
<!--                text="New User"-->
<!--                variant="tonal"-->
<!--                v-bind="props"-->
<!--                @click="openDialog">-->
<!--              </v-btn>-->
<!--            </template>-->


            <v-card
              prepend-icon="mdi-account"
              title="User"
            >
              <v-card-text>
                  <v-row dense>

                    <v-col cols="12" md="4" sm="6">
                      <v-text-field
                        v-model="editedItem.user_name"
                        label="user_name"
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
                        label="Role">
                      </v-select>
                    </v-col>

                  </v-row>
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
              <v-card-text>Are you sure you want to delete this user?</v-card-text>

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
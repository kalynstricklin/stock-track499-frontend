<script setup lang="ts">
import { ref, computed, nextTick, onMounted } from 'vue'
import { getStatusColor, showSnackbar, snackbar } from '@/utils/utils'

import { auth } from '@/firebase'

import { createUserRequest, deleteUserRequest, editUserRequest, fetchUserRequest } from '@/server/services/UserHandler'

interface UserItem {
  username: string;
  email: string;
  role: string;
  // profile_img: string;
}


const dialog = ref(false);
const dialogDelete = ref(false)
const editedItem = ref({ username: '', email: '', role: ''});
// const editedItem = ref({ username: '', email: '', role: '', profile_img: ''});
const defaultItem = ref({ username: '', email: '', role: ''});
// const defaultItem = ref({ username: '', email: '', role: '', profile_img: ''});
const editedIndex = ref(-1);
const selected = ref([])
//

const buttonTitle = computed(()=>{return editedIndex.value === -1 ? 'Add' : 'Update'})

const headers = [
  { title: 'User Name', key: 'username' },
  { title: 'Email', key: 'email' },
  { title: 'Role', key: 'role' },

  { title: 'Edit', key: 'edit', sortable: false },
  { title: 'Delete', key: 'delete', sortable: false },
];


const users = ref<UserItem[]>([])

async function initialize() {
  if(!auth.currentUser){
    return;
  }



  try{
    const token = await auth.currentUser.getIdToken();

    const userList = await fetchUserRequest(token);
    users.value = Array.isArray(userList) ? userList : [];
    showSnackbar(`Loaded all users!`, 'success');

  }catch(error: any){
    showSnackbar(`Error loading users: ${error.message}`, 'error');
  }
}

//when component is mounted data will load
onMounted(() => {
  initialize();
});

const close = () => {
  dialog.value = false;
  editedItem.value = { username: '', email: '', role: ''};
  // editedItem.value = { username: '', email: '', role: '', profile_img: ''};
};


async function save() {
  //check if required fields are filled
  if (!editedItem.value.username || !editedItem.value.email || !editedItem.value.role) {
    showSnackbar("Please fill out all required fields", 'error');
    return;
  }

  //check if authorized user
  if(!auth.currentUser){
    return;
  }


  try{
    const token = await auth.currentUser.getIdToken();


    if(editedIndex.value === -1){

      const newUser = {
        username: editedItem.value.username,
        email: editedItem.value.email,
        role: editedItem.value.role,
        // profile_img: editedItem.value.profile_img
      };


      const response = await createUserRequest(newUser, token);

      console.log('response', response);

      if(response === 'Success'){
        showSnackbar(`New User created: ${newUser.username}`, 'success');
        users.value =[newUser, ...users.value];
        close();

      }
      else{
        showSnackbar(response, 'error');
      }

    }else{
      const updatedItem = {
        ...editedItem.value,
      }

      const response = await editUserRequest(updatedItem, token);

      if(response === 'Success'){
        showSnackbar(`User updated: ${updatedItem.username}`, 'success');
        users.value.splice(editedIndex.value, 1, updatedItem);
        close();
      }else{
        showSnackbar(`Failed to update user: ${updatedItem.username}`, 'error');
      }

    }
  }catch(error: any){
    showSnackbar(`Error: ${error.message}`, 'error');
  }
};


const openDialog = () => {
  dialog.value = true;
  editedItem.value = defaultItem.value;
};

// search bar
const search = ref('')

async function deleteItemConfirm() {

  if(!auth.currentUser){
    return;
  }

  const token = await auth.currentUser.getIdToken();

  try{
    if (editedIndex.value !== -1) {
      const response = await deleteUserRequest(editedItem.value.username.toString(), token);

      if(response === 'Success'){
        showSnackbar(`Successfully deleted user: ${editedItem.value.username}`, 'success');
        users.value.splice(editedIndex.value, 1);
      }else{
        showSnackbar(`Failed to delete user: ${editedItem.value.username}`, 'error');
      }
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

function deleteItem(item: any){

  editedIndex.value = users.value.indexOf(item)
  editedItem.value = Object.assign({}, item)
  dialogDelete.value = true
}

function editItem(item: any){
  editedIndex.value = users.value.indexOf(item)
  editedItem.value = Object.assign({}, item)
  dialog.value= true;
}

const roles = ['admin', 'manager', 'customer', 'employee'];



</script>


<template>

    <v-data-table
      v-model="selected"
      v-model:search="search"
      :headers="headers"
      :items="users"
      item-value="username"
      :filter-keys="['username', 'createdOn', 'status', 'role', 'email']"
    >


<!--      <template v-slot:item.status="{ value }">-->
<!--        <v-chip :color="getStatusColor(value)">-->
<!--          {{ value }}-->
<!--        </v-chip>-->
<!--      </template>-->

      <template v-slot:top>
        <v-toolbar flat>
          <v-card-title class="d-flex align-center pe-2">Users</v-card-title>
        </v-toolbar>

        <v-row dense justify="space-between" align="center">
          <v-col cols="8">

            <!-- Search Users -->
            <v-text-field
              v-model="search"
              density="compact"
              label="Search Users"
              prepend-inner-icon="mdi-magnify"
              variant="solo-filled"
              class="search-bar"
              hide-details
              single-line
            ></v-text-field>
          </v-col>

          <!-- New User Popup dialog  -->
          <v-col cols="4" class="text-end" style="padding-right: 15px">
            <v-dialog v-model="dialog" max-width="600px">

              <template v-slot:activator="{ props }">
                <v-btn
                  class="text-none font-weight-regular"
                  prepend-icon= "mdi-account-multiple"
                  text="New User"
                  variant="tonal"
                  v-bind="props"
                  @click="openDialog">
                </v-btn>
              </template>


              <v-card
                prepend-icon="mdi-account"
                title="User"
              >
                <v-card-text>
                    <v-row dense>

                      <v-col cols="4">
                        <v-text-field
                          v-model="editedItem.username"
                          label="User Name*"

                        ></v-text-field>
                      </v-col>

                      <v-col cols="4">
                        <v-text-field
                          v-model="editedItem.email"
                          label="Email*"
                          readonly

                        ></v-text-field>
                      </v-col>

                      <v-col cols="4">
                        <v-select
                          v-model="editedItem.role"
                          :items="roles"
                          label="Role*">
                        </v-select>
                      </v-col>

<!--                      <v-col cols="4">-->
<!--                        <v-text-field-->
<!--                          v-model="editedItem.profile_img"-->
<!--                          label="Profile Image"-->
<!--                        ></v-text-field>-->
<!--                      </v-col>-->

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
                    @click= "save"
                  >{{buttonTitle}}</v-btn>

                </v-card-actions>


              </v-card>
            </v-dialog>
          </v-col>
        </v-row>

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


      </template>

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
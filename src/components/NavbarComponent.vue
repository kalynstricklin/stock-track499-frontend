<template>
  <v-toolbar>
    <v-app-bar color="inherit" prominent>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-app-bar-title>StockTrack</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn icon="mdi-dots-vertical" variant="text"></v-btn>
    </v-app-bar>


    <!--nav menu-->
    <v-navigation-drawer v-model="drawer" app width="300" >
      <v-list>
        <!-- Employee and Admin section-->
        <v-list-group v-if="role !== 'customer'">

          <v-list-item prepend-icon="mdi-view-dashboard" title="Dashboard" :to="{ path: '/dashboard' }"></v-list-item>
          <v-list-item prepend-icon="mdi-clipboard-list-outline" title="Inventory" :to="{ path: '/inventory' }"></v-list-item>
          <v-list-item prepend-icon="mdi-account-multiple" title="Suppliers" :to="{ path: '/suppliers' }"></v-list-item>

          <v-divider></v-divider>
          <v-list-item prepend-icon="mdi-basket" title="Warehouse Orders" :to="{ path: '/warehouseOrders' }"></v-list-item>
          <v-list-item prepend-icon="mdi-cart" title="Customer Orders" :to="{ path: '/orders' }"></v-list-item>

          <v-divider></v-divider>

          <v-list-item prepend-icon="mdi-account-badge" title="Account" :to="{ path: '/auth/account' }"></v-list-item>

          <v-list-item v-if="role === 'admin' || role ==='manager'" prepend-icon="mdi-account" title="Users" :to="{ path: '/users' }"></v-list-item>
        </v-list-group>

        <!--Customer Section-->
        <v-list-group v-if="role === 'customer'" >
          <v-list-item prepend-icon="mdi-account-badge" title="Account" :to="{ path: '/auth/account' }"></v-list-item>
          <v-list-item prepend-icon="mdi-clipboard-list-outline" title="Inventory" :to="{ path: '/inventory' }"></v-list-item>
          <v-list-item prepend-icon="mdi-cart" title="My Orders" :to="{ path: '/orders' }"></v-list-item>


        </v-list-group>

      </v-list>
    </v-navigation-drawer>

  </v-toolbar>
</template>


<style scoped>
.v-list-item {
  justify-content: flex-start;
}
</style>


<script setup lang="ts">

import { showSnackbar } from '@/utils/utils.js'
import { auth } from '@/firebase.js'
import { fetchUserRequest } from '@/server/services/UserHandler.js'
import { onMounted, ref } from 'vue'

//user roles
const role = ref('')
const drawer = ref(false);

async function initialize(){
  if(!auth.currentUser){
    showSnackbar('No authenticated user found.', 'error');
    return;
  }

  try{
    const token = await auth.currentUser.getIdToken();

    //set user role
    let users = await fetchUserRequest(token);

    if (!users || users.length === 0) {
      showSnackbar('No users found.', 'info');
      return;
    }


    const currUser = users.find((u: any) => u.email === auth?.currentUser?.email);
    if(!currUser){
      showSnackbar('User role not found', 'error')
      return;

    }

    role.value = currUser.role;
    console.log('role', currUser)

  }catch(error: any){
    showSnackbar(`Error: ${error.message}`, 'error');
  }
}

// onMounted(() => {
//   initialize();
// });

initialize();
</script>

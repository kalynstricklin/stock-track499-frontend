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
        <v-list-group v-if="role === 'employee' || role ==='admin' || role ==='manager'">

          <v-list-item prepend-icon="mdi-view-dashboard" title="Dashboard" :to="{ path: '/dashboard' }"></v-list-item>
          <v-list-item prepend-icon="mdi-clipboard-list-outline" title="Inventory" :to="{ path: '/inventory' }"></v-list-item>
          <v-list-item prepend-icon="mdi-account-multiple" title="Suppliers" :to="{ path: '/suppliers' }"></v-list-item>

          <v-divider></v-divider>
          <v-list-item prepend-icon="mdi-basket" title="Warehouse Orders" :to="{ path: '/warehouseOrders' }"></v-list-item>
          <v-list-item prepend-icon="mdi-cart" title="Customer Orders" :to="{ path: '/orders' }"></v-list-item>

          <v-divider></v-divider>

          <v-list-item prepend-icon="mdi-account-badge" title="Account" :to="{ path: '/auth/account' }"></v-list-item>

          <v-list-item v-if="role === 'admin' || role ==='manager'" prepend-icon="mdi-account" title="Users" :to="{ path: '/users' }"></v-list-item>
          <v-list-item v-if="role === 'admin'|| role ==='manager'" prepend-icon="mdi-folder" title="Reports" :to="{ path: '/reports' }"></v-list-item>
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


<script>
export default {
  data() {
    return {
      drawer: false,
      role: "", // values can be one of these:::: 'admin' 'employee' or 'customer'
    };
  },
  mounted() {
    this.role = this.getRole();
  },
  methods: {
    getRole(){
      return 'customer'
    }
  },
};
</script>

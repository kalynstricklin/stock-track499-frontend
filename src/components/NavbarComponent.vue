<template>
  <v-toolbar>
    <v-app-bar color="inherit" prominent>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-app-bar-title>StockTrack</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn icon="mdi-dots-vertical" variant="text"></v-btn>
    </v-app-bar>


    <!--nav menu-->
    <v-navigation-drawer v-model="drawer" app>
      <v-list>
        <v-list-item prepend-icon="mdi-view-dashboard" title="Dashboard" :to="{ path: '/dashboard' }"></v-list-item>
        <v-list-item prepend-icon="mdi-clipboard-list-outline" title="Inventory" :to="{ path: '/inventory' }"></v-list-item>
        <v-list-item prepend-icon="mdi-cart" title="Orders" :to="{ path: '/orders' }"></v-list-item>
        <v-divider></v-divider>

<!--        <v-list-item prepend-icon="mdi-wallet" title="Purchase Order" :to="{ path: '/purchase-order' }"></v-list-item>-->
<!--        <v-list-item prepend-icon="mdi-file" title="Invoice" :to="{ path: '/invoice' }"></v-list-item>-->
<!--        <v-divider></v-divider>-->

        <v-list-item prepend-icon="mdi-account-badge" title="Account" :to="{ path: '/auth/account' }"></v-list-item>
        <v-list-item prepend-icon="mdi-folder" title="Reports" :to="{ path: '/report' }"></v-list-item>
<!--        <v-list-item prepend-icon="mdi-cog" title="Settings" :to="{ path: '/settings' }"></v-list-item>-->


              <!--        only see these as admin?-->
<!--        <v-list-group v-if="isAdmin" prepend-icon="mdi-account" title="Admin">-->
          <v-list-item prepend-icon="mdi-account" title="Users" :to="{ path: '/users' }"></v-list-item>
          <v-list-item prepend-icon="mdi-badge-account" title="Roles" :to="{ path: '/roles' }"></v-list-item>
<!--        </v-list-group>-->

      </v-list>
    </v-navigation-drawer>

  </v-toolbar>
</template>


<style scoped>

</style>


<script>
export default {
  data() {
    return {
      drawer: false,
      isAdmin: true,
      adminGroupOpen: false
    };
  },
  mounted() {
    // replace this with actual admin role checking
    this.isAdmin = this.checkIfAdmin();
  },
  methods: {
    checkIfAdmin() {

      return true;
    },
  },
};
</script>

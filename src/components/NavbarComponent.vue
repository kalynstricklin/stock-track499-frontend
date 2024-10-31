<template>
  <v-toolbar>
    <v-app-bar color="info" prominent>
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
        <v-list-item prepend-icon="mdi-account-badge" title="Account" :to="{ path: '/auth/account' }"></v-list-item>
        <v-list-item prepend-icon="mdi-cog" title="Settings" :to="{ path: '/settings' }"></v-list-item>
      </v-list>
    </v-navigation-drawer>

  </v-toolbar>
</template>


<style scoped>

</style>

<script>

export default {
  data: () =>({
        drawer: false,
        group: null,
  }),
  watch: {
    group() {
      this.drawer = false
    },
  }
}
</script>

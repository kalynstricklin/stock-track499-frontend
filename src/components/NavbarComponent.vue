<template>
  <v-app>
    <v-app-bar color="primary" prominent>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

      <v-app-bar-title>StockTrack</v-app-bar-title>

      <v-spacer></v-spacer>

      <v-btn icon="mdi-dots-vertical" variant="text"></v-btn>
    </v-app-bar>

    <!--nav menu-->
    <v-navigation-drawer
      v-model="drawer"
      :location="$vuetify.display.mobile ? 'left' : undefined"
      temporary
    >
      <v-list>
        <v-list-item prepend-icon="mdi-view-dashboard" title="Dashboard" :to="{ path: '/DashboardView' }"></v-list-item>
        <v-list-item prepend-icon="mdi-clipboard-list-outline" title="Inventory" :to="{ path: '/InventoryView' }"></v-list-item>
        <v-list-item prepend-icon="mdi-cart" title="Orders" :to="{ path: '/OrdersView' }"></v-list-item>
<!--        <v-list-item prepend-icon="mdi-account-group" title="Suppliers" :to="{ path: '/SupplierView' }"></v-list-item>-->
<!--        <v-list-item prepend-icon="mdi-map-marker-path" title="Tracking" :to="{ path: '/TrackingView' }"></v-list-item>-->
        <v-divider></v-divider>
        <v-list-item prepend-icon="mdi-account-badge" title="Account" :to="{ path: '/AccountView' }"></v-list-item>
<!--        <v-list-item prepend-icon="mdi-chart-line" title="Reports" :to="{ path: '/ReportView' }"></v-list-item>-->
        <v-list-item prepend-icon="mdi-cog" title="Settings" :to="{ path: '/SettingsView' }"></v-list-item>
      </v-list>
    </v-navigation-drawer>


    <v-main style="height: 500px">
      <v-card-text>
          <!--main content?-->
      </v-card-text>

    </v-main>

  </v-app>
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

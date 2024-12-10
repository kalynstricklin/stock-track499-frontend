<script setup lang="ts">

import { getStatusColor, showSnackbar, snackbar } from '@/utils/utils'
import { auth } from '@/firebase'
import {
  fetchStatRequest,
  deleteStatRequest,
  createStatRequest
} from '@/server/services/StatsHandler'
import { fetchUserByUid } from '@/server/services/UserHandler'
import { ref, computed, nextTick, onMounted } from 'vue'

// Define the structure of statItems
interface StatItems {
  revenue: number;
  num_customers: number;
  num_orders: number;
  num_low_stock_items: number;
}

// statItems with a type
const statItems = ref<StatItems | null>(null);

//user roles
const role = ref('')
// Reactive variables for dashboard stats
const customerCount = ref(0); // Updated to ref for reactivity
const revenueTotal = ref(0);
const orderCount = ref(0);
const lowStockCount = ref(0);

async function initialize() {
  if (!auth.currentUser) {
    showSnackbar('No authenticated user found.', 'error');
    return;
  }

  try {
    const token = await auth.currentUser.getIdToken();

    // Set user role
    const user = await fetchUserByUid(auth.currentUser.uid, token);

    if (!user) {
      showSnackbar('No user found.', 'info');
      return;
    }

    role.value = user.role;

    // Fetch stat items
    const today = new Date();
    const formattedDate = `${today.getMonth() + 1}-${today.getDate()}-${today.getFullYear()}`;
    statItems.value = await fetchStatRequest(token, formattedDate); // Update value property

    console.log('stat items', statItems.value);

    // Update reactive variables
    if (statItems.value) {
      customerCount.value = statItems.value.num_customers || 0; // Dynamically set customer count
      revenueTotal.value = Number(statItems.value.revenue).toFixed(2) || 0;// Format revenue as string
      orderCount.value = statItems.value.num_orders || 0; // Update order count
      lowStockCount.value = statItems.value.num_low_stock_items || 0; // Update low stock count
    }

    showSnackbar(`Loaded Statistics!`, 'success');
  } catch (error: any) {
    showSnackbar(`Error loading dashboard: ${error.message}`, 'error');
  }
}

//when component is mounted data will load
onMounted(() => {
  initialize();
});

function exportJSON() {
  console.log('stat items', statItems.value)
  if (!statItems.value) {
    showSnackbar('No data available to export.', 'error');
    return;
  }

  const dataStr = JSON.stringify(statItems.value, null, 2); // Pretty-print JSON
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  // Create a temporary link element to trigger the download
  const link = document.createElement('a');
  link.href = url;
  link.download = `stats-${new Date().toISOString().slice(0, 10)}.json`; // File name with today's date
  document.body.appendChild(link);
  link.click();

  // Clean up
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  showSnackbar('Exported JSON data successfully!', 'success');
}
</script>
<template>
  <v-container id="dashboard" fluid tag="section">
    
    <v-row 
      justify="end" 
      class="mb-8">
      <v-btn 
        append-icon="mdi-download" 
        color="primary"
        rounded="xl"
        @click="exportJSON">
        Export Data
      </v-btn>
    </v-row>

    <v-row>
      <v-col
        cols="12"
        sm="6"
        lg="3"
        style="position: relative;">

        <v-card
          class="pa-4"
          color="info"
          style=" position: absolute; top: 0px; left: 28px; z-index: 1;"
        >
          <v-icon left size="48">mdi-account-multiple</v-icon>
        </v-card>


        <v-card class="pa-2">
          <v-card-subtitle class="text-right">
            Customers
          </v-card-subtitle>


          <v-card-title class="text-right" style="font-size: 2rem;">
            + {{ customerCount }}
          </v-card-title>

          <v-card-subtitle>
            <v-icon small left>mdi-clock</v-icon>
            Just Updated
          </v-card-subtitle>
        </v-card>
      </v-col>

      <v-col
        cols="12"
        sm="6"
        lg="3"
        style="position: relative;"
      >

        <v-card
          class="pa-4"
          color="success"
          style=" position: absolute; top: 0px; left: 28px; z-index: 1;"
        >
          <v-icon left size="48">mdi-store</v-icon>
        </v-card>

        <v-card class="pa-2">
          <v-card-subtitle class="text-right">Revenue</v-card-subtitle>

          <v-card-title class="text-right" style="font-size: 2rem;">$ {{ revenueTotal }}</v-card-title>
          <v-card-subtitle>
            <v-icon small left>mdi-calendar</v-icon>
            Last 24 Hours
          </v-card-subtitle>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" lg="3" style="position: relative;">
        <v-card
          class="pa-4"
          color="warning"
          style=" position: absolute; top: 0px; left: 28px; z-index: 1;"
        >
          <v-icon left size="48">mdi-cart</v-icon>
        </v-card>

        <v-card class="pa-2">
          <v-card-subtitle class="text-right">Customer Orders</v-card-subtitle>

          <v-card-title class="text-right" style="font-size: 2rem;">{{ orderCount }}</v-card-title>

          <v-card-subtitle>
            <v-icon small left>mdi-calendar</v-icon>
            Last 24 Hours
          </v-card-subtitle>
        </v-card>
      </v-col>


      <v-col cols="12" sm="6" lg="3" style="position: relative;">
        <v-card
          class="pa-4"
          color="red"
          style=" position: absolute; top: 0px; left: 28px; z-index: 1;"
        >
          <v-icon left size="48">mdi-package-variant-closed</v-icon>
        </v-card>

        <v-card class="pa-2">
          <v-card-subtitle class="text-right">Low Stock</v-card-subtitle>

          <v-card-title class="text-right" style="font-size: 2rem;">
            {{ lowStockCount }}
          </v-card-title>
          <v-card-subtitle>
            <v-icon small left >mdi-alert</v-icon>
            Check Inventory
          </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>


<style scoped>
</style>
<script setup lang="ts">

import AlertCards from '@/components/dashboard/AlertCards.vue'
import SalesChart from '@/components/dashboard/RevenueChart.vue'
import OrdersChart from '@/components/dashboard/OrdersChart.vue'
import TopSellingTable from '@/components/dashboard/TopSellingTable.vue'

</script>

<template>

  <v-container id="dashboard" fluid tag="section">
    <AlertCards/>


      <v-row>
        <v-col cols="12" md="6">
          <v-card class="chart-card">
            <OrdersChart/>
          </v-card>

        </v-col>

        <v-col cols="12" md="6">
          <v-card class="chart-card">
            <SalesChart/>
          </v-card>

        </v-col>
      </v-row>

    <!-- Top Selling Table -->
    <v-card outlined class="mt-4 pa-4 elevation-1">
      <TopSellingTable />
    </v-card>
  </v-container>



</template>

<style scoped>
.chart-card {
  height: 500px;
}
</style>
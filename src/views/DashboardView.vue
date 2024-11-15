<script setup lang="ts">

import AlertCards from '@/components/dashboard/AlertCards.vue'
import StockLevelChart from '@/components/dashboard/StockLevelChart.vue'
import BarChart from '@/components/dashboard/SalesChart.vue'
import OrdersVsReturnsChart from '@/components/dashboard/OrdersVsReturnsChart.vue'
</script>

<template>

  <AlertCards/>

  <v-container>
    <v-row>
      <div style="width: 800px; padding:20px">
        <v-col>
          <v-row>
            <BarChart />

          </v-row>
        </v-col>

      </div>
      <v-spacer></v-spacer>
      <div style="width: 800px; padding:20px">
        <StockLevelChart />
<!--        <OrdersVsReturnsChart/>-->

      </div>
    </v-row>


  </v-container>


</template>

<style scoped>
.v-container {
  padding: 20px;
}


</style>
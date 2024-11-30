<script setup lang="ts">

import AlertCards from '@/components/dashboard/AlertCards.vue'
import StockLevelChart from '@/components/dashboard/OrderStatsChart.vue'
import BarChart from '@/components/dashboard/SalesChart.vue'

</script>

<template>

  <AlertCards/>

    <v-row>
      <v-col cols="12" md="6">
        <v-card outlined>
          <v-card-text>
            <BarChart />
          </v-card-text>
        </v-card>
      </v-col>


      <v-spacer></v-spacer>
      <v-col cols="12" md="6">
        <v-card outlined>

          <v-card-text>
            <StockLevelChart />
          </v-card-text>
        </v-card>
      </v-col>

    </v-row>



</template>

<style scoped>
.v-container {
  padding: 20px;
}


</style>
<script setup lang="ts">
import BarChart from '@/components/dashboard/BarChart.vue'
import StockLevelChart from '@/components/dashboard/StockLevelChart.vue'

</script>


<template>
  <v-container id="dashboard" fluid tag="section">
    <v-row>
      <v-col cols="12" sm="6" lg="3">
        <v-card class="mx-auto">
          <v-card-title>
            Low Stock Items
          </v-card-title>
          <v-card-text>
            <h3 class="display-2 font-weight-light text--primary">
              3
              <small></small>
            </h3>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" lg="3">
        <v-card class="mx-auto">
          <v-card-title>
            Total Revenue
          </v-card-title>
          <v-card-text>
            <h3 class="display-2 font-weight-light text--primary">
              $1000
              <small></small>
            </h3>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <div style="width: 800px;">
      <BarChart />
    </div>
    <div style="width: 800px;">
      <StockLevelChart />
    </div>
  </v-container>
</template>


<style scoped>

</style>
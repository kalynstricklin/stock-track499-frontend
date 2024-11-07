<script setup lang="ts">
import BarChart from '@/components/dashboard/BarChart.vue'
import StockLevelChart from '@/components/dashboard/StockLevelChart.vue'

</script>


<template>
  <v-container id="dashboard" fluid tag="section">
    <v-row>
      <v-col cols="12" sm="6" lg="3">
        <v-card class="dashboard-card">
          <v-card-title>Low Stock Items</v-card-title>
          <v-card-text class="card-text">
            <h3 class="display-2 font-weight-light text--primary">8</h3>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" lg="3">
        <v-card class="dashboard-card">
          <v-card-title>Total Revenue</v-card-title>
          <v-card-text class="card-text">
            <h3 class="display-2 font-weight-light text--primary">$10000</h3>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" lg="3">
        <v-card class="dashboard-card">
          <v-card-title>Pending Orders</v-card-title>
          <v-card-text class="card-text">
            <h3 class="display-2 font-weight-light text--primary">250</h3>
          </v-card-text>
        </v-card>
      </v-col>


      <v-col cols="12" sm="6" lg="3">
        <v-card class="dashboard-card">
          <v-card-title>Returns</v-card-title>
          <v-card-text class="card-text">
            <h3 class="display-2 font-weight-light text--primary">4</h3>
          </v-card-text>
        </v-card>
      </v-col>


    </v-row>

  </v-container>
</template>


<style scoped>
#dashboard{
  background-color: #f4f6f8;
  padding: 20px;
}

.dashboard-card {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 15px;
  text-align: center;
}

.card-title {
  font-weight: bold;
  color: #333333;
  margin-bottom: 10px;
  font-size: 1.2rem;
}

.card-text {
  font-size: 2rem;
  color: #1e88e5;
}

.v-container {
  padding: 20px;
}

</style>
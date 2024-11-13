<script setup lang="ts">
import BarChart from '@/components/dashboard/BarChart.vue'
import StockLevelChart from '@/components/dashboard/StockLevelChart.vue'

</script>


<template>
  <v-container id="dashboard" fluid tag="section">
    <v-row>

      <v-col cols="12" sm="6" lg="3">
        <v-card class="dashboard-card" outlined>
          <v-row align="center" justify="space-between">
            <v-col class="text-left" cols="4">
              <v-avatar color="amber-lighten-5" size="65">
                <v-icon color="yellow-darken-1" size="30">mdi-cart</v-icon>
              </v-avatar>
            </v-col>
            <v-col cols="8">
              <v-card-title class="text-h4 mb-1">5</v-card-title>
              <v-card-subtitle>Low Stock Items</v-card-subtitle>
            </v-col>
          </v-row>
        </v-card>
      </v-col>



      <v-col cols="12" sm="6" lg="3">
        <v-card class="dashboard-card" outlined>
          <v-row align="center" justify="space-between">
            <v-col class="text-left" cols="4">
              <v-avatar color="green-lighten-5" size="65">
                <v-icon color="success" size="35">mdi-cash</v-icon>
              </v-avatar>
            </v-col>
            <v-col cols="8">
              <v-card-title class="text-h4 mb-1" >$10000</v-card-title>
              <v-card-subtitle>Total Revenue</v-card-subtitle>
            </v-col>
          </v-row>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" lg="3">
        <v-card class="dashboard-card" outlined>
          <v-row align="center" justify="space-between">
            <v-col class="text-left" cols="4">
              <v-avatar color="amber-lighten-5" size="65">
                <v-icon color="yellow-darken-1" size="30">mdi-cart</v-icon>
              </v-avatar>
            </v-col>
            <v-col cols="8">
              <v-card-title class="text-h4 mb-1">5</v-card-title>
              <v-card-subtitle>Low Stock Items</v-card-subtitle>
            </v-col>
          </v-row>
        </v-card>
      </v-col>



      <v-col cols="12" sm="6" lg="3">
        <v-card class="dashboard-card" outlined>
          <v-row align="center" justify="space-between">
            <v-col class="text-left" cols="4">
              <v-avatar color="green-lighten-5" size="65">
                <v-icon color="success" size="35">mdi-cash</v-icon>
              </v-avatar>
            </v-col>
            <v-col cols="8">
              <v-card-title class="text-h4 mb-1" >$10000</v-card-title>
              <v-card-subtitle>Total Revenue</v-card-subtitle>
            </v-col>
          </v-row>
        </v-card>
      </v-col>



      <v-col cols="12" sm="6" lg="3">
        <v-card class="dashboard-card" outlined color="teal-darken-1">
          <v-row align="center" justify="space-between">
            <v-col class="text-left" cols="8">
              <v-card-title class="text-h4 mb-1" >172</v-card-title>
              <v-card-subtitle>Orders</v-card-subtitle>
            </v-col>
            <v-col class="text-right" cols="4">
              <v-icon size="80">mdi-file-account</v-icon>
            </v-col>

          </v-row>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" lg="3">
        <v-card class="dashboard-card" outlined color="deep-purple-darken-1">
          <v-row align="center" justify="space-between">
            <v-col class="text-left" cols="8">
              <v-card-title class="text-h4 mb-1" >172</v-card-title>
              <v-card-subtitle>Customers</v-card-subtitle>
            </v-col>
            <v-col class="text-right" cols="4">
              <v-icon size="80">mdi-account</v-icon>
            </v-col>

          </v-row>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" lg="3">
        <v-card class="dashboard-card" outlined color="green-darken-1">
          <v-row align="center" justify="space-between">
            <v-col class="text-left" cols="8">
              <v-card-title class="text-h4 mb-1">10</v-card-title>
              <v-card-subtitle>Suppliers</v-card-subtitle>
            </v-col>
            <v-col class="text-right" cols="4">
              <v-icon size="80">mdi-account-multiple-outline</v-icon>
            </v-col>
          </v-row>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" lg="3">
        <v-card class="dashboard-card" outlined color="light-blue-darken-1">
          <v-row align="center" justify="space-between">
            <v-col class="text-left" cols="8">
              <v-card-title class="text-h4 mb-1">10</v-card-title>
              <v-card-subtitle>Suppliers</v-card-subtitle>
            </v-col>
            <v-col class="text-right" cols="4">
              <v-icon size="80">mdi-account-multiple-outline</v-icon>
            </v-col>
          </v-row>
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
  padding: 10px;
  text-align: center;
}

.card-text {
  font-size: 2rem;
  color: #1e88e5;
}

.v-container {
  padding: 20px;
}

</style>
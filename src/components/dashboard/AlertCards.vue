<script setup lang="ts">
const customerCount = 245;
const revenueTotal = '39,433';
const orderCount = 344;
const lowStockCount = 12;
</script>
<template>
  <v-container id="dashboard" fluid tag="section">
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
          <v-card-subtitle class="text-right">Orders</v-card-subtitle>

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
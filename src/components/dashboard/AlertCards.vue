<script setup lang="ts">

</script>
<template>
  <v-container id="dashboard" fluid tag="section">
    <v-row>

      <v-col cols="12" sm="6" lg="3">
        <v-card class="dashboard-card" outlined elevation="16">
          <v-row align="center" justify="space-between">
            <v-col class="text-left" cols="4">
              <v-avatar color="green-lighten-5" size="65">
                <v-icon color="success" size="30">mdi-package-variant-closed</v-icon>
              </v-avatar>
            </v-col>
            <v-col cols="8">
              <v-card-title class="text-h4 mb-1">$250,000</v-card-title>
              <v-card-subtitle>Total Inventory Value</v-card-subtitle>
            </v-col>
          </v-row>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" lg="3">
        <v-card class="dashboard-card" outlined elevation="16">
          <v-row align="center" justify="space-between">
            <v-col class="text-left" cols="4">
              <v-avatar color="amber-lighten-5" size="65">
                <v-icon color="yellow-darken-1" size="30">mdi-alert-outline</v-icon>
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
        <v-card class="dashboard-card" outlined elevation="16">
          <v-row align="center" justify="space-between">
            <v-col class="text-left" cols="4">
              <v-avatar color="red-lighten-5" size="65">
                <v-icon color="error" size="35">mdi-cart-remove</v-icon>
              </v-avatar>
            </v-col>
            <v-col cols="8">
              <v-card-title class="text-h4 mb-1">3</v-card-title>
              <v-card-subtitle>Out of Stock</v-card-subtitle>
            </v-col>
          </v-row>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" lg="3">
        <v-card class="dashboard-card" outlined elevation="16">
          <v-row align="center" justify="space-between">
            <v-col class="text-left" cols="4">
              <v-avatar color="purple-lighten-5" size="65">
                <v-icon color="purple-darken-2" size="35">mdi-star</v-icon>
              </v-avatar>

            </v-col>
            <v-col cols="8">
              <v-card-title class="text-h4 mb-1">Scarf</v-card-title>
              <v-card-subtitle>Top Selling Item</v-card-subtitle>
            </v-col>
          </v-row>
        </v-card>
      </v-col>


      <v-col cols="12" sm="6" lg="3">
        <v-card class="dashboard-card" outlined color="teal-darken-1" elevation="8" hover>
          <v-row align="center" justify="space-between" class="pa-3">
            <v-col class="text-left" cols="8">
              <v-card-item>

                <v-card-subtitle class="text-body-1" style="color: #fff; margin: 0;">
                  Today
                </v-card-subtitle>
<!--                <v-card-title class="text-h3" style="margin: -10px 0; color: #fff;">-->
<!--                  72-->
<!--                </v-card-title>-->

                <v-card-title style=" color: #fff;">
                  <span class="text-h3">72</span>
                  <span class="text-body-1"  style="margin-left: 8px; color: #92ccc6;">Orders</span>
                </v-card-title>

<!--                <v-card-subtitle class="text-body-1" style="color: #ffffff; margin-top: -5px;">-->
<!--                  Orders-->
<!--                </v-card-subtitle>-->

                <v-card-title class="text-sm-body-2 mb-0" style="display: flex; align-items: center; color: #fff;">
                  <v-icon class="mr-1" small>mdi-menu-up</v-icon>
                  37 vs same day last week
                </v-card-title>

              </v-card-item>
            </v-col>
            <v-col class="text-right" cols="4">
              <v-icon size="95">mdi-package-variant-closed</v-icon>
            </v-col>
          </v-row>
        </v-card>
      </v-col>


      <v-col cols="12" sm="6" lg="3">
        <v-card class="dashboard-card" outlined color="teal-darken-1" elevation="8" hover>
          <v-row align="center" justify="space-between" class="pa-3">
            <v-col class="text-left" cols="8">
              <v-card-item>

                <v-card-subtitle class="text-body-1" style="color: #fff; margin: 0;">
                  Today
                </v-card-subtitle>


                <v-card-title style=" color: #fff;">
                  <span class="text-h3">$21.8k</span>
                  <span class="text-body-1"  style="margin-left: 8px; color: #92ccc6;">Revenue</span>
                </v-card-title>
<!--                <v-card-title class="text-h3" style="margin: -10px 0; color: #fff;">-->
<!--                  $21.8k-->
<!--                </v-card-title>-->

<!--                <v-card-subtitle class="text-body-1" style="color: #ffffff; margin-top: -5px;">-->
<!--                  Revenue-->
<!--                </v-card-subtitle>-->

                <v-card-title class="text-sm-body-2 mb-0" style="display: flex; align-items: center; color: #fff;">
                  <v-icon class="mr-1" small>mdi-menu-up</v-icon>
                  $3k vs same day last week
                </v-card-title>
              </v-card-item>
            </v-col>
            <v-col class="text-right" cols="4">
              <v-icon size="95">mdi-cash</v-icon>
            </v-col>
          </v-row>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" lg="3">
        <v-card class="dashboard-card" outlined color="teal-darken-1" elevation="8" hover>
          <v-row align="center" justify="space-between" class="pa-3">
            <v-col class="text-left" cols="8">
              <v-card-item>

                <v-card-subtitle class="text-body-1" style="color: #fff; margin: 0;">
                  Past 30 days
                </v-card-subtitle>


                <v-card-title style=" color: #fff;">
                  <span class="text-h3">2988</span>
                  <span class="text-body-1"  style="margin-left: 8px; color: #92ccc6;">Orders</span>
                </v-card-title>

                <v-card-title class="text-sm-body-2 mb-0" style="display: flex; align-items: center; color: #fff;">
                  <v-icon class="mr-1" small>mdi-menu-up</v-icon>
                  723 vs last month
                </v-card-title>
              </v-card-item>
            </v-col>
            <v-col class="text-right" cols="4">
              <v-icon size="95">mdi-package-variant-closed</v-icon>
            </v-col>
          </v-row>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" lg="3">
        <v-card class="dashboard-card" outlined color="teal-darken-1" elevation="8" hover>
          <v-row align="center" justify="space-between" class="pa-3">
            <v-col class="text-left" cols="8">
              <v-card-item>

                <v-card-subtitle class="text-body-1" style="color: #fff; margin: 0;">
                  Past 30 days
                </v-card-subtitle>


                <v-card-title style=" color: #fff;">
                  <span class="text-h3">$451.8k</span>
                  <span class="text-body-1"  style="margin-left: 8px; color: #92ccc6;">Revenue</span>
                </v-card-title>

                <v-card-title class="text-sm-body-2 mb-0" style="display: flex; align-items: center; color: #fff;">
                  <v-icon class="mr-1" small>mdi-menu-up</v-icon>
                  $32.1k vs last month
                </v-card-title>
              </v-card-item>
            </v-col>
            <v-col class="text-right" cols="4">
              <v-icon size="95">mdi-cash</v-icon>
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

.v-card-item{
  padding: 0;
}

.v-card-title {
  margin: 0;
  font-size: 1.5rem;
}

.card-text {
  font-size: 2rem;
  color: #1e88e5;
}

.v-container {
  padding: 20px;
}


</style>
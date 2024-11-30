<script setup lang="ts">
import ReportCards from '@/components/report/ReportCards.vue'

import SalesVsRevenueChart from '@/components/report/SalesChart.vue'
import OrderStatsChart from '@/components/dashboard/OrderStatsChart.vue'
import TopSellingTable from '@/components/report/TopSellingTable.vue'
import { ref } from 'vue'

const dialog = ref(false)
const defaultItem = ref({start_date: '', end_date: ''})
const editedItem = ref({start_date: '', end_date: ''})


const exportReport = () =>{
  console.log('')
}

function updateDate(){
  console.log('')
}

function openDateDialog(){
  dialog.value = true;
  editedItem.value = defaultItem.value
}


</script>

<template>

<v-row>
  <v-col cols="4" class="text-end" style="padding-right: 15px">
    <v-btn
      class="text-none font-weight-regular"
      prepend-icon= "mdi-clipboard-list-outline"
      text="Export"
      variant="tonal"
      @click="exportReport">
    </v-btn>
  </v-col>



  <v-col cols="4" class="text-end" style="padding-right: 15px">
    <v-dialog v-model="dialog" max-width="600px">
      <template v-slot:activator="{ props }">
        <v-btn
          class="text-none font-weight-regular"
          prepend-icon= "mdi-calendar"
          text="Date"
          variant="tonal"
          v-bind="props"
          @click="openDateDialog">
        </v-btn>
      </template>
      <v-card
        prepend-icon="mdi-calendar"
        title="Choose Date"
      >
        <v-card-text>
          <v-row dense>

            <v-col cols="12" md="4" sm="6">
              <v-text-field
                v-model="editedItem.start_date"
                label="Start Date*"
                required
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="4" sm="6">
              <v-text-field
                v-model="editedItem.end_date"
                label="End Date*"
                required
              ></v-text-field>
            </v-col>
          </v-row>
          <small class="text-caption text-medium-emphasis">*indicates required field</small>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            text="Close"
            variant="plain"
            @click="dialog=false"
          ></v-btn>

          <v-btn
            color="primary"
            variant="tonal"
            @click="updateDate"
          >Update Date</v-btn>

        </v-card-actions>

      </v-card>
    </v-dialog>
  </v-col>
</v-row>



<v-container>
  <v-card outlined>
    <v-card-text>
      <ReportCards/>
    </v-card-text>
  </v-card>

</v-container>



<v-container>
  <v-row>
    <v-col cols="12" md="6">
      <v-card outlined>
        <v-card-text>
          <SalesVsRevenueChart />
        </v-card-text>
      </v-card>
    </v-col>


    <v-spacer></v-spacer>
    <v-col cols="12" md="6">
      <v-card outlined>

        <v-card-text>
          <OrderStatsChart />
        </v-card-text>
      </v-card>
    </v-col>

  </v-row>



</v-container>

  <v-spacer></v-spacer>
  <v-container>
    <v-card outlined>
      <v-card-text>

        <TopSellingTable/>


      </v-card-text>

    </v-card>
  </v-container>




</template>

<style scoped>

</style>
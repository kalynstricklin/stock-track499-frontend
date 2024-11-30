<script setup lang="ts">
import { onMounted } from 'vue';
import Chart from 'chart.js/auto';


onMounted(() => {
  const data = [
    { day: 'Sunday', orders: 10 },
    { day: 'Monday', orders: 20 },
    { day: 'Tuesday', orders: 15 },
    { day: 'Wednesday', orders: 25 },
    { day: 'Thursday', orders: 22 },
    { day: 'Friday', orders: 30 },
    { day: 'Saturday', orders: 25 },
  ];


  const ctx = document.getElementById('stockLevels') as HTMLCanvasElement;

  if (ctx) {
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.map(row => row.day),
        datasets: [
          {
            label: 'Orders',
            data: data.map(row => row.orders),
            backgroundColor: 'rgba(2,138,124,0.3)',
            borderColor: 'rgb(2,138,124)',
            borderWidth: 1,
            borderRadius: 15,
          },
        ]
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Order Statistics',
            font: {
              size: 18,
              weight: 'bold'
            },
          },
          legend: {
            position: 'bottom',
          }
        },
        scales: {
          x:{
            title: {
              display: true,
              text: 'Inventory Items'
            },
            beginAtZero: true,
            stacked: true

          },
          y: {
            title: {
              display: true,
              text: 'Count',
            },
            stacked: true,
            beginAtZero: true
          }
        }
      }
    });
  }
});
</script>

<template>
  <v-container id="stockLevelChart" fluid tag="section">
    <div style="width: 800px;">
      <canvas id="stockLevels"></canvas>
    </div>
  </v-container>
</template>


<style scoped>

</style>
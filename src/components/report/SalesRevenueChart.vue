<script setup lang="ts">
import { onMounted } from 'vue';
import Chart from 'chart.js/auto';

onMounted(() => {
  const data = [
    { day: 'Sunday', sales: 10 },
    { day: 'Monday', sales: 20 },
    { day: 'Tuesday', sales: 15 },
    { day: 'Wednesday', sales: 25 },
    { day: 'Thursday', sales: 22 },
    { day: 'Friday', sales: 30 },
    { day: 'Saturday', sales: 25 },
  ];

  const data2 = [
    { day: 'Sunday',  revenue: 7 },
    { day: 'Monday',  revenue: 15 },
    { day: 'Tuesday', revenue: 9 },
    { day: 'Wednesday', revenue: 18 },
    { day: 'Thursday', revenue: 13 },
    { day: 'Friday',  revenue: 20 },
    { day: 'Saturday', revenue: 23 },
  ];

  const ctx = document.getElementById('salesTrends') as HTMLCanvasElement;

  if (ctx) {
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.map(row => row.day),
        datasets: [
          {
            label: 'Sales Overview',
            data: data.map(row => row.sales),

            backgroundColor: 'rgba(2,138,124,0.3)',
            borderColor: 'rgb(2,138,124)',
            borderWidth: 1,

          },
          {
            label: 'Revenue Overview',
            data: data2.map(row => row.revenue),

            backgroundColor: 'rgba(209,47,48,0.3)',
            borderColor: 'rgb(209,47,48)',
            borderWidth: 1,

          },
        ]
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Warehouse Sales Trends',
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
              text: 'Years'
            },
            beginAtZero: true,
            stacked: true

          },
          y: {
            title: {
              display: true,
              text: 'Sales per thousand $',
            },
            beginAtZero: true,
            stacked: true
          }
        }
      }
    });
  }
});
</script>


<template>
  <v-container id="salesTrendsChart" fluid tag="section">
    <div style="width: 800px;">
      <canvas id="salesTrends"></canvas>
    </div>
  </v-container>
</template>


<style scoped>

</style>
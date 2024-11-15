<script setup lang="ts">
import { onMounted } from 'vue';
import Chart from 'chart.js/auto';

onMounted(() => {
  const data = [
    { year: 2010, revenue: 10 },
    { year: 2011, revenue: 20},
    { year: 2012, revenue: 15},
    { year: 2013, revenue: 25 },
    { year: 2014, revenue: 22 },
    { year: 2015, revenue: 30 },
    { year: 2016, revenue: 25 },
  ];

  const ctx = document.getElementById('salesTrends') as HTMLCanvasElement;

  if (ctx) {
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.map(row => row.year),
        datasets: [
          {
            label: 'Sales Revenue',
            data: data.map(row => row.revenue),

            backgroundColor: 'rgba(2,138,124,0.3)',
            borderColor: 'rgb(2,138,124)',
            borderWidth: 1,

          },
        ]
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Warehouse Sales',
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
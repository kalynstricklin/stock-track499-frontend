<script setup lang="ts">
import { onMounted } from 'vue';
import Chart from 'chart.js/auto';

onMounted(() => {
  const data = [
    { year: 2010, count: 10 },
    { year: 2011, count: 20 },
    { year: 2012, count: 15 },
    { year: 2013, count: 25 },
    { year: 2014, count: 22 },
    { year: 2015, count: 30 },
    { year: 2016, count: 28 },
  ];

  const ctx = document.getElementById('salesTrends') as HTMLCanvasElement;

  if (ctx) {
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.map(row => row.year),
        datasets: [
          {
            label: 'Sales Trends over Time',
            data: data.map(row => row.count),
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          }
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
            beginAtZero: true

          },
          y: {
            title: {
              display: true,
              text: 'Sales per thousand $',
            },
            beginAtZero: true
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
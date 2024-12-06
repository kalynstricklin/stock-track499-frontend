<script setup lang="ts">
import { onMounted } from 'vue';
import Chart from 'chart.js/auto';
//todo: function to calc the total revenue so add up all the orders and subtract the inbound order total from running total
onMounted(() => {
  const data = [
    { day: 'M', revenue: 10 },
    { day: 'T', revenue: 20 },
    { day: 'W', revenue: 15 },
    { day: 'T', revenue: 25 },
    { day: 'F', revenue: 22 },
    { day: 'S', revenue: 30 },
    { day: 'S', revenue: 25 },
  ];

  const ctx = document.getElementById('salesTrends') as HTMLCanvasElement;

  if (ctx) {
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.map(row => row.day),
        datasets: [
          {
            label: 'Sales Revenue',
            data: data.map(row => row.revenue),
            backgroundColor: 'rgba(2,138,124,0.3)',
            borderColor: 'rgb(2,138,124)',
            borderWidth: 2,
            pointRadius: 4,
            pointBackgroundColor: 'rgb(255,255,255)',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Warehouse Sales',
            // color: 'rgb(0,0,0)',

            font: {
              size: 18,
              weight: 'bold',

            },
          },
          legend: {
            position: 'bottom',
            display: false,
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Days'
            },
            // ticks: {
            //   color: 'rgba(255,255,255,0.51)',
            // },
            // grid: {
            //   color: 'rgba(255,255,255,0.51)',
            // },
          },
          y: {
            title: {
              display: true,
              text: 'Sales per thousand $',
            },
            // ticks: {
            //   color: 'rgba(255,255,255,0.51)',
            // },
            // grid: {
            //   color: 'rgba(255,255,255,0.51)',
            // },
            beginAtZero: true,
          },
        },
      },
    });
  }
});
</script>

<template>
  <v-container id="salesTrendsChart" fluid tag="section">
    <div style="width: 100%; height: 450px;">
      <canvas id="salesTrends"></canvas>
    </div>
  </v-container>
</template>

<style scoped>
</style>

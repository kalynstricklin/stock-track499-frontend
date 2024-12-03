<script setup lang="ts">
import { onMounted } from 'vue';
import Chart from 'chart.js/auto';

//todo: function to fetch data from backend and then count the customer orders (outbound orders only)

onMounted(() => {
  const data = [
    { day: 'M', count: 15 },
    { day: 'T', count: 5 },
    { day: 'W', count: 40 },
    { day: 'T', count: 25 },
    { day: 'F', count: 100 },
    { day: 'S', count: 7 },
    { day: 'S', count: 28 },
  ];


  const ctx = document.getElementById('ordersChart') as HTMLCanvasElement;

  if (ctx) {
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.map(row => row.day),
        datasets: [
          {
            label: 'Count',
            data: data.map(row => row.count),
            backgroundColor: data.map(row => row.count < 10 ? 'rgb(177,2,34, 0.3)' : 'rgba(2,138,124,0.3)'), // Red if count < 10, otherwise green
            borderColor: data.map(row => row.count < 10 ? 'rgb(177,2,34)' : 'rgb(2,138,124)'), // Red border if count < 10, otherwise green
            borderWidth: 1,
          },
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          // title: {
          //   display: true,
          //   text: 'Customer Orders',
          //   color: 'rgb(0,0,0)',
          //
          //   font: {
          //     size: 18,
          //     weight: 'bold',
          //
          //   },
          // },
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
              text: 'Orders ',
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
      }
    });
  }
});
</script>

<template>
  <v-container id="ordersTrendsChart" fluid tag="section">
    <div style="width: 100%; height: 100%;">
      <canvas id="ordersChart"></canvas>
    </div>
  </v-container>
</template>


<style scoped>

</style>
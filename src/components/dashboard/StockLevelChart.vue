<script setup lang="ts">
import { onMounted } from 'vue';
import Chart from 'chart.js/auto';

onMounted(() => {
  const data = [
    { item: 'Screwdriver', count: 15 },
    { item: 'CPUs', count: 5 },
    { item: 'Barrels of Oil', count: 40 },
    { item: 'Hammers', count: 25 },
    { item: 'Nails', count: 100 },
    { item: 'Drills', count: 7 },
    { item: 'Wrenches', count: 28 },
  ];


  const ctx = document.getElementById('stockLevels') as HTMLCanvasElement;

  if (ctx) {
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.map(row => row.item),
        datasets: [
          {
            label: 'Count',
            data: data.map(row => row.count),
            backgroundColor: data.map(row => row.count < 10 ? 'rgb(255,255,255)' : 'rgb(255,255,255)'), // Red if count < 10, otherwise green
            borderColor: data.map(row => row.count < 10 ? 'rgb(255,255,255)' : 'rgb(255,255,255)'), // Red border if count < 10, otherwise green
            borderWidth: 1,
          },
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          }
        },
        scales: {
          x:{
            ticks: {
              color: 'rgba(255,255,255,0.51)',
            },
            grid: {
              color: 'rgba(255,255,255,0.51)',
            },
            beginAtZero: true,
            stacked: true

          },
          y: {
            ticks: {
              color: 'rgba(255,255,255,0.51)',
            },
            grid: {
              color: 'rgba(255,255,255,0.51)',
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
    <div style="width: 100%; height: 100%;">
      <canvas id="stockLevels"></canvas>
    </div>
  </v-container>
</template>


<style scoped>

</style>
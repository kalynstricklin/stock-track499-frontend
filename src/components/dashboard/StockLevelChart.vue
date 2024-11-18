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
            backgroundColor: data.map(row => row.count < 10 ? 'rgb(177,2,34, 0.3)' : 'rgba(2,138,124,0.3)'), // Red if count < 10, otherwise green
            borderColor: data.map(row => row.count < 10 ? 'rgb(177,2,34)' : 'rgb(2,138,124)'), // Red border if count < 10, otherwise green
            borderWidth: 1,
          },
        ]
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Warehouse Inventory',
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
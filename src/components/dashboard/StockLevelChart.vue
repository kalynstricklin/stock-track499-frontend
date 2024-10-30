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
        labels: data.map(row => row.item), // Now using item names as labels
        datasets: [
          {
            label: 'Current Stock Levels',
            data: data.map(row => row.count),
            backgroundColor: data.map(row => row.count < 10 ? 'rgba(255, 99, 132, 0.2)' : 'rgba(75, 192, 192, 0.2)'), // Red if count < 10, otherwise green
            borderColor: data.map(row => row.count < 10 ? 'rgba(255, 99, 132, 1)' : 'rgba(75, 192, 192, 1)'), // Red border if count < 10, otherwise green
            borderWidth: 1,
          }
        ]
      }
    });
  }
});
</script>




<template>
  <v-container id="stockLevelChart" fluid tag="section">
    <h1>
        Current Stock Levels
    </h1>
    <div style="width: 800px;">
      <canvas id="stockLevels"></canvas>
    </div>
  </v-container>
</template>


<style scoped>

</style>
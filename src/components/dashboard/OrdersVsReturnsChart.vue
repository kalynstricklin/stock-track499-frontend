<script setup lang="ts">

import { onMounted } from 'vue'
import Chart from 'chart.js/auto'

onMounted(()=>{

  const ctx = document.getElementById('ordersVsReturns') as HTMLCanvasElement;

  if(ctx){
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Orders', 'Returns'],
        datasets: [{
          // label: 'Orders VS Returns',
          data: [215, 8],
          backgroundColor: ['#d1e8e8', '#f5d6dc'],
          borderColor: '#ffffff',
          borderWidth: 2,
          hoverBackgroundColor: ['#76cdcd', '#f9abbc'],
          hoverBorderColor: '#ffffff',
          hoverOffset: 8
        }],
      },
      options: {
        responsive: false,
        plugins: {
          title: {
            display: true,
            text: 'Orders VS Returns',
            font: {
              size: 18,
              weight: 'bold'
            },
          },
          tooltip: {
            enabled: true,
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: '#444444',
            borderWidth: 1
          },
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              font:{
                size: 16,
                weight: 'bold'
              },
              color: '#333333'
            }
          }
        }
      }
    })
  }


});
</script>

<template>
  <v-container id="ordersVsReturnsChart" fluid tag="section">
    <div style="width: 500px; margin: auto;">
      <canvas id="ordersVsReturns"></canvas>
    </div>
  </v-container>
</template>

<style scoped>
</style>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Chart from 'chart.js/auto';
import { auth } from '@/firebase';
import { showSnackbar } from '@/utils/utils';
import { fetchUserByUid } from '@/server/services/UserHandler';
import { fetchStatRequest } from '@/server/services/StatsHandler';

// Reactive variables
const role = ref('');
let chartInstance = null; // To store the chart instance

// Function to render the chart
function renderChart(data) {
  if (!Array.isArray(data)) {
    console.error('Expected data to be an array, but got:', data);
    return;
  }

  const ctx = document.getElementById('ordersChart') as HTMLCanvasElement;

  if (ctx) {
    if (chartInstance) {
      chartInstance.destroy(); // Destroy the existing chart instance before creating a new one
    }

    chartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.map((item) => item.date), // Set labels as dates
        datasets: [
          {
            label: 'Number of Orders',
            data: data.map((item) => item.stats.num_orders), // Set data as number of orders
            backgroundColor: data.map((item) =>
              item.stats.num_orders < 10 ? 'rgb(177,2,34, 0.3)' : 'rgba(2,138,124,0.3)'
            ),
            borderColor: data.map((item) =>
              item.stats.num_orders < 10 ? 'rgb(177,2,34)' : 'rgb(2,138,124)'
            ),
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Number of Orders in the Last 7 Days',
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
              text: 'Dates',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Number of Orders',
            },
            beginAtZero: true,
          },
        },
      },
    });
  }
}

async function initialize() {
  const statItems = ref([]); // Initialize as an empty array
  if (!auth.currentUser) {
    showSnackbar('No authenticated user found.', 'error');
    return;
  }

  try {
    const token = await auth.currentUser.getIdToken();

    // Set user role
    const user = await fetchUserByUid(auth.currentUser.uid, token);

    if (!user) {
      showSnackbar('No user found.', 'info');
      return;
    }

    role.value = user.role;

    // Fetch stats for the last 7 days
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i); // Subtract i days from today

      const formattedDate = `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`;

      const dailyStats = await fetchStatRequest(token, formattedDate);

      if (dailyStats) {
        statItems.value.push({ date: formattedDate, stats: dailyStats });
      }
    }

    console.log('Stats for the last 7 days:', statItems.value);

    // Render chart with stats data
    renderChart(statItems.value);

    showSnackbar(`Loaded Statistics!`, 'success');
  } catch (error: any) {
    showSnackbar(`Error loading dashboard: ${error.message}`, 'error');
    console.error('Error fetching stats:', error);
  }
}


// Fetch data and initialize the chart on component mount
onMounted(() => {
  initialize();
});
</script>

<template>
  <v-container id="ordersTrendsChart" fluid tag="section">
    <div style="width: 100%; height: 450px;">
      <canvas id="ordersChart"></canvas>
    </div>
  </v-container>
</template>

<style scoped>
</style>
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

  const ctx = document.getElementById('revenueChart') as HTMLCanvasElement;

  if (ctx) {
    if (chartInstance) {
      chartInstance.destroy(); // Destroy the existing chart instance before creating a new one
    }

    chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.map((item) => item.date), // Set labels as dates
        datasets: [
          {
            label: 'Revenue',
            data: data.map((item) => item.stats.revenue), // Set data as revenue
            backgroundColor: 'rgba(2,138,124,0.3)',
            borderColor: 'rgb(2,138,124)',
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
            text: 'Revenue per Day in the Last 7 Days',
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
              text: 'Revenue $',
            },
            beginAtZero: true,
          },
        },
      },
    });
  }
}

// Adjust the initialization function to use `revItems` for the chart
async function initialize() {
  const revItems = ref([]); // Initialize as an empty array
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

      const dailyRev = await fetchStatRequest(token, formattedDate);

      if (dailyRev) {
        revItems.value.push({ date: formattedDate, stats: dailyRev });
      }
    }

    // Render chart with stats data
    renderChart(revItems.value);

    showSnackbar(`Loaded Statistics!`, 'success');
  } catch (error: any) {
    showSnackbar(`Error loading dashboard: ${error.message}`, 'error');
    console.error('Error fetching revenue:', error);
  }
}


// Fetch data and initialize the chart on component mount
onMounted(() => {
  initialize();
});
</script>

<template>
  <v-container id="revenueTrendsChart" fluid tag="section">
    <div style="width: 100%; height: 450px;">
      <canvas id="revenueChart"></canvas>
    </div>
  </v-container>
</template>

<style scoped>
</style>
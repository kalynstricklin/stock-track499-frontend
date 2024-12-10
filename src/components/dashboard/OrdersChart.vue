<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import Chart from 'chart.js/auto';
import { auth } from '@/firebase';
import { showSnackbar } from '@/utils/utils';
import { fetchOrders } from '@/server/services/OrdersHandler';
import { fetchUserByUid } from '@/server/services/UserHandler';

// Reactive variables
const role = ref('');
const orderItems = ref(null);
let chartInstance = null; // To store the chart instance

// Function to initialize the chart
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
        labels: data.map((item) => item.part_name), // Set labels as part names
        datasets: [
          {
            label: 'Quantity',
            data: data.map((item) => item.qty), // Set data as quantities
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
            text: 'Customer Orders',
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
              text: 'Part Name',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Quantity',
            },
            beginAtZero: true,
          },
        },
      },
    });
  }
}


// Function to fetch data and initialize the dashboard
async function initialize() {
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

    // Fetch orders
    const response = await fetchOrders(token);
    console.log('Raw fetched orders:', response);

    if (!response || !Array.isArray(response.message)) {
      console.error('Invalid orders data structure:', response);
      showSnackbar('Error: Invalid orders data structure.', 'error');
      return;
    }

    // Extract and filter outbound orders
    const orders = response.message;
    orderItems.value = orders.filter((item) => item.is_outbound);

    console.log('Filtered order items (is_outbound=true):', orderItems.value);

    // Render chart with extracted data
    renderChart(orderItems.value);

    showSnackbar(`Loaded Statistics!`, 'success');
  } catch (error: any) {
    showSnackbar(`Error loading dashboard: ${error.message}`, 'error');
    console.error('Error fetching order items:', error);
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
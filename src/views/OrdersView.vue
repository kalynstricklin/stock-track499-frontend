<!-- table formatting -->
<template>
  <v-table>
    <thead>
      <tr>
        <th class="text-left">Order ID</th>
        <th class="text-left">User ID</th>
        <th class="text-left">Order Date</th>
        <th class="text-left">Delivery Date</th>
        <th class="text-left">Order Type</th>
        <th class="text-left">Status</th>
        <th class="text-left">Quantity</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in paginatedItems" :key="item.id">
        <td>{{ item.orderId }}</td>
        <td>{{ item.userId }}</td>
        <td>{{ item.orderDate }}</td>
        <td>{{ item.deliveryDate }}</td>
        <td>{{ item.orderType }}</td>
        <td>{{ item.status }}</td>
        <td>{{ item.quantity }}</td>
      </tr>
    </tbody>
  </v-table>

  <!-- pagination for the table -->
  <div class="text-center">
    <v-pagination
        v-model="page"
        :length="totalPages"
        rounded="circle"
        :total-visible="2"
        prev-icon="mdi-arrow-left"  
        next-icon="mdi-arrow-right"
    ></v-pagination>
  </div>
</template>

<!-- table entries -->
<script>
  export default {
    data() { // fake data for rn
      return {
        page: 1,
        itemsPerPage: 20, // one item per page for now
          ord: [ 
            {
              orderId: 0,
              userId: 'ashley',
              orderDate: '12-25-2023',
              deliveryDate: '01-01-2024',
              orderType: 'type',
              status: 'Delivered',
              quantity: 10
            },
            {
              orderId: 1,
              userId: 'ashley',
              orderDate: '12-25-2023',
              deliveryDate: '01-01-2024',
              orderType: 'type',
              status: 'Shipped',
              quantity: 10
            },
            {
              orderId: 2,
              userId: 'ashley',
              orderDate: '12-25-2023',
              deliveryDate: '01-01-2024',
              orderType: 'type',
              status: 'Processing',
              quantity: 10
            },
            {
              orderId: 3,
              userId: 'ashley',
              orderDate: '12-25-2023',
              deliveryDate: '01-01-2024',
              orderType: 'type',
              status: 'Processing',
              quantity: 10
            },
            {
              orderId: 4,
              userId: 'ashley',
              orderDate: '12-25-2023',
              deliveryDate: '01-01-2024',
              orderType: 'type',
              status: 'Processing',
              quantity: 10
            },
            {
              orderId: 5,
              userId: 'ashley',
              orderDate: '12-25-2023',
              deliveryDate: '01-01-2024',
              orderType: 'type',
              status: 'Processing',
              quantity: 10
            },
          ],
      }
    },
    computed: {
    // calculate paginated items based on current page
    paginatedItems() {
      const start = (this.page - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.ord.slice(start, end)
    },
    // total num of pages
    totalPages() {
      return Math.ceil(this.ord.length / this.itemsPerPage)
    }
  }
  }
</script>

<style scoped>

</style>
<!-- table formatting -->
<template>
  <v-table>
    <thead>
      <tr>
        <th class="text-left">Order ID</th>
        <th class="text-left">Date</th>
        <th class="text-left">Status</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in paginatedItems" :key="item.id">
        <td>{{ item.id }}</td>
        <td>{{ item.date }}</td>
        <td>{{ item.status }}</td>
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
        itemsPerPage: 1, // one item per page for now
          inv: [
            {
              id: '000',
              date: '01-01-2024',
              status: 'Delivered',
            },
            {
              id: '001',
              date: '01-03-2024',
              status: 'Shipped',
            },
            {
              id: '002',
              date: '01-08-2024',
              status: 'Processing',
            },
          ],
      }
    },
    computed: {
    // calculate paginated items based on current page
    paginatedItems() {
      const start = (this.page - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.inv.slice(start, end)
    },
    // total num of pages
    totalPages() {
      return Math.ceil(this.inv.length / this.itemsPerPage)
    }
  }
  }
</script>

<style scoped>

</style>
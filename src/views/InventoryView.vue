<!-- table formatting -->
<template>
  <v-table>
    <thead>
      <tr>
        <th class="text-left">Product Name</th>
        <th class="text-left">Product ID</th>
        <th class="text-left">Supplier</th>
        <th class="text-left">Category</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in paginatedItems" :key="item.id">
        <td>{{ item.name }}</td>
        <td>{{ item.id }}</td>
        <td>{{ item.supplier }}</td>
        <td>{{ item.category }}</td>
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
          inv: [
            {
              name: 'item 1',
              id: '000',
              supplier: 'supp 1',
              category: 'cat 1',
            },
            {
              name: 'item 2',
              id: '001',
              supplier: 'supp 2',
              category: 'cat 3',
            },
            {
              name: 'item 3',
              id: '002',
              supplier: 'supp 3',
              category: 'cat 3',
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
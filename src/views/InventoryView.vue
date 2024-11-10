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
      <tr v-for="item in inv" :key="item.name">
        <td>{{ item.name }}</td>
        <td>{{ item.id }}</td>
        <td>{{ item.supplier }}</td>
        <td>{{ item.category }}</td>
      </tr>
    </tbody>
  </v-table>
</template>

<!-- table entries -->
<script>
  export default {
    data() { // fake data for rn
      return {
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
  }
</script>

<style scoped>

</style>
<script setup lang="ts">
import { ref, computed } from 'vue';

const page = ref(1);
const itemsPerPage = 20;

const inv = ref([
  { name: 'item 1', id: '000', supplier: 'supp 1', category: 'cat 1' },
  { name: 'item 2', id: '001', supplier: 'supp 2', category: 'cat 3' },
  { name: 'item 3', id: '002', supplier: 'supp 3', category: 'cat 3' },
]);

const paginatedItems = computed(() => {
  const start = (page.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return inv.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(inv.value.length / itemsPerPage);
});
</script>

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

<style scoped>

</style>
<script setup lang="ts">

const items=[
  { id: 1, name: 'Kalyn Stricklin', email: 'kms0081@uah.edu', role: 'Admin' },
  { id: 2, name: 'Alex Almanza', email: 'alexa@gmail.com', role: 'Employee' },
  { id: 3, name: 'Ashley Poteau', email: 'ashleyp@uah.edu', role: 'Manager' },
  { id: 4, name: 'Josh Zills', email: 'joshz@uah.edu', role: 'Employee' },
  { id: 5, name: 'Josh Phillips', email: 'joshp@uah.edu', role: 'Customer' },

]
</script>

<template>
  <div>
    <v-app>
      <v-container>
        <v-data-table :items="items"></v-data-table>
      </v-container>
    </v-app>
  </div>
</template>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}
th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}
h2 {
  font-size: 1.5em;
  margin-bottom: 10px;
}
th{
  background-color: #f4f4f4;
  font-weight: bold;
}
</style>
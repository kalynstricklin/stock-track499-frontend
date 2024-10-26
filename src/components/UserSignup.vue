<!--i dont think i want a sign up just a login page.-->
<template>
  <v-sheet>
    <v-form @submit.prevent="register">
      <v-text-field v-model="email" label="Email" required></v-text-field>
      <v-text-field v-model="password" label="Password" type="password" required></v-text-field>
      <v-btn type="submit" :loading="loading" block>Register</v-btn>
    </v-form>
  </v-sheet>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';

const email = ref('');
const password = ref('');
const loading = ref(false);
const auth = getAuth();

async function register() {
  loading.value = true;
  try {
    await createUserWithEmailAndPassword(auth, email.value, password.value);
    alert('Registration successful!');

  } catch (error) {
    alert(error);
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>

</style>

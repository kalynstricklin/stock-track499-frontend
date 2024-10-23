<template>
  <v-sheet>
    <v-form @submit.prevent="login">
      <v-text-field v-model="email" label="Email" required></v-text-field>
      <v-text-field v-model="password" label="Password" type="password" required></v-text-field>
      <v-btn type="submit" :loading="loading" block>Login</v-btn>
    </v-form>
  </v-sheet>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { signInWithEmailAndPassword, getAuth } from 'firebase/auth';

const email = ref('');
const password = ref('');
const loading = ref(false);
const auth = getAuth();

async function login() {
  loading.value = true;
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    alert('Login successful!');

  } catch (error) {
    alert(error);
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>

</style>







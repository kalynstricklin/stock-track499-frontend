<template>
  <v-container>
    <v-sheet class="mx-auto" width="300">
      <v-form @submit.prevent="login">
        <v-text-field v-model="email" :rules="emRules" label="Email" required></v-text-field>
        <v-text-field v-model="password" :rules="pwRules" label="Password" type="password" required></v-text-field>
        <v-btn type="submit" class="mt-2">Login</v-btn>
      </v-form>
    </v-sheet>
  </v-container>

</template>

<script setup lang="ts">
import { ref } from 'vue';
import { signInWithEmailAndPassword, getAuth } from 'firebase/auth';

const email = ref('');
const password = ref('');
const loading = ref(false);
const auth = getAuth();

const pwRules = [
  (value: boolean) => {
    if (value) return true
    return 'You must enter a password.'
  },
]

const emRules = [
  (value: boolean) => {
    if (value) return true
    return 'You must enter an email.'
  },
]
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


<script lang="ts">
export default {
  data: () => ({
    email: '',
    password: '',
    pwRules: [
      (value: boolean) => {
        if (value) return true

        return 'You must enter a password.'
      },
    ],
    emRules: [
      (value: boolean) => {
        if (value) return true

        return 'You must enter an email.'
      },
    ],
  }),
}
</script>

<style scoped>

</style>






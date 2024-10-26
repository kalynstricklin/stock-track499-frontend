<template>
  <div class="form-container sign-in-container">
    <v-form @submit.prevent="login" class="sign-in-form">
      <h1 class="title">Sign In</h1>
      <v-text-field prepend-inner-icon="mdi-account" v-model="email" :rules="emRules" label="Email" required></v-text-field>
      <v-text-field prepend-inner-icon="mdi-lock" v-model="password" :rules="pwRules" label="Password" type="password" required></v-text-field>
      <v-btn color="primary" block dark class="login-btn" type="submit">Login</v-btn>
      <v-row class="forgot-password">
        <span>Forgot your password?</span>
      </v-row>
    </v-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { signInWithEmailAndPassword, getAuth } from 'firebase/auth';

const email = ref('');
const password = ref('');
const loading = ref(false);
const auth = getAuth();

const emRules = [(v: boolean) => !!v || 'You must enter an email.'];
const pwRules = [(v: boolean) => !!v || 'You must enter a password.'];

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
.form-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.sign-in-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.title {
  font-weight: bold;
  text-align: center;
  margin-bottom: 1rem;
}

.login-btn {
  margin-top: 1rem;
}

.forgot-password {
  text-align: center;
  color: #007bff;
  cursor: pointer;
  font-size: 0.9rem;
}
</style>

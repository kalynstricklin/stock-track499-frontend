<template>

  <div class="form-container sign-in-container">
    <h1>Welcome back!</h1>
    <br>
    <v-form @submit.prevent="login" class="sign-in-form">

      <v-text-field prepend-inner-icon="mdi-account" v-model="email" :rules="emRules" label="Email" required></v-text-field>
      <v-text-field prepend-inner-icon="mdi-lock" v-model="password" :rules="pwRules" label="Password" type="password" required></v-text-field>
      <v-row class="forgot-password" @click="sendPWResetEmail">
        <span>Forgot your password?</span>
      </v-row>
      <br>
      <v-btn color="primary" block dark class="login-btn" type="submit">Login</v-btn>
    </v-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { signInWithEmailAndPassword, getAuth, sendPasswordResetEmail } from 'firebase/auth'
import { showSnackbar } from '@/utils/utils'

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
  } catch (error: any) {
    showSnackbar(error.msg, 'error');
  } finally {
    loading.value = false;
  }
}

async function sendPWResetEmail (){
  try{
    await sendPasswordResetEmail(auth, email.value);
    showSnackbar('Password reset email sent!', 'info')
  }catch(error){
    showSnackbar("Error sending password reset email.",'error')
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
  gap: 0.5rem;
}

.login-btn {
  margin-top: 1rem;
}

.forgot-password {
  margin-top: -20px;
  padding-right: 12px;
  justify-content: end;
  text-align: center;
  color: #396483;
  cursor: pointer;
  font-size: 0.8rem;

}
</style>

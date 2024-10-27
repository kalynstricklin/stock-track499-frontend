<template>
  <div class="form-container sign-in-container">
    <v-form @submit.prevent="login" class="sign-in-form">

      <v-text-field prepend-inner-icon="mdi-account" v-model="email" :rules="emRules" label="Email" required></v-text-field>
      <v-text-field prepend-inner-icon="mdi-lock" v-model="password" :rules="pwRules" label="Password" type="password" required></v-text-field>
      <v-btn color="primary" block dark class="login-btn" type="submit">Login</v-btn>

<!--      <span>Don't have any account? Signup</span>-->
      <br>

      <v-row class="forgot-password" @click="sendPWResetEmail">
        <span>Forgot your password?</span>
      </v-row>

    </v-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { signInWithEmailAndPassword, getAuth, sendPasswordResetEmail } from 'firebase/auth'

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
  } catch (error) {
    alert(error);
  } finally {
    loading.value = false;
  }
}

async function sendPWResetEmail (){
  try{
    await sendPasswordResetEmail(auth, email.value);
    alert('Password reset email sent!')
  }catch(error){
    console.log(error)
    alert("Error sending password reset email.")
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

.login-btn {
  margin-top: 1rem;
}

.forgot-password {
  justify-content: center;
  text-align: center;
  color: #396483;
  cursor: pointer;
  font-size: 0.9rem;
}
</style>

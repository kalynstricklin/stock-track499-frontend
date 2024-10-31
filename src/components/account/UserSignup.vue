<!--i dont think i want a sign up just a login page.-->
<template>
  <div class="form-container sign-up-container">
    <h1>Create an account</h1>
    <br>
    <v-form @submit.prevent="register" class="sign-in-form">
      <v-text-field v-model="firstName" label="First Name" required></v-text-field>
      <v-text-field v-model="lastName" label="Last Name" required></v-text-field>
      <v-text-field v-model="email" label="Email" required></v-text-field>
      <v-text-field v-model="password" label="Password" type="password" required></v-text-field>
      <v-btn color="primary" block dark class="login-btn" type="submit">Sign Up</v-btn>
    </v-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { createUserWithEmailAndPassword, getAuth, updateProfile } from 'firebase/auth';

const firstName = ref('');
const lastName = ref('');
const email = ref('');
const password = ref('');
const loading = ref(false);
const auth = getAuth();

async function register() {
  loading.value = true;
  try {
    const userCred = await createUserWithEmailAndPassword(auth, email.value, password.value);
    await updateProfile(userCred.user, {
      displayName: `${firstName.value} ${lastName.value}`
    });

  } catch (error) {
    alert(error);
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Poppins:400,500,600,700&display=swap');
*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif;
}
html,body{
  display: grid;
  height: 100%;
  width: 100%;
  place-items: center;

}
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

<script setup lang="ts">

import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
import { ref } from 'vue'

const auth = getAuth();
const user = ref();

onAuthStateChanged(auth, (currentUser) =>{
  user.value = currentUser;
})
async function signout() {
  await signOut(auth);
  user.value = null;
}

</script>

<template>
  <v-container class="container-account-details">
    <h2 class="title font-weight-bold">Account Details</h2>
<!--    <v-avatar>-->
<!--      <v-icon>mdi-account</v-icon>-->
<!--    </v-avatar>-->

    <br>
    <p>{{user?.displayName}}</p>
    <br>
    <p>Email: {{user?.email}}</p>
    <br>

    <v-btn color="error" @click="signout">Sign Out</v-btn>

  </v-container>

</template>

<style scoped>

.container-account-details {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  max-width: 100%;
  padding: 2rem;
}
</style>
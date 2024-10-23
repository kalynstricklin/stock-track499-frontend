<script setup lang="ts">

import UserLogin from '@/components/UserLogin.vue'
import { ref } from 'vue';
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { signOut } from 'firebase/auth';


const user = ref();
const auth = getAuth();
const loading = ref(true)


onAuthStateChanged(auth, (currentUser) => {
  user.value = currentUser;
  loading.value = false;
});

async function signout() {
  await auth.signOut();
  user.value = null;
}

</script>

<template>
  <v-container>
<!--Show login form when user is not authenticated-->
    <h2 v-if="!user"> Login</h2>
    <UserLogin v-if="!user"/>

<!--Show account details when user is authenticated and a button to sign out-->
    <div v-else>
      <h2>Account Details</h2>
      <p>Email: {{user?.email}}</p>
      <v-spacer></v-spacer>
      <v-btn @click="signout"> Sign Out</v-btn>
    </div>

  </v-container>
</template>

<style scoped>

</style>
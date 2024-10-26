<script setup lang="ts">
  import { ref } from 'vue';
  import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
  import UserLogin from '@/components/UserLogin.vue';

  const user = ref();
  const auth = getAuth();
  const loading = ref(true)

  onAuthStateChanged(auth, (currentUser) => {
    user.value = currentUser;
    loading.value = false;
  });
  async function signout() {
    await signOut(auth);
    user.value = null;
  }
</script>

<template>
  <v-container class="container">
    <!-- Show login form when user is not authenticated -->
    <UserLogin v-if="!user"/>

    <!-- Show account details when user is authenticated -->
    <div v-else class="account-container">
      <h2>Account Details</h2>
      <p>Email: {{ user?.email }}</p>
      <v-btn color="error" @click="signout">Sign Out</v-btn>
    </div>
  </v-container>
</template>


<style scoped>
@import url("https://fonts.googleapis.com/css?family=Montserrat:400,800");

form {
  background-color: #ffffff;
  height: 100%;

}

.container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  max-width: 400px;
  padding: 2rem;
}

.account-container {
  width: 100%;
  text-align: center;
}

</style>




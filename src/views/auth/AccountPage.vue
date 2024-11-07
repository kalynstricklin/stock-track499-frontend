<script setup lang="ts">
  import { ref } from 'vue';
  import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
  import UserLogin from '@/components/account/UserLogin.vue';
  import UserSignup from '@/components/account/UserSignup.vue'
  import AdminList from '@/components/admin/AdminList.vue'
  import AccountDetails from '@/components/account/AccountDetails.vue'

  const user = ref();
  const auth = getAuth();
  const loading = ref(true)
  const showSignup = ref(false)
  const showLogin = ref(true)


  onAuthStateChanged(auth, (currentUser) => {
    user.value = currentUser;
    loading.value = false;
  });

  // function toggleSignup(){
  //   showSignup.value = true;
  //   showLogin.value = false;
  // }
  // function toggleSignIn(){
  //   showSignup.value = false;
  //   showLogin.value = true;
  // }

  function toggleAuthView(view: 'signup' | 'login') {
    showSignup.value = view === 'signup';
  }


  // todo: add admin check logic
  const isAdmin = false;

</script>

<template>
  <v-container>

    <!-- If no user is logged in, show login/signup toggle and form -->
  <v-container v-if="!user" class="container">
    <v-btn-toggle class="toggle-buttons">
      <v-btn @click="toggleAuthView('login')" >Login</v-btn>
      <v-btn @click="toggleAuthView('signup')"  >Sign Up</v-btn>
    </v-btn-toggle>
    <UserSignup v-if="showSignup"/>
    <UserLogin v-if="!showSignup" />
  </v-container>



<!--    if user is admin show user list else show account details-->
    <v-container v-else>
      <AdminList v-if="isAdmin"/>
      <AccountDetails v-else/>
    </v-container>

  </v-container>
</template>


<style scoped>
@import url("https://fonts.googleapis.com/css?family=Montserrat:400,800");


form {
  background-color: #ffffff;
  height: 100%;

}

.toggle-buttons{
  margin-bottom: 15px;
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
</style>




<template>
  <v-app>

    <NavbarComponent />
    <v-main class="mx-4 mb-4">

      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import NavbarComponent from './components/NavbarComponent.vue'


export default {
  name: 'App',
  components: { NavbarComponent },
  data() {
    return {}
  }
}
</script>

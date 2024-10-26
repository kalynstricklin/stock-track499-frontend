<template>
  <v-app>
    <NavbarComponent />

    <router-view/>

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

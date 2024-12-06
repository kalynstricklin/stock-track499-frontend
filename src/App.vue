npm<template>
  <v-app >
    <NavbarComponent />

    <v-main class="grey-background">
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

<style>
.grey-background {
  background-color: #f3f3f3;

}
</style>
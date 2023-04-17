<template>
  <v-app>
    <AppBar />
    <v-main style="background-color: #f5f5f5">
      <v-container fluid style="max-width: 1200px">
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import AppBar from '@/layouts/AppBar.vue';
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');
html {
  font-family: 'Roboto', sans-serif;
}
#app {
  font-family: 'Roboto', sans-serif;
}
</style>

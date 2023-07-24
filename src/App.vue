<template>
  <v-app>
    <AppBar />
    <v-main style="background-color: #f5f5f5">
      <v-container>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import AppBar from '@/layouts/AppBar.vue';
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Lato:100,300,400,500,700,900&display=swap');
@import url('https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900&display=swap');
@import url('https://fonts.googleapis.com/css?family=Ubuntu:100,300,400,500,700,900&display=swap');
html {
  font-family: Lato, sans-serif;
}
#app {
  font-family: Lato, sans-serif;
}
a {
  color: #1976d2;
}
</style>

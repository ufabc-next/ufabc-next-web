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
import { auth } from 'stores';
import { onMounted } from 'vue';
import create from 'vue-zustand';
import router from './router';

const useAuth = create(auth);
const { authenticate } = useAuth();

onMounted(async () => {
  await router.isReady();
  const { query } = router.currentRoute.value;
  const { token: tokenParam, ...otherQueries } = query;
  if (tokenParam) {
    authenticate.value(tokenParam as string);
    router.replace({
      query: otherQueries,
    });
  }
});
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

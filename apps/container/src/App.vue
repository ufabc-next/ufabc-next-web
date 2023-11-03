<template>
  <v-app>
    <AppBar v-if="!!token" />
    <v-main style="background-color: #f5f5f5">
      <v-container id="app-container">
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { authStore } from 'stores';
import { onMounted } from 'vue';
import create from 'vue-zustand';

import router from './router';

import AppBar from '@/layouts/AppBar.vue';

const useAuth = create(authStore);
const { authenticate, token } = useAuth();

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

* {
  font-family: Lato, sans-serif;
}
html {
  font-family: Lato, sans-serif;
}
#app {
  font-family: Lato, sans-serif;
}
#app-container {
  max-width: 1200px;
}

a {
  text-decoration: none;
  color: #56cdb7;
}

p,
span {
  font-size: 14px;
}

.el-message {
  z-index: 9999999 !important;
}
</style>

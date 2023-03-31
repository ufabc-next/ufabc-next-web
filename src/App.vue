<template>
  <v-app>
    <AppBar />
    <v-main style="background-color: #f0f0f0">
      <v-container fluid style="max-width: 1200px">
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { useTheme } from 'vuetify';
import AppBar from '@/components/AppBar.vue';

export default {
  setup() {
    const theme = useTheme();

    return { theme };
  },
  components: {
    AppBar,
  },
};
</script>

<template>
  <v-app>
    <AppBar />
    <v-main>
      <router-view />
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

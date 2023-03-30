<template>
  <v-navigation-drawer v-model="drawer" color="navigation" width="240">
    <v-list>
      <v-list-item
        v-for="item in NavigationsItems"
        :href="item.route"
        :key="item.title"
        :prepend-icon="item.icon"
      >
        {{ item.title }}
      </v-list-item>
    </v-list>
  </v-navigation-drawer>

  <v-app-bar app height="min-content" class="py-2">
    <v-app-bar-nav-icon
      app
      variant="text"
      color="primary"
      @click.stop="drawer = !drawer"
    ></v-app-bar-nav-icon>

    <v-spacer></v-spacer>

    <img class="logo-white" src="@/assets/logo.svg" height="32" />

    <v-spacer></v-spacer>

    <v-btn variant="text" icon="mdi-dots-vertical" color="primary"></v-btn>
  </v-app-bar>
  <div style="height: 64px" />
</template>

<script lang="ts">
import NavigationsItems from '@/navigationsItems';

export default {
  computed: {
    NavigationsItems() {
      return NavigationsItems;
    },
  },
  data: () => ({
    drawer: false,
  }),
};
</script>

<style scoped lang="scss">
.v-list-item {
  font-size: 14px;
}
</style>

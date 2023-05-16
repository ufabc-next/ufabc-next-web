<template>
  <v-navigation-drawer v-model="drawer" color="navigation" width="240">
    <v-list>
      <div class="py-4 d-flex justify-center align-center">
        <img class="logo-white" src="@/assets/logo_white.svg" height="44" />
      </div>
      <v-divider />
      <v-list-item
        v-for="item in internalNavigationsItems"
        :to="item.route"
        :key="item.title"
      >
        <v-layout>
          <v-icon :icon="item.icon" class="mr-3" />
          <p class="font-weight-medium text-caption">{{ item.title }}</p>
        </v-layout>
      </v-list-item>
    </v-list>
    <v-divider />
    <v-list>
      <v-list-item
        v-for="item in externalNavigationsItems"
        :href="item.url"
        :target="item.url && '_blank'"
        :rel="item.url && 'noopener noreferrer'"
        :key="item.title"
      >
        <v-layout>
          <v-icon :icon="item.icon" class="mr-3" />
          <p class="font-weight-medium text-caption">{{ item.title }}</p>
        </v-layout>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>

  <v-app-bar elevation="1" app height="min-content" class="py-2">
    <v-app-bar-nav-icon
      app
      variant="text"
      color="primary"
      @click.stop="drawer = !drawer"
      class="d-lg-none"
    ></v-app-bar-nav-icon>

    <v-spacer></v-spacer>

    <img class="logo-white" src="@/assets/logo.svg" height="32" />

    <v-spacer></v-spacer>
    <v-btn color="primary" icon="mdi-dots-vertical">
      <v-icon></v-icon>
      <v-menu activator="parent">
        <v-list class="px-2">
          <v-list-item>
            <v-layout>
              <v-avatar :size="38" color="primary">
                {{ userInitials }}
              </v-avatar>
              <v-layout class="flex-column ml-4">
                <p>{{ userLogin }}</p>
                <p v-if="user.ra" class="text-caption text-medium-emphasis">
                  RA: {{ user.ra }}
                </p>
              </v-layout>
            </v-layout>
          </v-list-item>
          <v-list-item>
            <v-btn
              prepend-icon="mdi-exit-to-app"
              variant="text"
              class="text-capitalize text-body-2"
              >Sair</v-btn
            >
          </v-list-item>
        </v-list>
      </v-menu>
    </v-btn>
  </v-app-bar>
  <div style="height: 64px" />
</template>

<script setup lang="ts">
import {
  internalNavigationsItems,
  externalNavigationsItems,
} from '@/navigationsItems';
import { computed, ref } from 'vue';

const drawer = ref(true);
const userLogin = computed(() => 'test.username');
const userInitials = computed(() => 'tu');
const user = computed(() => {
  return {
    ra: '1234567',
  };
});
</script>

<style scoped lang="scss">
.v-list-item {
  font-size: 14px;
}
</style>

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

  <v-app-bar app height="min-content" class="py-2 header">
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
<style scoped lang="scss">
.v-list-item {
  font-size: 14px;
}
</style>
<script setup lang="ts">
import { computed, ref } from 'vue';

const drawer = ref(true);
const userLogin = computed(() => 'test.username');
const userInitials = computed(() => 'tu');
const user = computed(() => ({
  ra: '1234567',
}));
const internalNavigationsItems = [
  {
    title: 'Reviews',
    icon: 'mdi-message-draw',
    route: '/reviews',
  },
  {
    title: 'Meu histórico',
    icon: 'mdi-history',
    route: '/history',
  },
  {
    title: 'Performance',
    icon: 'mdi-google-analytics',
    route: '/performance',
  },
  {
    title: 'Dados da Matrícula',
    icon: 'mdi-book-multiple',
    route: '/stats',
  },
  {
    title: 'Apoie o UFABC next',
    icon: 'mdi-bank',
    route: '/donate',
  },
  {
    title: 'Configurações',
    icon: 'mdi-cog',
    route: '/settings',
  },
  // {
  //   title: 'Planejamento',
  //   featured: false,
  //   private: true,
  //   icon: 'mdi-file-document-box-multiple',
  //   route: '/planning',
  // },
];

const externalNavigationsItems = [
  {
    title: 'Snapshot da Matrícula',
    icon: 'mdi-open-in-new',
    url: 'https://api.ufabcnext.com/snapshot',
  },
  {
    title: 'Grupos no WhatsApp',
    icon: 'mdi-whatsapp',
    url: 'https://rebrand.ly/ufabc-grupos-whatsapp',
  },
  {
    title: 'Use a Extensão',
    icon: 'mdi-download',
    url: 'https://chrome.google.com/webstore/detail/ufabc-next/gphjopenfpnlnffmhhhhdiecgdcopmhk',
  },
];
</script>

<style scoped lang="scss">
.header {
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.05) !important;
}
</style>

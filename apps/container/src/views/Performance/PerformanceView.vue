<template>
  <v-row>
    <v-col cols="12">
      <h1>Performance</h1>
      <h2>Your info in Vue: {{ user?.email }}</h2>
      <HelloWorld />
    </v-col>
  </v-row>
</template>
<script setup lang="ts">
import { defineFederatedReactComponent } from '@/utils/moduleFederation';

import { authStore } from 'stores';
import create from 'vue-zustand';

const useAuth = create(authStore);
const { user } = useAuth();

const HelloWorld = defineFederatedReactComponent({
  loader: () => import('react/HelloWorld'),
  props: {
    name: { type: String, default: 'React' },
  },
});
</script>

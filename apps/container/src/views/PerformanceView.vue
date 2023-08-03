<template>
  <v-row>
    <v-col cols="12">
      <h1>Performance</h1>
      <HelloWorld />
    </v-col>
  </v-row>
</template>
<script setup lang="ts">
import { defineFederatedReactComponent } from '@/utils/moduleFederation';

const HelloWorld = defineFederatedReactComponent({
  loader: () => import('react/HelloWorld'),
  props: {
    name: { type: String, default: 'React' },
  },
});
</script>

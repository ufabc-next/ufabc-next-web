<script setup lang="ts">
import { defineFederatedReactComponent } from '@/utils/moduleFederation';

const Calengrade = defineFederatedReactComponent({
  loader: () => import('react/Calengrade'),
  props: {},
});
</script>
<template>
  <Calengrade />
</template>

<template>
  <v-card class="rounded-lg">
    <v-card-text>
      <p class="text-primary text-h4 font-weight-bold">{{ title }}</p>
      <slot />
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
defineProps({
  title: String,
});
</script>

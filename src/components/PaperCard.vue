<template>
  <v-card v-bind:class="`pa-5 rounded-lg ${_class}`">
    <v-card-text>
      <p class="text-primary text-h4 font-weight-bold">{{ title }}</p>
      <slot />
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
defineProps({
  title: String,
  _class: String,
});
</script>

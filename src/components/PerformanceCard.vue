<template>
  <v-card class="pa-5 rounded-lg">
    <slot />
    <div class="stats-counter font-weight-bold">{{ cr.toFixed(2) }}</div>
    <v-card-text class="stats-subtitle pl-0">
      <p>{{ title }}</p>
    </v-card-text>
    <div>
      <div
        role="progressbar"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow="100"
        class="v-progress-linear"
      ></div>
    </div>
  </v-card>
</template>
<script setup lang="ts">
defineProps({
  cr: {
    type: Number,
    coerce: (value: string) => {
      const parsedValue = parseFloat(value);
      return parsedValue;
    },
    default: 0.0,
  },
  title: String,
});
</script>
<style>
.table-body > tr > td {
  outline: 1px solid white;
  text-align: center;
}
</style>

<style lang="scss" scoped>
.v-progress-linear {
  height: 6px;
  border-radius: 0.25rem;
  background: red;
}
</style>

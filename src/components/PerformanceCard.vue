<template>
  <v-card class="pa-5 rounded-lg w-100">
    <!-- <slot /> -->
    <v-icon
      class="mb-1 mdi" :class="[props.icon, `text-${props.color}`]"
    />
    <div class="text-h5 font-weight-bold text-blue-grey-darken-2">
      {{ props.value }}
    </div>

    <v-card-text class="text-subtitle-2 text-blue-grey-lighten-1 pl-0">
      <p>{{ title }}</p>
    </v-card-text>

    <div
      role="progressbar"
      aria-valuemin="0"
      aria-valuemax="100"
      aria-valuenow="100"
      :class="['v-progress-linear', `bg-${props.color}`]"
    ></div>
  </v-card>
</template>

<script setup lang="ts">
const props = defineProps<{
  value: string | number;
  title: string;
  icon: string;
  color: string;
}>();

</script>

<style lang="scss" scoped>
.v-progress-linear {
  height: 6px;
  border-radius: 0.25rem;
  background: red;
}
</style>

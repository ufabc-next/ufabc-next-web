<template>
  <v-card
    class="performance-card pa-5 rounded-lg w-100 h-100 d-flex flex-column justify-space-between"
  >
    <v-icon class="mb-1 mdi" :class="[props.icon, `text-${props.color}`]" />
    <span class="text-h5 font-weight-bold">
      {{ props.title }}
      <span class="text-body-1 font-weight-light">
        {{ props.subTitle }}
      </span>
    </span>

    <v-card-text
      class="text-subtitle-2 px-0 d-flex flex-column justify-end pb-0"
    >
      <p>
        {{ description }}
        <v-btn v-if="tooltip" density="compact" icon="mdi-information-outline" variant="text" class="pa-0 h-auto w-auto">
          <v-icon/>
          <v-tooltip open-on-click activator="parent" location="top" >{{tooltip}}</v-tooltip>
        </v-btn>
      </p>
      <v-progress-linear
        :model-value="progressBarValue"
        :model-total="progressBarMaxValue"
        height="6"
        :color="color"
        bg-color="pink-lighten-3"
        class="rounded-lg mt-2 d-none d-sm-block"
      />
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
type Props = {
  title: string | number;
  subTitle?: string;
  progressBarValue?: number;
  progressBarMaxValue?: number;
  description: string;
  icon: string;
  color: string;
  tooltip?: string;
};

const props = withDefaults(defineProps<Props>(), {
  progressBarValue: 100,
  progressBarMaxValue: 100,
});
</script>

<style lang="scss" scoped>
.v-progress-linear {
  height: 6px;
}
</style>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    logoUrl?: string;
    logoAlt?: string;
    backgroundColor?: string;
  }>(),
  {
    logoUrl: '/logo-white.svg',
    logoAlt: 'UFABC next',
    backgroundColor: '#3b82f6',
  },
);

const headerStyle = {
  backgroundColor: props.backgroundColor,
  padding: '48px 24px',
  textAlign: 'center' as const,
};

const logoStyle = {
  maxWidth: '180px',
  height: 'auto',
};
</script>

<template>
  <div :style="headerStyle">
    <img :src="logoUrl" :alt="logoAlt" :style="logoStyle" />
  </div>
</template>

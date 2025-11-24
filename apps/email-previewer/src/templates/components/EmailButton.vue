<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    href: string;
    label?: string;
    backgroundColor?: string;
    textColor?: string;
    fullWidth?: boolean;
  }>(),
  {
    backgroundColor: '#4ade80',
    textColor: '#ffffff',
    fullWidth: false,
  },
);

const buttonStyle = computed(() => ({
  backgroundColor: props.backgroundColor,
  color: props.textColor,
  padding: '16px 48px',
  borderRadius: '9999px',
  textDecoration: 'none',
  fontWeight: '600',
  display: props.fullWidth ? 'block' : 'inline-block',
  fontSize: '16px',
  textAlign: 'center' as const,
  border: 'none',
  cursor: 'pointer',
  fontFamily: 'Roboto, sans-serif',
}));
</script>

<template>
  <a :href="href" :style="buttonStyle">
    <slot>{{ label }}</slot>
  </a>
</template>

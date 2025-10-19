<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    previewText?: string;
    backgroundColor?: string;
    contentBackgroundColor?: string;
    maxWidth?: number;
    logoUrl?: string;
    logoAlt?: string;
  }>(),
  {
    backgroundColor: '#3b82f6',
    contentBackgroundColor: '#ffffff',
    maxWidth: 600,
    logoUrl: '/logo-white.svg',
    logoAlt: 'UFABC next',
  },
);

const outerTableStyle = {
  width: '100%',
  backgroundColor: '#f8fafc',
};

const headerStyle = computed(() => ({
  backgroundColor: props.backgroundColor,
  padding: '48px 24px',
  textAlign: 'center' as const,
}));

const logoStyle = {
  maxWidth: '200px',
  height: 'auto',
  marginBottom: '0',
};

const contentWrapperStyle = {
  backgroundColor: '#f8fafc',
  padding: '0',
};

const contentStyle = computed(() => ({
  backgroundColor: props.contentBackgroundColor,
  maxWidth: `${props.maxWidth}px`,
  margin: '0 auto',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
}));
</script>

<template>
  <table :style="outerTableStyle" cellpadding="0" cellspacing="0" border="0">
    <tbody>
      <tr>
        <td :style="contentWrapperStyle">
          <div :style="contentStyle">
            <slot />
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

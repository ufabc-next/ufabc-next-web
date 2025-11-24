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
    'Lato, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
}));
</script>

<template>
  <html>
    <head>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link
        href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&family=Roboto:wght@400;500;700&display=swap"
        rel="stylesheet"
      />
    </head>
    <body>
      <table
        :style="outerTableStyle"
        cellpadding="0"
        cellspacing="0"
        border="0"
      >
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
    </body>
  </html>
</template>

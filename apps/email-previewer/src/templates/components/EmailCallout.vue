<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    backgroundColor?: string
    borderColor?: string
    textColor?: string
    padding?: string
    borderRadius?: string
  }>(),
  {
    backgroundColor: 'rgba(67, 56, 202, 0.08)',
    borderColor: 'rgba(67, 56, 202, 0.16)',
    textColor: '#312e81',
    padding: '16px 20px',
    borderRadius: '16px',
  },
)

const sectionStyle = computed(() => ({
  backgroundColor: props.backgroundColor,
  border: `1px solid ${props.borderColor}`,
  color: props.textColor,
  padding: props.padding,
  borderRadius: props.borderRadius,
  fontSize: '13px',
  lineHeight: '22px',
}))
</script>

<template>
  <section :style="sectionStyle">
    <slot />
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    code: string
    label?: string
    textColor?: string
    backgroundColor?: string
    letterSpacing?: string
  }>(),
  {
    textColor: '#1e293b',
    backgroundColor: '#f8fafc',
    letterSpacing: '6px',
  },
)

const sectionStyle = computed(() => ({
  backgroundColor: props.backgroundColor,
  borderRadius: '18px',
  padding: '20px 24px',
  textAlign: 'center' as const,
  border: '1px solid rgba(148, 163, 184, 0.45)',
}))

const labelStyle = {
  margin: '0 0 8px',
  fontSize: '13px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.08em',
  color: '#475569',
  fontWeight: '600',
}

const codeStyle = computed(() => ({
  margin: '0',
  fontSize: '28px',
  fontWeight: '700',
  letterSpacing: props.letterSpacing,
  fontFamily: "'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', monospace",
  color: props.textColor,
}))
</script>

<template>
  <section :style="sectionStyle">
    <p v-if="label" :style="labelStyle">{{ label }}</p>
    <p :style="codeStyle">{{ code }}</p>
  </section>
</template>

<script setup lang="ts">
import { type PropType, onMounted } from 'vue';
import { ElMessage } from 'element-plus';

const props = defineProps({
  type: {
    type: String as PropType<'error' | 'success' | 'warning' | 'info'>,
    default: 'error',
  },
  duration: {
    type: Number,
    default: 5000,
  },
  text: {
    type: String,
    default:
      'Não foi possível buscar as informações, tente novamente mais tarde',
  },
});

onMounted(() => {
  ElMessage({
    showClose: true,
    message: props.text,
    type: props.type,
    duration: props.duration,
  });
});
</script>

<template>{{}}</template>

<style lang="scss" scoped>
.alert {
  z-index: 1000;
  right: 15px;
  width: 350px;
  bottom: 15px;
}
</style>

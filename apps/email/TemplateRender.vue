<template>
  <Container>
    <div
      style="
        border: 1px solid #ddd;
        border-radius: 8px;
        box-shadow: 0 2px 8px #0001;
        padding: 24px;
        background: #fff;
      "
    >
      <component :is="componentObj"></component>
    </div>
  </Container>
</template>

<script setup>
const modules = import.meta.glob('./templates/*.vue');
import { Container } from '@vue-email/components';
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const componentObj = ref(null);

async function loadComponent(name) {
  const module = await modules[`./templates/${name}.vue`]();
  componentObj.value = module?.default || null;
}

onMounted(async () => {
  await loadComponent(route.params.componentName);
});

watch(
  () => route.params.componentName,
  async () => {
    await loadComponent(route.params.componentName);
  },
);
</script>

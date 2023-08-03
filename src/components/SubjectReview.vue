<template>
  <PaperCard class="w-100">
    {{ props.id }}
  </PaperCard>
</template>

<script lang="ts" setup>
const props = defineProps({
  id: { type: String, required: true },
});

import PaperCard from '@/components/PaperCard.vue';
</script>

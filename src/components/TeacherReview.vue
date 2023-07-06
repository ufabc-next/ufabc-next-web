<template>
  <PaperCard :title="info.name" class="w-100">
    <p class="font-weight-bold">cr medio: {{ info.cr_medio }}</p>
    <p class="font-weight-bold">cr professor: {{ info.cr_professor }}</p>
    <p class="font-weight-bold">count: {{ info.count }}</p>
    <p class="font-weight-bold">amount: {{ info.amount }}</p>
  </PaperCard>
</template>

<script lang="ts" setup>
const props = defineProps({
  id: String,
});

import api from '@/utils/api';
import { computed, onMounted, ref } from 'vue';
import PaperCard from '@/components/PaperCard.vue';
import { watch } from 'vue';

onMounted(() => {
  getReviewsData();
});

const reviewsData = ref<any>(null);

const getReviewsData = async () => {
  try {
    const response = await api.get(`/reviews/teachers/${props.id}`);
    reviewsData.value = response.data;
  } catch (error) {
    console.error('Error getting teacher data:', error);
  }
};

watch(
  () => props.id,
  () => {
    getReviewsData();
  },
);

const info = computed(() => {
  if (!reviewsData.value) {
    return 'Carregando...';
  }
  return {
    name: reviewsData.value.teacher.name,
    cr_medio: reviewsData.value.general.cr_medio,
    cr_professor: reviewsData.value.general.cr_professor,
    count: reviewsData.value.general.count,
    amount: reviewsData.value.general.amount,
  };
});
</script>

<style lang="scss" scoped></style>

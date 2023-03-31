<template>
  <v-layout class="flex-column align-center justify-center">
    <v-combobox
      prepend-inner-icon="mdi-magnify"
      bg-color="white"
      placeholder="Digite o nome do professor ou disciplina"
      class="w-100"
    >
    </v-combobox>
    <ReviewsWelcome />
  </v-layout>
</template>

<script lang="ts">
import ReviewsWelcome from '@/components/ReviewsWelcome.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  components: {
    ReviewsWelcome,
  },
});
</script>

<template>
  <v-layout class="flex-column align-center justify-center">
    <el-select
      v-model="searchTerm"
      filterable
      placeholder="Digite o nome do professor ou disciplina"
      remote
      :remote-method="search"
      :loading="isLoading"
      loading-text="Carregando..."
      clearable
      class="w-100 mb-5"
    >
      <template #prefix>
        <v-icon
          :icon="isLoading ? 'mdi-loading mdi-spin' : 'mdi-magnify'"
          class="ml-2"
        />
      </template>
      <el-option
        v-for="item in processedResults"
        :key="item.name"
        :label="item.name"
        :value="item.name"
        class="py-6 d-flex align-center"
      >
        <button @click="enterSearch(item.id, item.type)">
          <v-icon
            :icon="item.type === 'teacher' ? 'mdi-account' : 'mdi-book'"
          />
          {{ item.name }}
        </button>
      </el-option>
    </el-select>

    <TeacherReview
      v-if="router.currentRoute.value.query.teacherId"
      :id="router.currentRoute.value.query.teacherId as string"
    />
    <ReviewsWelcome v-else />
  </v-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import debounce from 'lodash.debounce';
import ReviewsWelcome from '@/components/ReviewsWelcome.vue';
import TeacherReview from '@/components/TeacherReview.vue';
import router from '@/router';
import { onMounted } from 'vue';
import api from '@/utils/api';
import { computed } from 'vue';
import { SearchSubject, SearchTeacher } from '@/types';
const searchTerm = ref('');
const teachersSearchResults = ref<SearchTeacher>([]);
const subjectsSearchResults = ref<SearchSubject>([]);
const isLoading = ref(false);

const enterSearch = (id: string, type: string) => {
  console.log('enterSearch', id, type);
  router.replace({
    name: 'reviews',
    query: {
      teacherId: type === 'teacher' ? id : undefined,
      subjectId: type === 'subject' ? id : undefined,
    },
  });
};

onMounted(() => {
  const query = router.currentRoute.value.query.q;
  if (query) {
    searchTerm.value = query as string;
    search(query as string);
  }
});

const useSearch = debounce(async (query: string) => {
  try {
    const teachersResponse = await api.get('/teachers/search', {
      params: {
        q: query,
      },
    });
    const subjectsResponse = await api.get('/subjects/search', {
      params: {
        q: query,
      },
    });
    teachersSearchResults.value = teachersResponse.data.data;
    subjectsSearchResults.value = subjectsResponse.data.data;
  } catch (error) {
    console.error('Error searching:', error);
  } finally {
    isLoading.value = false;
  }
}, 500);

const search = (query: string) => {
  if (!query) {
    teachersSearchResults.value = [];
    subjectsSearchResults.value = [];
    return;
  }
  isLoading.value = true;
  useSearch(query);
};

const processedResults = computed(() => {
  return [
    ...teachersSearchResults.value.map((result) => ({
      name: result.name,
      id: result._id,
      type: 'teacher',
    })),
    ...subjectsSearchResults.value.map((result) => ({
      name: result.name,
      id: result._id,
      type: 'subject',
    })),
  ];
});
</script>

<style lang="scss">
.el-input__inner {
  height: 56px !important;
}
</style>

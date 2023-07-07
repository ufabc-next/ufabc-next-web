<template>
  <v-layout class="flex-column align-center justify-center">
    <v-combobox
      variant="solo"
      v-model="searchTerm"
      :items="processedResults"
      @update:search="(val:string) => search(val)"
      :prepend-inner-icon="isLoading ? 'mdi-loading mdi-spin' : 'mdi-magnify'"
      :multiple="false"
      chips
      clearable
      hide-details
      hide-selected
      :menu="menu"
      :focused="menu"
      no-filter
      @update:menu="openMenu"
      class="w-100 mb-5"
    >
      <template #item="{ item }">
        <v-list-item
          variant="plain"
          @click="enterSearch(item.value.id, item.value.type, item.value.name)"
        >
          <v-icon
            :icon="item.value.type === 'teacher' ? 'mdi-account' : 'mdi-book'"
            class="mr-3"
          />
          {{ item.value.name }}
        </v-list-item>
      </template>
    </v-combobox>
    <TeacherReview
      v-if="router.currentRoute.value.query.teacherId"
      :id="router.currentRoute.value.query.teacherId.toString()"
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
import { ElMessage } from 'element-plus';
import Reviews, { SearchSubject, SearchTeacher } from '@/services/Reviews';
import useFetch from '@/hooks/useFetch';
const searchTerm = ref('');
const teachersSearchResults = ref<SearchTeacher[]>([]);
const subjectsSearchResults = ref<SearchSubject[]>([]);
const isLoading = ref(false);
const menu = ref(false);

const openMenu = () => {
  menu.value = true;
};
const closeMenu = () => {
  menu.value = false;
};

const enterSearch = (id: string, type: string, name: string) => {
  searchTerm.value = name;
  closeMenu();
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
    ElMessage({
      message: 'Erro ao buscar professores e disciplinas',
      type: 'error',
    });
  } finally {
    isLoading.value = false;
  }
}, 500);

const search = (query: string) => {
  if (!query) {
    teachersSearchResults.value = [];
    subjectsSearchResults.value = [];
    router.replace({
      name: 'reviews',
    });
    return;
  }
  isLoading.value = true;
  useSearch(query);
};

const processedResults = computed(() => {
  // return [
  //   { id: '123', name: 'Abc', type: 'teacher' },
  //   { id: '1234', name: 'abCd', type: 'subject' },
  // ];
  // return [...teachersSearchResults.value.map((result) => result.name)];
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

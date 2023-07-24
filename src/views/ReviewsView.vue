<template>
  <v-layout class="flex-column align-center justify-center">
    <v-combobox
      variant="solo"
      v-model="searchTerm"
      :items="processedResults"
      @update:search="(val:string) => search(val)"
      :prepend-inner-icon="
        isFetchingTeachers || isFetchingSubjects
          ? 'mdi-loading mdi-spin'
          : 'mdi-magnify'
      "
      :multiple="false"
      chips
      clearable
      hide-details="auto"
      hide-selected
      no-filter
      class="w-100 mb-5"
      return-object
    >
      <template #item="{ item }">
        <v-list-item
          variant="plain"
          @click="enterSearch(item.value.id, item.value.type, item.value.name)"
        >
          <v-icon
            v-if="item.value.type"
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
import { ref, watch } from 'vue';
import debounce from 'lodash.debounce';
import ReviewsWelcome from '@/components/ReviewsWelcome.vue';
import TeacherReview from '@/components/TeacherReview.vue';
import router from '@/router';
import { onMounted } from 'vue';
import { computed } from 'vue';
import { ElMessage } from 'element-plus';
import reviews from '@/services/Reviews';
import { useQuery } from '@tanstack/vue-query';
const searchTerm = ref('');

const enterSearch = (id: string, type: string, name: string) => {
  searchTerm.value = name;
  router.replace({
    name: 'reviews',
    query: {
      q: name,
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

const {
  isError: isErrorTeachers,
  isFetching: isFetchingTeachers,
  data: searchResultsTeachers,
  refetch: refetchTeachers,
} = useQuery({
  refetchOnWindowFocus: false,
  queryKey: ['reviews', 'search', searchTerm.value, 'teachers'],
  queryFn: () => reviews.searchTeachers(searchTerm.value),
  // enabled: !!searchTerm.value && searchTerm.value !== '',
});

const {
  isError: isErrorSubjects,
  isFetching: isFetchingSubjects,
  data: searchResultsSubjects,
  refetch: refetchSubjects,
} = useQuery({
  refetchOnWindowFocus: false,
  queryKey: ['reviews', 'search', searchTerm.value, 'subjects'],
  queryFn: () => reviews.searchSubjects(searchTerm.value),
  enabled: !!searchTerm.value && searchTerm.value !== '',
});

watch(
  () => [isErrorTeachers, isErrorSubjects],
  ([isErrorTeachers, isErrorSubjects]) => {
    if (isErrorTeachers) {
      ElMessage.error('Erro ao buscar professores');
    }
    if (isErrorSubjects) {
      ElMessage.error('Erro ao buscar disciplinas');
    }
  },
);

const useSearch = debounce(() => {
  refetchTeachers();
  refetchSubjects();
}, 500);

const search = (query: string) => {
  if (!query) {
    router.replace({
      name: 'reviews',
    });
    return;
  }
  useSearch();
};

const processedResults = computed(() => {
  return [
    ...(searchResultsTeachers.value?.data.data.map((result) => ({
      name: result.name,
      id: result._id,
      type: result._id && 'teacher',
    })) || []),
    ...(searchResultsSubjects.value?.data.data.map((result) => ({
      name: result.name,
      id: result._id,
      type: 'subject',
    })) || []),
  ];
});
</script>

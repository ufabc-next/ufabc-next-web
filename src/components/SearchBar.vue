<template>
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
    hide-no-data
    no-filter
    class="w-100 mb-5"
    return-object
    placeholder="Digite o nome do professor ou disciplina"
  >
    <template #item="{ item, props }">
      <v-list-item
        variant="plain"
        :v-bind="props"
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
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import debounce from 'lodash.debounce';
import { onMounted } from 'vue';
import { computed } from 'vue';
import { ElMessage } from 'element-plus';
import reviews from '@/services/Reviews';
import router from '@/router';
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
  if (
    (searchResultsTeachers.value?.data.data.length === 1 &&
      searchResultsTeachers.value?.data.data[0]._id ===
        router.currentRoute.value.query.teacherId) ||
    (searchResultsSubjects.value?.data.data.length === 1 &&
      searchResultsSubjects.value?.data.data[0]._id ===
        router.currentRoute.value.query.subjectId)
  ) {
    return [];
  }
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

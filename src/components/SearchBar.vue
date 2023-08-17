<template>
  <v-text-field
    variant="solo"
    v-model="searchTerm"
    placeholder="Digite o nome do professor ou disciplina"
    @input="search"
    class="wrapper w-100 mb-5"
    hide-details
    prepend-inner-icon="mdi-magnify"
    clearable
    @update:focused="(e) => (showResults = e)"
    @click:clear="clear"
  >
    <v-list
      v-if="processedResults.length && (router.currentRoute.value.query.q as string) && showResults"
      class="results"
      elevation="1"
    >
      <v-list-item
        v-for="item in processedResults"
        :key="item.id"
        variant="plain"
        @click="enterSearch(item.id, item.type, item.name)"
      >
        <v-icon
          v-if="item.type"
          :icon="item.type === 'teacher' ? 'mdi-account' : 'mdi-book'"
          class="mr-3"
        />
        {{ item.name }}
      </v-list-item>
    </v-list>
  </v-text-field>
</template>

<style scoped lang="scss">
.wrapper {
  position: relative;
  z-index: 9999;
}
.input {
  width: 100%;
}
.results {
  position: absolute;
  width: 100%;
  margin: 45px 0;
  max-height: 320px;
  overflow-y: auto;
  border-radius: 4px;
  display: block; /* Hide the results by default */
}
</style>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import debounce from 'lodash.debounce';
import { onMounted } from 'vue';
import { computed } from 'vue';
import { ElMessage } from 'element-plus';
import reviews from '@/services/Reviews';
import router from '@/router';
import { useQuery } from '@tanstack/vue-query';

const clear = () => {
  searchTerm.value = '';
  showResults.value = false;
  router.replace({
    name: 'reviews',
  });
};

const showResults = ref(false);
const searchTerm = ref('');
onMounted(() => {
  searchTerm.value = router.currentRoute.value.query.q as string;
});

watch(
  () => router.currentRoute.value.query.q as string,
  (q) => {
    searchTerm.value = q;
  },
);

const enterSearch = (id: string, type: string, name: string) => {
  showResults.value = false;
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

const {
  isError: isErrorTeachers,
  isFetching: isFetchingTeachers,
  data: searchResultsTeachers,
  refetch: refetchTeachers,
} = useQuery({
  refetchOnWindowFocus: false,
  queryKey: [
    'reviews',
    'search',
    router.currentRoute.value.query.q as string,
    'teachers',
  ],
  queryFn: () =>
    reviews.searchTeachers(router.currentRoute.value.query.q as string),
  enabled: !!(router.currentRoute.value.query.q as string),
});

const {
  isError: isErrorSubjects,
  isFetching: isFetchingSubjects,
  data: searchResultsSubjects,
  refetch: refetchSubjects,
} = useQuery({
  refetchOnWindowFocus: false,
  queryKey: [
    'reviews',
    'search',
    router.currentRoute.value.query.q as string,
    'subjects',
  ],
  queryFn: () =>
    reviews.searchSubjects(router.currentRoute.value.query.q as string),
  enabled: !!(router.currentRoute.value.query.q as string),
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

const search = (e) => {
  showResults.value = true;
  router.replace({
    name: 'reviews',
    query: {
      q: e.target?.value,
    },
  });
  useSearch();
};

const processedResults = computed(() => {
  return [
    ...(searchResultsTeachers.value?.data.data.map((result) => ({
      name: result?.name,
      id: result._id,
      type: result._id && 'teacher',
    })) || []),
    ...(searchResultsSubjects.value?.data.data.map((result) => ({
      name: result?.name,
      id: result._id,
      type: 'subject',
    })) || []),
  ];
});
</script>

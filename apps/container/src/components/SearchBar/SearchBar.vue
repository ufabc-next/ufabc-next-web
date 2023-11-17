<template>
  <FeedbackAlert v-if="isErrorTeachers" text="Erro ao buscar professores" />
  <FeedbackAlert v-if="isErrorSubjects" text="Erro ao buscar disciplinas" />
  <div class="wrapper w-100 mb-5">
    <v-text-field
      variant="solo"
      v-model="searchTerm"
      placeholder="Digite o nome do professor ou disciplina"
      @input="search"
      class="mb-1"
      hide-details
      :prepend-inner-icon="
        isFetchingTeachers || isFetchingSubjects
          ? 'mdi-loading mdi-spin'
          : 'mdi-magnify'
      "
      clearable
      @click:clear="clear"
    >
    </v-text-field>
    <v-list
      v-if="processedResults.length && router.currentRoute.value.query.q"
      class="results"
      elevation="1"
    >
      <v-list-item
        v-for="item in processedResults"
        :key="item.id"
        variant="plain"
        @click="enterSearch(item.id, item.type, item.name)"
        class="item"
      >
        <v-icon
          v-if="item.type"
          :icon="item.type === 'teacher' ? 'mdi-account' : 'mdi-book'"
          class="mr-3"
        />
        {{ item.name }}
      </v-list-item>
    </v-list>
  </div>
</template>

<style scoped lang="scss">
.wrapper {
  position: relative;
  width: 100%;
}

.wrapper:focus-within .results {
  display: block;
}

.results {
  position: absolute;
  width: 100%;
  max-height: 320px;
  overflow-y: auto;
  border-radius: 4px;
  display: none;
  z-index: 9999;
}
</style>

<script lang="ts" setup>
import { useQuery } from '@tanstack/vue-query';
import debounce from 'lodash.debounce';
import { Reviews } from 'services';
import { computed, onMounted, ref, watch } from 'vue';
import { FeedbackAlert } from '@/components/FeedbackAlert';
import type { SearchTeacherItem, SearchSubjectItem } from 'types';
import { useRouter } from 'vue-router';

const router = useRouter();

const searchTerm = ref('');

const clear = () => {
  searchTerm.value = '';
  router.replace({
    name: 'reviews',
  });
};

const query = computed(() => router.currentRoute.value.query.q as string);

onMounted(() => {
  searchTerm.value = query.value;
});

watch(
  () => query.value,
  (q) => {
    searchTerm.value = q;
  },
);

const enterSearch = (id: string, type: string, name: string) => {
  (document.activeElement as HTMLDivElement)?.blur();

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
  queryKey: ['reviews', 'search', query.value, 'teachers'],
  queryFn: () => Reviews.searchTeachers(query.value),
  enabled: !!query.value,
});

const {
  isError: isErrorSubjects,
  isFetching: isFetchingSubjects,
  data: searchResultsSubjects,
  refetch: refetchSubjects,
} = useQuery({
  refetchOnWindowFocus: false,
  queryKey: ['reviews', 'search', query.value, 'subjects'],
  queryFn: () => Reviews.searchSubjects(query.value),
  enabled: !!query.value,
});

const useSearch = debounce(() => {
  refetchTeachers();
  refetchSubjects();
}, 500);

const search = (e: InputEvent) => {
  router.replace({
    name: 'reviews',
    query: {
      q: (e.target as HTMLInputElement)?.value,
    },
  });
  useSearch();
};

const mapSearchResults = (
  type: string,
  results?: (SearchTeacherItem | SearchSubjectItem)[],
) =>
  results?.map((result) => ({
    name: result.name,
    id: result._id,
    type: type,
  })) || [];

const processedResults = computed(() => [
  ...mapSearchResults('teacher', searchResultsTeachers.value?.data.data),
  ...mapSearchResults('subject', searchResultsSubjects.value?.data.data),
]);
</script>
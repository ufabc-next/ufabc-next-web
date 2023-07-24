<template>
  <PaperCard class="w-100">
    <div v-if="Number(teacherData?.data.general.count) > 0">
      <v-row>
        <v-col cols="12" md="5">
          <v-row>
            <v-col cols="12" md="12">
              <p class="text-h4 font-weight-bold text-primary">
                {{ teacherData?.data.teacher.name }}
              </p>
            </v-col>
            <v-col cols="12" md="12">
              <v-chip
                v-for="(chip, index) in chips"
                :key="chip.text"
                variant="outlined"
                color="primary"
                :class="`${index < chips.length && 'mr-2'} mb-2`"
              >
                <v-icon :icon="chip.icon"></v-icon>
                {{ chip.value }}
                {{ chip.text }}
              </v-chip>
            </v-col>
            <v-col>
              <div
                style="
                  width: 100%;
                  height: 200px;
                  margin-left: calc(50% - 100px);
                "
              >
                <div
                  style="width: 200px; height: 200px"
                  class="bg-purple-darken-2 text-center d-flex justify-center flex-column"
                >
                  {{ grades }}
                </div>
              </div>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" md="7">
          <v-row>
            <v-col cols="12" class="px-0 px-sm-3">
              <v-select
                variant="solo"
                density="comfortable"
                v-model="selectedSubject"
                :items="subjects"
                hide-details
                :menu-icon="
                  isFetchingComments ? 'mdi-loading mdi-spin' : 'mdi-menu-down'
                "
              >
              </v-select>
            </v-col>
            <v-col>
              <v-col cols="12" class="px-0 px-sm-3">
                <div v-if="commentsData?.total !== 0">
                  <UserComment
                    v-for="comment in commentsData?.data"
                    :key="comment._id"
                    :comment="comment"
                    date=""
                    class="mb-5"
                  />
                  <div
                    v-if="commentsData?.total !== commentsData?.data.length"
                    class="text-center"
                  >
                    <v-btn
                      color="primary"
                      class="text-body-1"
                      @click="fetchMoreComments"
                      :disabled="!hasMoreComments"
                      :loading="isFetchingMoreComments"
                    >
                      Carregar mais
                    </v-btn>
                  </div>
                </div>
                <div v-else class="d-flex align-center flex-column">
                  <img
                    src="@/assets/comment_not_found.gif"
                    style="width: 100%; max-width: 128px"
                    class="mb-5"
                  />
                  Infelizmente, nenhum comentário foi encontrado 😕
                </div>
              </v-col>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </div>
    <div v-else class="d-flex align-center flex-column">
      <img
        src="@/assets/comment_not_found.gif"
        style="width: 100%; max-width: 275px"
        class="mb-5"
      />
      <p>Nenhum dado encontrado 😕</p>
      <p>
        Você já fez matéria com esse professor? Se sim, atualize seu histórico
      </p>
      <v-btn href="/history" color="primary" class="text-body-1 mt-5">
        Atualizar
      </v-btn>
    </div>
  </PaperCard>
</template>

<script lang="ts" setup>
const props = defineProps({
  id: { type: String, required: true },
});

import { computed, ref } from 'vue';
import PaperCard from '@/components/PaperCard.vue';
import { watch } from 'vue';
import UserComment from './UserComment.vue';
import { useInfiniteQuery, useQuery } from '@tanstack/vue-query';
import comments from '@/services/Comment';
import reviews from '@/services/Reviews';

const selectedSubject = ref<string>('Todas as matérias');
const page = ref<number>(0);

const selectedSubjectId = computed(
  () =>
    teacherData.value?.data.specific.find(
      (subject) => subject._id.name === selectedSubject.value,
    )?._id._id || '',
);

const {
  data: teacherData,
  isFetching: isFetchingTeacher,
  refetch: refetchTeacher,
} = useQuery({
  refetchOnWindowFocus: false,
  queryKey: ['teacher', props.id],
  queryFn: () => reviews.get(props.id),
  enabled: !!props.id,
});

const {
  data: commentsDataPageable,
  isFetching: isFetchingComments,
  refetch: refetchComments,
  fetchNextPage: fetchMoreComments,
  hasNextPage: hasMoreComments,
  isFetchingNextPage: isFetchingMoreComments,
} = useInfiniteQuery({
  refetchOnWindowFocus: false,
  queryKey: ['comments', props.id, selectedSubjectId.value, page.value],
  queryFn: ({ pageParam = 0 }) =>
    comments.get(props.id, selectedSubjectId.value, pageParam),
  enabled: !!props.id,
  getNextPageParam: (lastPage, allPages) => {
    if (lastPage.data.total >= allPages.length * 10) {
      return allPages.length;
    }
  },
});

const commentsData = computed(() => {
  if (!commentsDataPageable.value) return;
  return {
    data: commentsDataPageable.value.pages.map((page) => page.data.data).flat(),
    total: commentsDataPageable.value.pages[0].data.total,
  };
});

watch(
  () => [props.id, selectedSubject.value],
  () => {
    refetchTeacher();
    refetchComments();
  },
);

const chips = computed(() => {
  if (!teacherData.value?.data) {
    return [];
  }
  return [
    {
      value: teacherData.value.data.specific.length,
      text:
        teacherData.value.data.specific.length == 1
          ? 'disciplina'
          : 'disciplinas',
      icon: 'mdi-human-male-board',
    },
    {
      value:
        selectedSubject.value === 'Todas as matérias'
          ? teacherData.value.data.general.count
          : teacherData.value.data.specific.find(
              (subject) => subject._id.name === selectedSubject.value,
            )?.count,
      text:
        selectedSubject.value === 'Todas as matérias'
          ? teacherData.value.data.general.count == 1
            ? 'conceito'
            : 'conceitos'
          : teacherData.value.data.specific.find(
              (subject) => subject._id.name === selectedSubject.value,
            )?.count == 1
          ? 'conceito'
          : 'conceitos',
      icon: 'mdi-format-annotation-plus',
    },

    {
      value: commentsData.value?.total,
      text: commentsData.value?.total == 1 ? 'comentário' : 'comentários',
      icon: 'mdi-message-text-outline',
    },
  ];
});

const subjects = computed(() => {
  if (!teacherData.value?.data) return [];
  return [
    'Todas as matérias',
    ...teacherData.value.data.specific.map((subject) => subject._id.name),
  ];
});

const grades = computed(() => {
  if (!teacherData.value?.data) return [];
  return selectedSubject.value === 'Todas as matérias'
    ? teacherData.value.data.general.distribution.map((grade) => ({
        [grade.conceito]: grade.count / teacherData.value.data.general.count,
      }))
    : teacherData.value.data.specific
        .find((subject) => subject._id.name === selectedSubject.value)
        ?.distribution.map((grade) => ({
          [grade.conceito]:
            grade.count /
            (teacherData.value.data.specific.find(
              (subject) => subject._id.name === selectedSubject.value,
            )?.count || 1),
        }));
});
</script>

<style lang="scss" scoped></style>

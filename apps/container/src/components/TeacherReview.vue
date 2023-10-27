<template>
  <FeedbackAlert
    v-if="isFetchingTeacherError"
    text="Erro ao carregar dados do(a) professor(a)"
  />
  <CenteredLoading v-if="isFetchingTeacher" class="mt-5" />
  <PaperCard v-else class="w-100">
    <v-container style="max-width: none">
      <v-row class="pa-0" v-if="Number(teacherData?.data.general.count) > 0">
        <v-col cols="12" md="5">
          <p class="text-h4 font-weight-bold text-primary mb-2">
            {{ teacherData?.data.teacher.name }}
          </p>
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
          <div
            class="d-flex align-center justify-center"
            :style="`${xs && 'margin: 0 -24px'}`"
          >
            <ConceptsPieChart
              :key="`chart-${selectedSubject}`"
              :grades="grades"
            ></ConceptsPieChart>
          </div>
          <p class="text-body-2 text-center font-weight-bold mt-6">
            * Provavelmente esse professor
            {{
              demandsAttendance ? ' cobra presença👎' : ' NÃO cobra presença👍'
            }}
          </p>
        </v-col>
        <v-col cols="12" md="7">
          <CommentsList
            :teacherId="teacherId"
            :selectedSubject="selectedSubject"
            @update:selectedSubject="selectedSubject = $event"
          />
        </v-col>
      </v-row>
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
    </v-container>
  </PaperCard>
</template>

<script lang="ts" setup>
import { useQuery } from '@tanstack/vue-query';
import { Reviews } from 'services';
import { transformConceptDataToObject } from 'utils';
import { computed, ref } from 'vue';
import { useDisplay } from 'vuetify';
import { FeedbackAlert } from '@/components/FeedbackAlert';
import ConceptsPieChart from './ConceptsPieChart.vue';

import { CenteredLoading } from '@/components/CenteredLoading';
import { PaperCard } from '@/components/PaperCard';
import CommentsList from '@/components/CommentsList.vue';

const props = defineProps({
  teacherId: { type: String, required: true },
});

const teacherId = computed(() => props.teacherId);

const { xs } = useDisplay();

const selectedSubject = ref<string>('Todas as matérias');

const {
  data: teacherData,
  isFetching: isFetchingTeacher,
  isError: isFetchingTeacherError,
} = useQuery({
  refetchOnWindowFocus: false,
  queryKey: ['teacher', teacherId],
  queryFn: () => Reviews.getTeacher(teacherId.value),
  enabled: !!teacherId.value,
});

const chips = computed(() => {
  if (!teacherData.value?.data) {
    return [];
  }
  return [
    {
      value: teacherData.value.data.specific.filter(
        (subject) => subject._id,
      ).length,
      text:
        teacherData.value.data.specific.filter(
          (subject) => subject._id,
        ).length == 1
          ? 'disciplina'
          : 'disciplinas',
      icon: 'mdi-human-male-board',
    },
    {
      value:
        selectedSubject.value === 'Todas as matérias'
          ? teacherData.value.data.general.count
          : teacherData.value.data.specific
              .filter((subject) => subject._id)
              .find((subject) => subject._id.name === selectedSubject.value)
              ?.count,
      text:
        selectedSubject.value === 'Todas as matérias'
          ? teacherData.value.data.general.count == 1
            ? 'conceito'
            : 'conceitos'
          : teacherData.value.data.specific
              .filter((subject) => subject._id)
              .find((subject) => subject._id.name === selectedSubject.value)
              ?.count == 1
          ? 'conceito'
          : 'conceitos',
      icon: 'mdi-format-annotation-plus',
    },
  ];
});

const grades = computed(() => {
  if (!teacherData.value?.data) return {};
  if (selectedSubject.value === 'Todas as matérias') {
    return transformConceptDataToObject(
      teacherData.value.data.general.distribution,
      teacherData.value.data.general.count,
    );
  }
  const data = teacherData.value.data.specific
    .filter((subject) => subject._id)
    .find((subject) => subject._id.name === selectedSubject.value);
  return transformConceptDataToObject(
    data?.distribution || [],
    data?.count || 1,
  );
});

const demandsAttendance = computed(() => {
  if (!teacherData.value?.data) return false;
  return teacherData.value.data.general.distribution.some(
    (grade) => grade.conceito === 'O',
  );
});
</script>


<template>
  <section class="d-flex flex-column elevation-0 pa-0 bg-white rounded-lg">
        <v-select
          chips
          :items="cpHistoryData"
          :item-title="(course) => course.curso"
          :item-value="(course) => course"
          v-model="currentCpHistory"
          variant="outlined"
        ></v-select>
  </section>
  <section>
    <div class="column flex mt-3 mb-4">
      <div class="meu-layout d-flex justify-content-between">
        <PlanningCard
          :value="90/90"
          title="Obrigatórias"
          color="ufabcnext-yellow"
          icon="mdi-alert-box"
        >
        </PlanningCard>
        <PlanningCard
          :value="userMaxCr"
          title="Limitadas"
          color="purple"
          icon="mdi-bullseye-arrow"
        >
        </PlanningCard>
        <PlanningCard
          :value="userMaxCr"
          title="Livres"
          color="primary"
          icon="mdi-balloon"
        >
        </PlanningCard>
        <PlanningCard
          :value="userMaxCr"
          title="Progresso total"
          color="ufabcnext-green"
          icon="mdi-school"
        >
        </PlanningCard>
      </div>
      <template v-for="(year, index) in enrollmentByYearKeysSorted" :key="year">
        <PlanningYearCard
          :value="userMaxCr"
          :year="year"
          :index="index"
          color="ufabcnext-green"
          icon="mdi-school"
        >
      </PlanningYearCard>
      </template>
      

      
    </div>
  </section>
  <!-- <PaperCard class="mt=4">
    <p>Oi</p>
  </PaperCard> -->






  <FeedbackAlert v-if="isErrorEnrollments" />
  <FeedbackAlert v-if="isErrorUser" />
  <PaperCard class="mt-4">
    <div
      v-if="!!enrollmentByDateKeysSorted.length"
      class="horizontal-scroll-except-first-column"
    >
      <TableComponent>
        <!-- <template #head>
          <tr>
            <th
              v-for="item in tableHead"
              :key="item"
              :class="`text-white text-caption ${
                item !== 'Disciplina' ? 'text-center' : ''
              } text-uppercase`"
            >
              {{ item }}
            </th>
          </tr>
        </template> -->
        <template #body>
          <template v-for="date in enrollmentByDateKeysSorted" :key="date">
            {{ enrollmentByYearKeysSorted }}
            <tr class="bg-blue">
              <td
                style="position: sticky; left: 0"
                colspan="1"
                class="text-left"
              >
                {{ Number(date) % 10 }}
                de
                {{ Math.round(Number(date) / 10) }}
              </td>
              <td :colspan="tableHead.length - 1"></td>
            </tr>
            <tr v-for="item in enrollmentByDate?.[date]" :key="item._id">
              <td
                rowspan="1"
                colspan="1"
                :class="`bg-secondary text-left text-next-${
                  subjectConceptClass[item.conceito]
                }`"
                style="position: sticky; left: 0; z-index: 1"
              >
                {{ item.disciplina }}
              </td>
              <td rowspan="1" colspan="1" class="px-2" style="max-width: 200px">
                <div
                  :class="`text-next-light-gray text-caption d-flex align-center ${
                    item.teoria?.name ? 'justify-left' : 'justify-center'
                  }`"
                >
                  <v-btn
                    v-if="item.teoria?.name"
                    flat
                    variant="text"
                    icon="mdi-message-draw"
                    class="text-subtitle-2"
                    size="x-small"
                    @click="handleOpenDialog(item, 'teoria')"
                  >
                    <v-icon
                      :color="
                        item.comments?.includes('teoria')
                          ? 'ufabcnext-green'
                          : ''
                      "
                    />
                  </v-btn>
                  <span class="text-truncate">{{
                    item.teoria?.name || '-'
                  }}</span>
                </div>
              </td>
              <td rowspan="1" colspan="1" class="px-2" style="max-width: 200px">
                <div
                  :class="`text-next-light-gray text-truncate text-caption d-flex align-center ${
                    item.pratica?.name ? 'justify-left' : 'justify-center'
                  }`"
                >
                  <v-btn
                    v-if="item.pratica?.name"
                    flat
                    variant="text"
                    icon="mdi-message-draw"
                    class="text-subtitle-2"
                    size="x-small"
                    @click="handleOpenDialog(item, 'pratica')"
                  >
                    <v-icon
                      :color="hasCommented(item) ? 'ufabcnext-green' : ''"
                    />
                  </v-btn>
                  <span class="text-truncate">{{
                    item.pratica?.name || '-'
                  }}</span>
                </div>
              </td>
              <td
                rowspan="1"
                colspan="1"
                class="font-weight-bold text-body-1"
                :style="`color: ${conceptsColor[item.conceito]}`"
              >
                {{ item.conceito }}
              </td>
              <td>{{ item.creditos }}</td>
            </tr>
          </template>
        </template>
      </TableComponent>
    </div>
    <div
      class="mt-5 d-flex justify-center align-center flex-column"
      v-else-if="!isPendingEnrollments"
    >
      <h2 class="mb-4">
        Parece que não encontramos os dados do seu histórico :( <br />
        É necessário instalar a
        <a :href="extensionURL" target="_blank" class="text-decoration-none"
          >extensão</a
        >
        e acessar a tela de Fichas Individuais no
        <a :href="studentRecordURL" target="_blank" class="text-decoration-none"
          >Portal do Aluno.</a
        >
      </h2>
      <img
        src="@/assets/missing_history.svg"
        width="500"
        height="400"
        alt="Histórico não encontrado"
      />
    </div>
    <CenteredLoading v-if="isPendingEnrollments" />
  </PaperCard>
















</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { PlanningCard } from '@/components/PlanningCard';
import { PlanningYearCard } from '@/components/PlanningYearCard';
import { useQuery } from '@tanstack/vue-query';
import { Performance, type CourseInformation } from 'services';
import type { Concept, Enrollment } from 'types';
import { CenteredLoading } from '@/components/CenteredLoading';
import { PaperCard } from '@/components/PaperCard';
import { TableComponent } from '@/components/TableComponent';
import { FeedbackAlert } from '@/components/FeedbackAlert';
import { Enrollments } from 'services';
import {
  checkEAD,
  conceptsColor,
  extensionURL,
  formatSeason,
  studentRecordURL,
} from 'utils';

const showDialog = ref(false);
const selectedEnrollment = ref<Enrollment>();

const tags = ref<string[]>([]);
const handleOpenDialog = (
  enrollment: Enrollment,
  type: 'teoria' | 'pratica',
) => {
  const processedEnrollment: Enrollment = {
    ...enrollment,
    [type]: enrollment[type],
  };
  selectedEnrollment.value = processedEnrollment;

  const isEAD =
    enrollment.year &&
    enrollment.quad &&
    checkEAD(enrollment.year, enrollment.quad);

  tags.value = [
    enrollment.pratica?._id === enrollment.teoria?._id
      ? 'teoria e prática'
      : type === 'pratica'
      ? 'prática'
      : 'teoria',
    formatSeason(processedEnrollment.year + ':' + processedEnrollment.quad),
    isEAD && 'EAD',
  ].filter(Boolean) as string[];

  showDialog.value = true;
};

const tableHead = [
  'Disciplina',
  'Professor de Teoria',
  'Professor de Prática',
  'Conceito',
  'Créditos',
];

const subjectConceptClass = {
  A: 'gray',
  B: 'gray',
  C: 'gray',
  D: 'gray',
  O: 'error',
  F: 'error',
  E: 'error',
  I: 'error',
} satisfies Record<Concept, string>;

const {
  data: enrollments,
  isPending: isPendingEnrollments,
  isError: isErrorEnrollments,
} = useQuery({
  queryKey: ['enrollments', 'list'],
  queryFn: Enrollments.list,
  select: (response) => response.data,
});

const enrollmentByDate = computed(() => {
  const enrollmentCopy = enrollments.value?.slice();
  return enrollmentCopy?.reduce(
    (acc, enroll) => {
      const date = enroll.quad + enroll.year * 10;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(enroll);
      return acc;
    },
    {} as Record<string, Enrollment[]>,
  );
});

const hasCommented = (item: Enrollment) =>
  item.comments?.includes('pratica') ||
  (item.pratica?._id === item.teoria?._id && item.comments?.includes('teoria'));

const enrollmentByDateKeysSorted = computed(() =>
  Object.keys(enrollmentByDate.value || {}).sort(),
);

const enrollmentByYearKeysSorted = computed(() => {
  const sortedKeys = Object.keys(enrollmentByDate.value || {}).sort();
  const firstFourDigits = sortedKeys.map(date => date.substring(0, 4));

  // Remover valores duplicados utilizando Set
  const uniqueYears = [...new Set(firstFourDigits)];

  return uniqueYears; // Retorna um array com valores únicos
});




















// DADOS SOBRE CR
const {
  data: crHistoryData,
  // isLoading: isLoadingCrHistory,
} = useQuery({
  queryKey: ['crHistory'],
  queryFn: Performance.getCrHistory,
  select: (response) => response.data,
});
const userMaxCr = computed(() => {
  const crAcumulados = crHistoryData.value?.map((quad) => quad.cr_acumulado);
  if (crAcumulados) {
    return Math.max(...crAcumulados).toFixed(2);
  } else {
    return 'undefined';
  }
});

// DADOS SOBRE CP
const currentCpHistory = ref<CourseInformation>();
const {
  data: cpHistoryData,
  // isLoading: isLoadingCrHistory,
} = useQuery({
  queryKey: ['cpHistory'],
  queryFn: Performance.getHistoriesGraduations,
  select: (response) => {
    currentCpHistory.value = response.data.docs[0]; // updating v-select
    return response.data.docs;
  },
});
</script>
    
<style scoped>
.meu-layout {
  display: flex;
  /* justify-content: space-between; */
}
.PerformanceCard {
  flex: 1;
  margin: 10px;
}
.ve-line {
  width: auto;
  height: 400px;
  position: relative;
}








.chip-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}
</style>
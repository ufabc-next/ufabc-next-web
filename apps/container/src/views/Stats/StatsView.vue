<template>
  <PaperCard>
    <el-tabs v-model="tab">
      <el-tab-pane label="Turmas" name="classes"></el-tab-pane>
      <el-tab-pane label="Cursos" name="courses"></el-tab-pane>
      <el-tab-pane label="Disciplinas" name="subjects"></el-tab-pane>
    </el-tabs>

    <div
      class="d-flex justify-space-between flex-column flex-md-row align-md-center mb-4"
    >
      <p>{{ total }} resultados encontrados</p>
      <el-checkbox-group
        v-model="filterByPeriod"
        style="min-width: 200px"
        class="my-2 my-md-0"
      >
        <el-checkbox label="diurno">Matutino</el-checkbox>
        <el-checkbox label="noturno">Noturno</el-checkbox>
      </el-checkbox-group>
      <v-menu transition="slide-y-transition">
        <template v-slot:activator="{ props }">
          <div>
            <button v-bind="props" class="text-body-2 order-button mr-2">
              <span class="font-weight-bold text-black"> Ordenar por: </span>
              {{ orderByOptions.find((o) => o === orderBy) }}
              <v-icon class="text-ufabcnext-green"> mdi-menu-down </v-icon>
            </button>
          </div>
        </template>
        <v-list>
          <v-list-item
            v-for="item in orderByOptions"
            @click="changeOrderBy(item)"
            :key="item"
          >
            <v-list-item-title>{{ item }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>

    <el-table
      empty-text="Nenhum dado encontrado"
      ref="disciplinas"
      v-loading="isLoadingCurrentInfo"
      :data="disciplinas"
      style="width: 100%"
    >
      <el-table-column fixed="left" min-width="200" label="Nome">
        <template #default="scope">
          {{ matriculaNameLabel(scope.row) }}
        </template>
      </el-table-column>
      <el-table-column prop="vagas" label="Vagas" align="center" width="150">
      </el-table-column>
      <el-table-column
        prop="requisicoes"
        label="Requisições"
        align="center"
        width="150"
      >
      </el-table-column>
      <el-table-column
        prop="deficit"
        label="Deficit"
        align="center"
        width="150"
      >
      </el-table-column>
      <el-table-column
        prop="ratio"
        label="Pessoas por vaga"
        align="center"
        width="160"
      >
        <template #default="scope">
          {{ scope.row.ratio.toFixed(2) }}
        </template>
      </el-table-column>
    </el-table>
    <el-button v-if="hasMoreItems" @click="fetchMoreItems()" class="w-100 mt-2">
      Carregar mais <i class="el-icon-arrow-down el-icon-right"></i>
    </el-button>
  </PaperCard>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { StatsSubjects, type StatsParams } from 'services';
import type { StatsClass, StatsSubject, StatsCourse } from 'types';
import { useInfiniteQuery, useQuery } from '@tanstack/vue-query';
import { getSeason } from 'utils/season';
import { PaperCard } from '@/components/PaperCard';

type Tab = 'classes' | 'courses' | 'subjects';
type OrderBy = 'deficit' | 'ratio' | 'vagas' | 'requisicoes';

const orderByOptions: OrderBy[] = ['deficit', 'ratio', 'vagas', 'requisicoes'];

const orderBy = ref<OrderBy>('deficit');

const tab = ref<Tab>('classes');

const filterByPeriod = ref<StatsParams['turno'][]>(['diurno', 'noturno']);

const changeOrderBy = (item: OrderBy) => {
  orderBy.value = item;
  pages.value[tab.value] = 0;
};

const pages = ref({
  subjects: 0,
  courses: 0,
  classes: 0,
});

const { year, quad } = getSeason();

const params = computed<StatsParams>(() => ({
  page: pages.value[tab.value],
  season: `${year}:${quad}`,
  turno:
    filterByPeriod.value.length === 1 ? filterByPeriod.value[0] : undefined,
  deficit: orderBy.value === 'deficit' ? 1 : undefined,
  ratio: orderBy.value === 'ratio' ? 1 : undefined,
  vagas: orderBy.value === 'vagas' ? 1 : undefined,
  requisicoes: orderBy.value === 'requisicoes' ? 1 : undefined,
}));

const isSubjectsTab = computed(() => tab.value === 'subjects');
const isCoursesTab = computed(() => tab.value === 'courses');
const isClassesTab = computed(() => tab.value === 'classes');

const subjects = useInfiniteQuery({
  queryFn: () => StatsSubjects.getAllSubjects(params.value),
  queryKey: [
    'stats',
    'disciplinas',
    pages.value.subjects,
    orderBy,
    filterByPeriod,
  ],
  getNextPageParam: (lastPage: { data: { total: number } }, allPages) => {
    if (lastPage.data.total >= allPages.length * 10) {
      return allPages.length;
    }
  },
  initialPageParam: 0,
  enabled: isSubjectsTab,
  select: ({ pages }) => pages.flatMap((page) => page.data),
});

const courses = useInfiniteQuery({
  queryFn: () => StatsSubjects.getAllCourses(params.value),
  queryKey: [
    'stats',
    'disciplinas',
    'courses',
    pages.value.courses,
    orderBy,
    filterByPeriod,
  ],
  getNextPageParam: (lastPage: { data: { total: number } }, allPages) => {
    if (lastPage.data.total >= allPages.length * 10) {
      return allPages.length;
    }
  },
  initialPageParam: 0,
  enabled: isCoursesTab,
  select: ({ pages }) => pages.flatMap((page) => page.data),
});

const classes = useInfiniteQuery({
  queryFn: () => StatsSubjects.getAllClasses(params.value),
  queryKey: [
    'stats',
    'disciplinas',
    'classes',
    pages.value.classes,
    orderBy,
    filterByPeriod,
  ],
  getNextPageParam: (lastPage: { data: { total: number } }, allPages) => {
    if (lastPage.data.total >= allPages.length * 10) {
      return allPages.length;
    }
  },
  initialPageParam: 0,
  enabled: isClassesTab,
  select: ({ pages }) => pages.flatMap((page) => page.data),
});

const { data: coursesNames } = useQuery({
  queryFn: StatsSubjects.getAllCoursesNames,
  queryKey: ['histories', 'courses'],
  select: ({ data }) => data,
});

const queriesData = computed(() => ({
  subjects,
  courses,
  classes,
}));

const isLoadingCurrentInfo = computed(
  () => queriesData.value[tab.value]?.isFetching?.value,
);

const total = computed(
  () => queriesData.value[tab.value]?.data?.value?.[0].total,
);

const disciplinas = computed(
  () =>
    queriesData.value[tab.value]?.data?.value?.flatMap(
      (page) =>
        page.data as readonly (StatsSubject | StatsClass | StatsCourse)[],
    ),
);

const hasMoreItems = computed(
  () => queriesData.value[tab.value]?.hasNextPage?.value,
);

const fetchMoreItems = () => {
  pages.value[tab.value]++;
  queriesData.value[tab.value]?.fetchNextPage?.();
};

const mapCourseName = (courseId: number) => {
  const course = coursesNames.value?.find(
    (course) => course.curso_id === courseId,
  );
  return course?.name;
};

const mapTurnoLabel = (turno: NonNullable<StatsParams['turno']>) => {
  return {
    noturno: 'Noturno',
    diurno: 'Matutino',
  }[turno];
};

const matriculaNameLabel = (data: StatsClass | StatsSubject | StatsCourse) => {
  if (!data) return;
  if (tab.value == 'courses') {
    return mapCourseName((data as StatsCourse)._id);
  }
  if (tab.value == 'subjects') {
    return (data as StatsSubject).disciplina;
  }

  const info = data as StatsClass;

  return `${info.disciplina} ${info.turma}-${mapTurnoLabel(info.turno)}`;
};
</script>

<style scoped>
.order-button {
  &:hover {
    color: #56cdb7;
  }
}
</style>

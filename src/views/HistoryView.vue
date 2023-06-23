<template>
  <PaperCard title="Ficha individual do aluno" _class="text-next-gray">
    <p class="mt-4">
      Esta ficha individual é uma réplica do que você pode encontrar no site do
      <a
        class="text-decoration-none"
        href="https://aluno.ufabc.edu.br/fichas_individuais"
        >Portal do Aluno.</a
      >
    </p>
    <p class="mt-4">
      Caso o seu histórico esteja desatualizado, basta acessar o portal
      novamente utilizando a
      <a
        class="text-decoration-none"
        href="https://aluno.ufabc.edu.br/fichas_individuais"
        >extensão do UFABC Next e as informações serão atualizadas.</a
      >
    </p>
    <p class="mt-4">
      Se o nome de algum professor estiver errado, você pode corrigir clicando
      no botão "Fazer comentário" ao lado do nome do professor.
    </p>
  </PaperCard>
  <PaperCard class="mt-4">
    <TableComponent>
      <template #head>
        <tr>
          <th
            v-for="item in tableHead"
            :key="item"
            class="text-white text-center"
          >
            {{ item }}
          </th>
        </tr>
      </template>
      <template #body>
        <template v-for="date in enrollmentByDateKeysSorted" :key="date">
          <tr>
            <td v-bind:colspan="tableHead.length" class="text-left px-0">
              <div class="bg-white h-100 d-flex align-center px-4">
                {{ Number(date) % 10 }}
                de
                {{ Math.round(Number(date) / 10) }}
              </div>
            </td>
          </tr>
          <tr v-for="item in enrollmentByDate?.[date]" :key="item._id">
            <td
              v-bind:class="`text-left text-next-${
                subjectConceptClass[item.conceito]
              }`"
            >
              {{ item.disciplina }}
            </td>
            <td>{{ item.teoria?.name || '-' }}</td>
            <td>
              {{ item.pratica?.name || '-' }}
            </td>
            <td
              class="font-weight-bold text-body-1"
              v-bind:style="`color: ${conceptsColor[item.conceito]}`"
            >
              {{ item.conceito }}
            </td>
            <td>{{ item.creditos }}</td>
          </tr>
        </template>
      </template>
    </TableComponent>
  </PaperCard>
</template>

<script setup lang="ts">
import PaperCard from '@/components/PaperCard.vue';
import TableComponent from '@/components/TableComponent.vue';
import Enrollment, {
  Concept,
  Enrollment as EnrollmentType,
} from '@/services/Enrollment';
import useFetch from '@/hooks/useFetch';
import { computed } from 'vue';

const tableHead = [
  'DISCIPLINA',
  'PROFESSOR DE TEORIA',
  'PROFESSOR DE PRÁTICA',
  'CONCEITO',
  'CRÉDITOS',
];

const conceptsColor = {
  A: 'rgb(63, 207, 140)',
  B: 'rgb(184, 233, 134)',
  C: 'rgb(248, 183, 76)',
  D: 'rgb(255, 160, 4)',
  F: 'rgb(249, 84, 105)',
  O: 'rgb(169, 169, 169)',

  // exceptions
  I: 'rgb(25, 118, 210)',
  E: 'rgb(25, 118, 210)',
  null: 'rgb(0, 0, 0)',
};

const subjectConceptClass = {
  A: 'gray',
  B: 'gray',
  C: 'gray',
  D: 'gray',
  O: 'error',
  F: 'error',
} satisfies Record<Concept, string>;

const {
  data: enrollment,
  isLoading: isLoadingEnrollment,
  error: errorEnrollment,
} = useFetch(Enrollment.list);

const enrollmentByDate = computed(() => {
  const enrollmentCopy = enrollment.value?.slice();
  return enrollmentCopy?.reduce((acc, enroll) => {
    const date = enroll.quad + enroll.year * 10;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(enroll);
    return acc;
  }, {} as Record<string, EnrollmentType[]>);
});

const enrollmentByDateKeysSorted = computed(() => {
  return Object.keys(enrollmentByDate.value || {}).sort();
});
</script>

<template>
  <FeedbackAlert v-if="!!errorEnrollment" />
  <FeedbackAlert v-if="!!errorUser" />
  <PaperCard title="Ficha individual do aluno" class="text-next-gray">
    <p class="mt-4">
      Esta ficha individual é uma réplica do que você pode encontrar no site do
      <a class="text-decoration-none" :href="studentRecordURL"
        >Portal do Aluno.</a
      >
    </p>
    <p class="mt-4">
      Caso o seu histórico esteja desatualizado, basta acessar o portal
      novamente utilizando a
      <a class="text-decoration-none" :href="extensionURL"
        >extensão do UFABC Next</a
      >
      e as informações serão atualizadas.
    </p>
    <p class="mt-4">
      Se o nome de algum professor estiver errado, você pode corrigir clicando
      no botão "Fazer comentário" ao lado do nome do professor.
    </p>
    <div v-if="!!enrollment && !!user" class="chip-wrapper mt-4">
      <div class="chip">
        <span class="font-weight-bold">RA</span> {{ user.ra }}
      </div>
      <div class="chip">
        <v-icon icon="mdi-book-multiple" />
        {{ enrollment?.length }}
        {{
          enrollment?.length === 1
            ? 'Disciplina cursada'
            : 'Disciplinas cursadas'
        }}
      </div>
      <div class="chip">
        <v-btn
          icon="mdi-refresh"
          @click="handleOpenExtensionDialog"
          flat
          variant="text"
          size="x-small"
        >
          <v-dialog v-model="extensionDialog" width="360">
            <v-card class="pa-4">
              <v-card-title class="text-h6 px-2">
                Atualizar histórico
              </v-card-title>
              <v-card-text class="text-subtitle-2 px-2">
                Para atualizar o seu histórico no UFABC Next, é preciso ter a
                <a :href="extensionURL" target="_blank">extensão</a>
                instalada.
              </v-card-text>
              <v-card-actions class="justify-end">
                <v-btn
                  color="next-light-gray"
                  class="text-subtitle"
                  target="_blank"
                  :href="extensionURL"
                  @click="handleCloseExtensionDialog"
                  >Não tenho</v-btn
                >
                <v-btn
                  color="success"
                  class="text-subtitle"
                  target="_blank"
                  :href="studentRecordURL"
                  @click="handleCloseExtensionDialog"
                  >Já tenho instalado</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-tooltip activator="parent" offset="1" location="bottom center"
            >Atualizar o histórico</v-tooltip
          >
          <v-icon size="x-large" />
        </v-btn>
        {{
          lastUpdate
            ?.toLocaleString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })
            .replace(',', ' -')
        }}
      </div>
    </div>
  </PaperCard>
  <PaperCard class="mt-4 px-0 py-0 px-sm-4 py-sm-4">
    <div
      v-if="!!enrollmentByDateKeysSorted.length"
      class="horizontal-scroll-except-first-column"
    >
      <TableComponent>
        <template #head>
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
        </template>
        <template #body>
          <template v-for="date in enrollmentByDateKeysSorted" :key="date">
            <tr class="bg-white">
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
                  >
                    <v-icon size="small" />
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
                  >
                    <v-icon />
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
      v-else-if="!isLoadingEnrollment"
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
      <img src="@/assets/missing_history.svg" width="500" height="400" />
    </div>
    <CenteredLoading v-if="isLoadingEnrollment" />
  </PaperCard>
</template>

<style scoped lang="scss">
.chip-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}
.chip {
  min-height: 48px;
  border-radius: 4px;
  background-color: #f3f6f7;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  padding-left: 12px;
  column-gap: 8px;
  padding-right: 8px;
  font-size: 18px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.75);
  & button {
    width: var(--v-btn-width);
    height: var(--v-btn-height);
  }
  & i {
    font-size: 20px;
  }
  & span {
    font-size: 16px;
  }
}
</style>
<script setup lang="ts">
import { PaperCard } from '@/components/PaperCard';
import { TableComponent } from '@/components/TableComponent';
import {
  Users,
  Enrollments,
  Enrollment as EnrollmentType,
  Concept,
} from 'services';
import { computed } from 'vue';
import { CenteredLoading } from '@/components/CenteredLoading';
import { FeedbackAlert } from '@/components/FeedbackAlert';
import { ref } from 'vue';
import { useQuery } from '@tanstack/vue-query';

const tableHead = [
  'Disciplina',
  'Professor de Teoria',
  'Professor de Prática',
  'Conceito',
  'Créditos',
];

const extensionDialog = ref(false);

const handleCloseExtensionDialog = () => {
  extensionDialog.value = false;
};

const handleOpenExtensionDialog = () => {
  extensionDialog.value = true;
};

const extensionURL =
  'https://chrome.google.com/webstore/detail/ufabc-matricula/gphjopenfpnlnffmhhhhdiecgdcopmhk';

const studentRecordURL = 'https://aluno.ufabc.edu.br/fichas_individuais';

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
} = useQuery({
  queryKey: ['enrollments'],
  queryFn: Enrollments.list,
  select: (response) => response.data,
});

const { data: user, error: errorUser } = useQuery({
  queryKey: ['users', 'info'],
  queryFn: Users.info,
  select: (response) => response.data,
});

const enrollmentByDate = computed(() => {
  const enrollmentCopy = enrollment.value?.slice();
  return enrollmentCopy?.reduce(
    (acc, enroll) => {
      const date = enroll.quad + enroll.year * 10;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(enroll);
      return acc;
    },
    {} as Record<string, EnrollmentType[]>,
  );
});

const enrollmentByDateKeysSorted = computed(() => {
  return Object.keys(enrollmentByDate.value || {}).sort();
});

const lastUpdate = computed(() => {
  const date = enrollment.value?.[0]?.updatedAt;
  return date && new Date(date);
});
</script>

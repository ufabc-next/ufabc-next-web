<template>
  <CenteredLoading v-if="isFetchingSubject" class="mt-5" />
  <PaperCard v-else class="w-100">
    <div v-if="Number(subjectData?.data.general.count) > 0">
      <v-row>
        <v-col cols="12" md="5">
          <v-row>
            <v-col cols="12" md="12">
              <p class="text-h4 font-weight-bold text-primary">
                {{ subjectData?.data.subject.name }}
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
              <ConceptsPieChart
                :key="`chart-${subjectData?.data.subject.name}`"
                :grades="generalGrades"
              />
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" md="7" class="px-0 px-md-3">
          <v-row>
            <v-col class="px-0 px-md-3">
              <v-col
                cols="12"
                class="px-0"
                :style="`${!smAndDown && 'max-height:500px ; overflow-y:auto'}`"
              >
                <div
                  v-if="subjectData?.data.specific.length"
                  class="d-flex flex-column align-end"
                >
                  <v-menu transition="slide-y-transition">
                    <template v-slot:activator="{ props }">
                      <button
                        v-bind="props"
                        class="text-body-2 order-button mb-4 mr-2"
                      >
                        <span class="font-weight-bold text-black">
                          Ordenar por:
                        </span>
                        {{
                          orders.find((o) => o.value === selectedOrder)?.title
                        }}
                        <v-icon class="text-ufabcnext-green">
                          mdi-menu-down
                        </v-icon>
                      </button>
                    </template>
                    <v-list>
                      <v-list-item
                        v-for="(item, i) in orders"
                        @click="selectedOrder = item.value"
                        :key="i"
                      >
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                  <v-table
                    hover
                    density="comfortable"
                    class="rounded-lg w-100 pr-sm-2"
                  >
                    <thead v-if="!xs" class="table-head bg-ufabcnext-green">
                      <tr>
                        <th
                          v-for="(item, index) in tableHead"
                          :key="item"
                          :class="`text-white text-caption text-uppercase text-center ${
                            !index && 'title-first-column'
                          }`"
                        >
                          {{ item }}
                        </th>
                      </tr>
                    </thead>
                    <tbody v-if="!xs" class="table-body bg-secondary">
                      <tr
                        v-for="teacher in shortedSpecifics"
                        :key="teacher._id.mainTeacher + 'row'"
                      >
                        <td class="first-column">
                          <router-link
                            v-if="teacher.teacher?.name"
                            class="link"
                            :to="`/review?q=${teacher.teacher.name}&teacherId=${teacher.teacher._id}`"
                          >
                            {{ teacher.teacher?.name }}
                          </router-link>
                          <p v-else>Professor não encontrado</p>
                        </td>
                        <td class="w-100 py-5">
                          <ConceptsHorizontalChart :grade-data="teacher" />
                        </td>
                        <td class="text-center">{{ teacher.count }}</td>
                      </tr>
                    </tbody>
                    <tbody v-else class="table-body bg-secondary">
                      <tr
                        v-for="teacher in shortedSpecifics"
                        :key="teacher._id.mainTeacher + 'row'"
                      >
                        <td class="w-100 py-2">
                          <router-link
                            v-if="teacher.teacher?.name"
                            class="link"
                            :to="`/review?q=${teacher.teacher.name}&teacherId=${teacher.teacher._id}`"
                          >
                            {{ teacher.teacher?.name }}
                          </router-link>
                          <p v-else>Professor não encontrado</p>
                          <ConceptsHorizontalChart
                            :grade-data="teacher"
                            class="my-1"
                          />
                          Amostras: {{ teacher.count }}
                        </td>
                      </tr>
                    </tbody>
                  </v-table>
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
        Você já fez matéria com algum professor? Se sim, atualize seu histórico
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
import ConceptsPieChart from './ConceptsPieChart.vue';
import ConceptsHorizontalChart from './ConceptsHorizontalChart.vue';
import PaperCard from '@/components/PaperCard.vue';
import CenteredLoading from '@/components/CenteredLoading.vue';
import { useQuery } from '@tanstack/vue-query';
import reviews from '@/services/Reviews';
import { useDisplay } from 'vuetify';
import { computed, ref } from 'vue';
import transformGradeDataToObject from '@/utils/transformGradeDataToObject';
import { SubjectSpecific } from '@/types/subject';
import { GradeData } from '@/types/teacher';
import { Grade } from '@/types/grades';
const { smAndDown, xs } = useDisplay();

const selectedOrder = ref('nada');

const { data: subjectData, isFetching: isFetchingSubject } = useQuery({
  refetchOnWindowFocus: false,
  queryKey: ['subject', props.id],
  queryFn: () => reviews.getSubject(props.id),
  enabled: !!props.id,
});

const chips = computed(() => {
  if (!subjectData.value?.data) {
    return [];
  }
  return [
    {
      value: subjectData.value?.data.general.count,
      text:
        subjectData.value?.data.general.count == 1 ? 'conceito' : 'conceitos',
      icon: 'mdi-message-text-outline',
    },
    {
      value: subjectData.value.data.specific.length,
      text:
        subjectData.value.data.specific.length == 1
          ? 'professor'
          : 'professores',
      icon: 'mdi-human-male-board',
    },
  ];
});

const generalGrades = computed(() => {
  if (!subjectData.value?.data) return {};
  return transformGradeDataToObject(
    subjectData.value.data.general.distribution,
    subjectData.value.data.general.count,
  );
});

const tableHead = ['Nome do Professor', 'Conceitos', 'Amostras'];

const orders = [
  {
    title: 'Nome do Professor (A-Z)',
    value: 'teacherCres',
  },
  {
    title: 'Nome do Professor (Z-A)',
    value: 'teacherDecres',
  },
  {
    title: 'Amostras (Crescente)',
    value: 'samplesCres',
  },
  {
    title: 'Amostras (Decrescente)',
    value: 'samplesDecres',
  },
  {
    title: 'Maior Aprovação',
    value: 'mostApproved',
  },
  {
    title: 'Maior Reprovação',
    value: 'leastApproved',
  },
];

const approveRating = (subject: SubjectSpecific) => {
  const approvalConcepts: Grade[] = ['A', 'B', 'C', 'D'];
  const reproofConcepts: Grade[] = ['F', 'O'];

  return (
    subject.distribution.reduce((acc, grade) => {
      if (approvalConcepts.includes(grade.conceito)) {
        acc += grade.count;
      } else if (reproofConcepts.includes(grade.conceito)) {
        acc -= grade.count;
      }
      return acc;
    }, 0) / subject.count
  );
};

const shortedSpecifics = computed(() => {
  if (!subjectData.value?.data.specific) return [];
  const sorted: SubjectSpecific[] = JSON.parse(
    JSON.stringify(subjectData.value.data.specific),
  );

  if (selectedOrder.value === 'teacherCres') {
    sorted.sort((a, b) => (a.teacher?.name > b.teacher?.name ? 1 : -1));
  } else if (selectedOrder.value === 'teacherDecres') {
    sorted.sort((a, b) => (a.teacher?.name > b.teacher?.name ? -1 : 1));
  } else if (selectedOrder.value === 'samplesCres') {
    sorted.sort((a, b) => a.count - b.count);
  } else if (selectedOrder.value === 'samplesDecres') {
    sorted.sort((a, b) => b.count - a.count);
  } else if (selectedOrder.value === 'mostApproved') {
    sorted.sort((a, b) => approveRating(a) - approveRating(b));
  } else if (selectedOrder.value === 'leastApproved') {
    sorted.sort((a, b) => approveRating(b) - approveRating(a));
  }

  return sorted;
});
</script>

<style lang="scss" scoped>
.title-first-column {
  white-space: nowrap;
}
.link {
  text-decoration: underline;
}

td {
  outline: 1px solid white;
}

.order-button {
  &:hover {
    color: #56cdb7;
  }
}
</style>

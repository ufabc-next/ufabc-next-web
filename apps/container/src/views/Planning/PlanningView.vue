
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

      <PlanningYearCard
          :value="userMaxCr"
          year="1"
          color="ufabcnext-green"
          icon="mdi-school"
        >
      </PlanningYearCard>

      
    </div>
  </section>
  <section>
    
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { PlanningCard } from '@/components/PlanningCard';
import { PlanningYearCard } from '@/components/PlanningYearCard';
import { useQuery } from '@tanstack/vue-query';
import { Performance, type CourseInformation } from 'services';

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
</style>
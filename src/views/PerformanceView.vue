<template>
  <div class="v-content__wrap">
    <div class="column flex mx-4 mt-3 mb-4 ra-1">
      <div class="meu-layout">
        <PerformanceCard
          :cr="4.0"
          title="Seu maior CR até hoje"
          cor="bg-ufabcnext-green"
        >
          <v-icon
            class="mb-1 mdi theme--light mdi-chart-line-variant text-ufabcnext-green"
          >
          </v-icon>
        </PerformanceCard>
        <PerformanceCard
          :cr="103"
          title="Possuem um CR muito próximo ao seu"
          cor="bg-ufabcnext-blue"
        >
          <v-icon
            class="mb-1 mdi theme--light mdi-chart-bell-curve text-ufabcnext-blue"
          >
          </v-icon>
        </PerformanceCard>
        <PerformanceCard
          :cr="4.0"
          title="Seu melhor quadrimestre"
          cor="bg-ufabcnext-nav-blue"
        >
          <v-icon
            class="mb-1 mdi theme--light mdi-trophy-outline text-ufabcnext-nav-blue"
          >
          </v-icon>
        </PerformanceCard>
        <PerformanceCard
          :cr="21"
          title="Quadrimestre com mais créditos"
          cor="bg-ufabcnext-yellow"
        >
          <v-icon class="mb-1 mdi theme--light mdi-fire text-ufabcnext-yellow">
          </v-icon>
        </PerformanceCard>
      </div>
      <div class="flex mb-4 column ra-1 elevate-2 pa-3 white">
        <p class="chart-title">Seu CR ao longo do tempo</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue';
import PerformanceCard from '@/components/PerformanceCard.vue';
export default {
  components: {
    PerformanceCard,
  },
  setup() {
    const cor = ref('red');

    const alterarCor = () => {
      cor.value = 'blue';
    };

    return {
      cor,
      alterarCor,
    };
  },
};
</script>

<style>
.meu-layout {
  display: flex;
  justify-content: space-between;
}
.PerformanceCard {
  flex: 1;
  margin: 10px;
}
</style>

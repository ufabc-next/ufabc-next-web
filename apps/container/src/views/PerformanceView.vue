<script setup lang="ts">
import { ref, computed } from 'vue';
import { Chart } from 'highcharts-vue';
import PerformanceCard from '@/components/PerformanceCard.vue';
import { useQuery } from '@tanstack/vue-query';
import performanceService from 'services/Performance';

// DADOS SOBRE CR
const {
  data: crHistoryData,
  // isLoading: isLoadingCrHistory,
} = useQuery({
  queryKey: ['crHistory'],
  queryFn: performanceService.getCrHistory,
  select: (response) => response.data,
});
const userMaxCr = computed(() => {
  const crAcumulados = crHistoryData.value?.map((quad) => quad.cr_acumulado);
  if (crAcumulados) {
    return Math.max(...crAcumulados).toFixed(2);
  } else {
    return '';
  }
});
const crHistorySeries = computed(() => {
  const arrCrHistory = crHistoryData.value?.map((quad) => {
    const roundedCr = parseFloat(quad.cr_acumulado.toFixed(2));
    return [quad.season, roundedCr];
  });
  return arrCrHistory;  // criar condição de contorno
});
// full highcharts options available on: https://api.highcharts.com/highcharts/
const crHistoryOptions = ref({
  chart: {
    type: 'area',
    style: { fontFamily: 'Roboto, sans-serif' },
  },

  plotOptions: {
    area: {
      fillOpacity: 0.45,
      lineWidth: 2,
      marker: {
        radius: 5,
      },
    },
  },

  colors: ['#2e7eed'], // o certo é utilizar o design token 'primary' do vuetify aqui

  credits: {
    enabled: false, // créditos de gráficos e outras libs estarão em "licenças"?
  },

  title: {
    text: 'Seu CR ao longo do tempo',
  },

  tooltip: {
    borderRadius: 10,
    padding: 12,
  },

  yAxis: {
    title: {
      text: 'CR',
    },
  },

  xAxis: {
    title: {
      text: 'Quadrimestre',
    },
    crosshair: true,
    type: 'category',
  },

  series: [
    {
      name: 'Seu CR',
      data: crHistorySeries,
    },
  ],
});
// ---------------------------------------------------
// DISTRIBUIÇÃO DE CR
const {
  data: crDistributionData
} = useQuery({
  queryKey: ['crDistribution'],
  queryFn: performanceService.getCrDistribution,
  select: (response) => response.data
});

const crDistributionSeries = computed(() => {
  const arrCrDistribution = crDistributionData.value?.map((element) => {
    return [Number(element._id), element.total]
  });
  return arrCrDistribution;
});

const crDistributionOptions = ref({
  chart: {
    type: 'area',
    style: { fontFamily: 'Roboto, sans-serif' },
  },

  plotOptions: {
    area: {
      fillOpacity: 0.45,
      lineWidth: 2,
      marker: {
        radius: 5,
      },
    },
  },

  colors: ['#2e7eed'], // o certo é utilizar o design token 'primary' do vuetify aqui

  credits: {
    enabled: false, // créditos de gráficos e outras libs estarão em "licenças"?
  },

  title: {
    text: 'Distribuição de CR',
  },

  tooltip: {
    borderRadius: 10,
    padding: 12,
  },

  yAxis: {
    title: {
      text: 'Quantidade de alunos',
    },
  },

  xAxis: {
    title: {
      text: 'CR',
    },
    crosshair: true,
    type: 'category'
  },

  series: [
    {
      name: 'teste',
      data: crDistributionSeries,
    },
  ],
});


// ---------------------------------------------------
// dados dos cards
const maxCreditsQuad = computed(() => {
  const quadInfo = crHistoryData.value?.reduce((previousQuad, currentQuad) => {
    return previousQuad.period_credits > currentQuad.period_credits
      ? previousQuad
      : currentQuad;
  });
  if (quadInfo) {
    // criar melhores condições de contorno
    return quadInfo;
  } else {
    return '';
  }
});
const bestQuad = computed(() => {
  const quadInfo = crHistoryData.value?.reduce((previousQuad, currentQuad) => {
    return previousQuad.cr_quad > currentQuad.cr_quad
      ? previousQuad
      : currentQuad;
  });
  if (quadInfo) {
    // criar melhores condições de contorno
    return quadInfo;
  } else {
    return '';
  }
});

</script>

<template>
  <section>
    <div class="column flex mx-4 mt-3 mb-4 ra-1">
      <div class="meu-layout">
        <PerformanceCard
          :value="userMaxCr"
          title="Seu maior CR até hoje"
          color="ufabcnext-green"
          icon="mdi-chart-line-variant"
        >
        </PerformanceCard>
        <PerformanceCard
          :value="103"
          title="Possuem um CR muito próximo ao seu"
          color="navigation"
          icon="mdi-chart-bell-curve"
        >
        </PerformanceCard>
        <PerformanceCard
          :value="`${maxCreditsQuad.season} / ${maxCreditsQuad.period_credits} créditos`"
          title="Seu melhor quadrimestre"
          color="primary"
          icon="mdi-trophy-outline"
        >
        </PerformanceCard>
        <PerformanceCard
          :value="`${bestQuad.period_credits} créditos / ${bestQuad.season}`"
          title="Quadrimestre com mais créditos"
          color="ufabcnext-yellow"
          icon="mdi-fire"
        >
        </PerformanceCard>
      </div>
      {{ crHistoryData }}
      {{ userMaxCr }}

      <section
        class="d-flex flex-column mb-4 elevation-2 pa-3 bg-white rounded-lg"
      >
        <Chart :options="crHistoryOptions" />
      </section>

      <section
        class="d-flex flex-column mb-4 elevation-2 pa-3 bg-white rounded-lg"
      >
        <Chart :options="crDistributionOptions" />
      </section>
    </div>
  </section>
</template>

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
#ze_0 {
  position: absolute;
  display: flex;
  text-align: center;
  width: 389px;
  height: 400px;
  user-select: none;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  padding: 0px;
  margin: 0px;
  border-width: 0px;
}
</style>

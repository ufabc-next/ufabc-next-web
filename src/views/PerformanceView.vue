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

      <section class="d-flex flex-column mb-4 elevation-2 pa-3 bg-white">
        <Chart :options="crChartOptions" />
      </section>
      <!-- <div
        class="flex mb-4 ml-0 column ra-1 elevate-2 pa-3 white"
        style="justify-content: center; display: flex; position: relative"
      >
        <p class="chart-title">Seu CR ao longo do tempo</p>
        <div class="ve-line">
          <div
            style="
              width: auto;
              height: 400px;
              position: relative;
              -webkit-tap-highlight-color: transparent;
              user-select: none;
            "
            _echarts_instance_="ec_1689449113524"
          >
            <div
              style="
                margin: 0;
                display: flex;
                justify-content: center;
                position: relative;
                overflow: hidden;
                width: 100vw;
                height: 65vh;
                padding: 20px;
                margin: 0px;
                border-width: 0px;
                cursor: default;
              "
            >
              <canvas id="ze_0"></canvas>
            </div>
          </div>
        </div>
      </div> -->
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import PerformanceCard from '@/components/PerformanceCard.vue';
import { Chart } from 'highcharts-vue';

// full highcharts options available on: https://api.highcharts.com/highcharts/
const crChartOptions = ref({
  chart: {
    type: 'area',
    style: { fontFamily: 'Roboto, sans-serif' },
  },

  plotOptions: {
    area: {
      fillOpacity: 0.45,
    },
  },
  colors: ['#2e7eed'],

  title: {
    text: 'Seu CR ao longo do tempo',
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
  },

  series: [
    {
      data: [1, 2, 3], // sample data
    },
  ],
});
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

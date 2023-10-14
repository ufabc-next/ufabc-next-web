<script setup lang="ts">
import { ref } from 'vue';
import { Chart } from 'highcharts-vue';
import * as Highcharts from 'highcharts';

const props = defineProps<{
  nameChart: string
  seriesChart: Array<(Highcharts.Chart)>
  titleChart?: string
  yAxisTitle?: string
  xAxisTitle?: string
}>()

const chartOptions = ref({
  accessibility: {
    enabled: true,
  },

  chart: {
    type: 'area',
    style: { fontFamily: 'Roboto, sans-serif' },
  },

  plotOptions: {
    area: {
      fillOpacity: 0.45,
      lineWidth: 2,
      marker: {
        radius: 4,
      },
    },
  },

  colors: ['#2e7eed'], // o certo é utilizar o design token 'primary' do vuetify aqui

  credits: {
    enabled: false, // créditos de gráficos e outras libs estarão em "licenças"?
  },

  title: {
    text: props.titleChart,
  },

  tooltip: {
    borderRadius: 10,
    padding: 12,
  },

  yAxis: {
    title: {
      text: props.yAxisTitle,
    },
    tickInterval: 0.5,
  },

  xAxis: {
    title: {
      text: props.xAxisTitle,
    },
    crosshair: true,
    type: 'category',
  },

  legend: {
    verticalAlign: 'top',
  },

  series: [
    {
      name: props.nameChart,
      data: props.seriesChart,
    },
  ],
});
</script>

<template>
  <!-- <section class="d-flex flex-column mb-4 elevation-2 pa-3 bg-white rounded-lg"> -->
  <Chart :options="chartOptions" />
  <!-- </section> -->
</template>

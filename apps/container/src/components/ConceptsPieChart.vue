<template>
  <div class="chartWrapper">
    <Chart :options="chartOptions"></Chart>
  </div>
</template>

<script setup lang="ts">
import { conceptsColor } from 'consts';
import { Chart } from 'highcharts-vue';
import { computed, PropType } from 'vue';

type Grades = {
  [x: string]: number;
};

const props = defineProps({
  grades: { type: Object as PropType<Grades>, required: true },
});

const grades = computed(() => {
  const data = Object.keys(props.grades).map((key) => ({
    name: key,
    y: props.grades[key],
  }));
  return data;
});

const chartOptions = {
  chart: {
    plotBackgroundColor: null,
    plotBorderWidth: null,
    plotShadow: false,
    type: 'pie',
  },
  series: [
    {
      name: 'Conceito',
      data: grades.value,
    },
  ],
  title: {
    text: '',
  },
  plotOptions: {
    pie: {
      allowPointSelect: true,
      cursor: 'pointer',
      dataLabels: {
        enabled: true,
        format: '<b>{point.name}</b>: {point.percentage:.1f} %',
      },
      colors: grades.value.map(
        (grade) => conceptsColor[grade.name as keyof typeof conceptsColor],
      ),
      showInLegend: true,
    },
  },
};
</script>

<style scoped>
.chartWrapper {
  position: relative;
  width: 100%;
  max-width: 400px;
  text-align: left;
  line-height: normal;
}
</style>

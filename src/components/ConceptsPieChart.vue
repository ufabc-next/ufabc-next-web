<template>
  <div class="chartwrapper">
    <div class="chartdiv" ref="chartdiv"></div>
  </div>
  <div
    class="d-flex flex-row justify-center legend-wrapper"
    :style="`${xs && 'margin-top: 20px'}`"
  >
    <div
      v-for="item in legend"
      :key="`item-${item.name}`"
      class="d-flex flex-row align-center"
    >
      <div
        class="legend-item-dot mr-1"
        :style="`background-color: ${item.color}`"
      />
      <span class="mr-3">{{ item.name }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, PropType } from 'vue';
import * as am5 from '@amcharts/amcharts5';
import * as am5percent from '@amcharts/amcharts5/percent';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { conceptsColor } from '@/utils/consts';
import { computed } from 'vue';
import { useDisplay } from 'vuetify';
const { xs } = useDisplay();

type Grades = {
  [x: string]: number;
};

const props = defineProps({
  grades: { type: Object as PropType<Grades>, required: true },
});

const chartdiv = ref(null);
let root: am5.Root, chart: am5percent.PieChart, series: am5percent.PieSeries;

const legend = computed(() => {
  const data = Object.keys(props.grades).map((key) => ({
    name: key,
    color: conceptsColor[key as keyof typeof conceptsColor],
  }));
  return data;
});

onMounted(() => {
  if (!chartdiv.value) return;
  root = am5.Root.new(chartdiv.value);
  root.setThemes([am5themes_Animated.new(root)]);

  // Create the chart
  chart = root.container.children.push(
    am5percent.PieChart.new(root, {
      endAngle: 270,
      paddingBottom: 20,
    }),
  );

  // Define the chart formatting
  series = chart.series.push(
    am5percent.PieSeries.new(root, {
      valueField: 'value',
      categoryField: 'category',
      endAngle: 270,
    }),
  );

  // Create and Add the chart data
  const data = Object.keys(props.grades).map((key) => ({
    category: key,
    value: props.grades[key],
    sliceSettings: {
      fill: am5.color(conceptsColor[key as keyof typeof conceptsColor]),
      stroke: am5.color('#fff'),
    },
    labelSettings: {
      text: '{category}: {value.formatNumber("#.0")}%',
      fontWeight: '600',
      fill: am5.color(conceptsColor[key as keyof typeof conceptsColor]),
    },
    ticksSettings: {
      stroke: am5.color(conceptsColor[key as keyof typeof conceptsColor]),
    },
  }));

  series.labels.template.setAll({
    templateField: 'labelSettings',
  });

  // Set the chart customizations
  series.slices.template.setAll({
    templateField: 'sliceSettings',
  });

  // Set label ticks tickness
  series.ticks.template.setAll({
    templateField: 'ticksSettings',
    strokeWidth: 2,
    strokeOpacity: 0.75,
  });

  // Set the chart data
  series.data.setAll(data);

  // Initiate elements hidden at the start of the chart
  series.states.create('hidden', {
    endAngle: -90,
  });

  // Prevent the chart slice from shifting on click
  series.slices.template.states.create('active', {
    shiftRadius: 0,
  });

  series.slices.template.setAll({
    cornerRadius: 3,
  });

  // Animate the chart entry
  series.appear(1000, 100);
});

onUnmounted(() => {
  if (root) {
    root.dispose();
  }
});
</script>

<style scoped>
.legend-item-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}
.chartwrapper {
  width: 100%;
  position: relative;
  padding-bottom: min(calc(50% + 10px), 280px);
}
.chartdiv {
  position: absolute;
  width: calc(100% + 40px);
  height: calc(100% + 20px);
  max-height: 300px;
  margin: 0 -20px;
}
</style>

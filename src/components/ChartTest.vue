<template>
  <div>
    <highcharts class="hc" :options="chartOptions" ref="chart"></highcharts>
  </div>
</template>

<script>
import Highcharts from 'highcharts';
import exportingInit from 'highcharts/modules/exporting';

exportingInit(Highcharts);

export default {
  data() {
    return {
      chartOptions: {
        chart: {
          type: 'pie',
        },
        title: {
          text: 'Slice of the pie',
        },
        series: [
          {
            data: [
              {
                name: 'Chicken',
                y: 50,
              },
              {
                name: 'Vegetable',
                y: 990,
              },
              {
                name: 'Fish',
                y: 20,
              },
              {
                name: 'Steak',
                y: 5,
              },
              {
                name: 'Other',
                y: 5,
              },
            ],
          },
        ],
      },
    };
  },
};
</script>

<template>
  <!-- Container -->
  <div
    class="q-pa-lg full-width"
    style="height: 280px;"
  >
    <!-- Content -->
    <div
      class="column justify-between full-height"
      style="background: lightblue;"
    >
      TODO

      <!-- Button Row -->
      <div class="row full-width justify-end">
        <q-btn
          :label="$t('general.copy')"
          icon="content_copy"
          style="border-radius: 0"
          text-color="primary"
          no-caps
          unelevated
          outline
          @click="copyContent"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// TODO: copypasta, what chart library...
// import { DoughnutChart, LineChart, useDoughnutChart, useLineChart } from 'vue-chart-3';
// import { Chart, ChartData, registerables } from 'chart.js';
//
// Chart.register(...registerables);
// // Income over time data TODO get from backend
// const incomeOverTimeData = computed<ChartData<'doughnut'>>(() => ({
//   labels: [ 'January', 'February', 'March', 'April', 'May', 'June',
//     'July', 'August', 'September', 'October', 'November', 'December' ],
//   datasets: [
//     {
//       data: [300, 350, 400, 600, 950, 1200, 1020, 1600, 800, 240, 600],
//       borderColor: 'rgb(30, 122, 122)',
//     },
//   ],
// }));
// // Props of income over time chart
// const { lineChartProps } = useLineChart({
//   chartData: incomeOverTimeData,
//   options: {
//     plugins: {
//       legend: {
//         display: false,
//       },
//     },
//   }
// });
//

/**
 * Copies the graph's content
 * @returns {void}
 */
function copyContent(){
  console.log('TODO: copy content')
}

</script>

<style scoped>

</style>

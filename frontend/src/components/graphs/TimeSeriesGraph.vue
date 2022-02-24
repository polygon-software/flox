<template>
  <!-- Container -->
  <div
    class="q-pa-lg full-width"
    style="height: 280px; margin-bottom: 110px; padding: 0 50px 0 50px"
  >
    <!-- Content -->
    <div
      class="column justify-between"
    >
      <div class="full-width">
        <apexchart
          height="280"
          type="line"
          :options="options"
          :series="datasets"
        />
      </div>

      <!-- Button Row -->
      <div
        class="row full-width justify-end"
      >
        <q-btn
          :label="$t('buttons.copy')"
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
import ShareDialog from 'components/dialogs/ShareDialog.vue';
import {computed, defineProps} from 'vue';
import {date, useQuasar} from 'quasar';
import {formatDateForGraph} from 'src/helpers/format-helpers';

const $q = useQuasar()

const props = defineProps({
  datasets: {
    type: Array,
    required: true,
  },
  unit: {
    type: String,
    required: true,
  },
  warningLevel: {
    type: Number,
    required: false,
    default: null
  }
})

/**
 * Finds the highest datapoint across all datasets, rounded to .1 increments
 * (used for determining y axis scale)
 */
const highestDatapoint = computed(() => {
  let max = 0;
  props.datasets.forEach((dataset) => {
    const datasetMax = Math.ceil(10 * Math.max.apply(Math, dataset.data.map(
      (datapoint) => {
        return (datapoint as Record<string, number>).y;
      })
    )) / 10

    if(datasetMax > max){
      max = datasetMax
    }
  })

  return max;
})

// Graph options
const options = {
  chart: {
    toolbar: {
      offsetX: -60,
      tools: {
        zoomin: false,
        zoomout: false,
        download: false
      },
    },
  },
  colors: ['var(--q-secondary)', 'var(--q-accent)', 'var(--q-warning)'],
  stroke: {
    width: 1.5
  },
  legend: {
    show: true,
    showForSingleSeries: true,
    position: 'bottom',
    horizontalAlign: 'left',
    offsetX: 20,
    offsetY: 8,
    fontSize: '16px',
    fontWeight: 600,
    formatter: function (datasetName: string){
      return datasetName.toUpperCase()
    },
    markers: {
      radius: 0,
      width: 16,
      height: 16,
      offsetY: 2
    }
  },
  xaxis: {
    type: 'numeric',
    labels: {
      formatter: function (timestamp: number){
        return formatDateForGraph(new Date(timestamp))
      }
    }
  },
  yaxis: {
    type: 'numeric',
    min: 0,
    max: highestDatapoint.value,
    tickAmount: Math.floor(highestDatapoint.value / 0.1),
    decimalsInFloat: 2,
    title: {
      text: props.unit,
      style: {
        fontSize: '16px',
        fontWeight: 600,
      },
      offsetX: -10
    }
  },
  annotations: {
    yaxis: props.warningLevel ? [
      {
        y: props.warningLevel,
        strokeDashArray: 2,
        borderColor: 'var(--q-negative)',
        label: {
          position: 'left',
          offsetX: 80,
          borderWidth: 0,
          style: {
            color: 'var(--q-negative)',
            background: 'rgba(0,0,0,0)'
          },
          text: 'Warning at 0.25'
        }
      }
    ] : [],
  },
  tooltip: {
    x: {
      show: false,
      formatter: function (timestamp: number){
        return date.formatDate(new Date(timestamp), 'dddd DD.MM.YYYY - HH:mm:ss')
      }
    },
  }
}

/**
 * Copies the graph's content
 * @returns {void}
 */
function copyContent(){
  console.log('TODO: copy content')
  $q.dialog({
    component: ShareDialog,
    componentProps: {
      q: $q
    },
  }).onOk(() => {
    console.log('SHARE')
  })
}

</script>

<style scoped>

</style>

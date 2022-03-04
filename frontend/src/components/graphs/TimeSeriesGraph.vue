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
  levelMarkers: {
    type: Array,
    required: false,
    default: () => [],
  },
  maxValue: {
    type: Number,
    required: true,
  },
})

/**
 * Sets the level markers on the y-axis.
 */
const annotations = computed(() => {
  const yaxis: Record<string, unknown>[] = []
  const markers = props.levelMarkers as Record<string, string|number>[]
  markers.forEach(marker => {
    yaxis.push({
      y: marker.value,
      strokeDashArray: marker.dashSize,
      borderColor: 'var(--q-negative)',
      label: {
        position: 'left',
        offsetX: 80,
        borderWidth: 0,
        style: {
          color: marker.color,
          background: 'rgba(0,0,0,0)',
        },
        text: `${marker.label}: ${marker.value}`
      }
    })
  })
  return yaxis
})

// Graph options
const options = computed(() => {
  return {
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
      formatter: function (datasetName: string) {
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
      type: 'datetime',
      labels: {
        formatter: function (timestamp: Date) {
          return formatDateForGraph(timestamp)
        }
      }
    },
    yaxis: {
      type: 'numeric',
      min: 0,
      max: Math.ceil(props.maxValue * 10) / 10,
      tickAmount: 10,
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
      yaxis: annotations.value,
    },
    tooltip: {
      x: {
        show: false,
        formatter: function (timestamp: number) {
          return date.formatDate(timestamp, 'dddd DD.MM.YYYY - HH:mm:ss')
        }
      },
    }
  }
})

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

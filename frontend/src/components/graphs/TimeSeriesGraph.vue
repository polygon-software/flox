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
          :series="series"
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
import {defineProps} from 'vue';
import {date, useQuasar} from 'quasar';
import {formatDateForGraph} from 'src/helpers/format-helpers';

const $q = useQuasar()

const props = defineProps({
  dataset: {
    type: Array,
    required: true,
  },
  datasetName: {
    type: String,
    required: true
  }
})

// TODO
const options = {
  chart: {
    id: props.datasetName,
    toolbar: {
      tools: {
        zoomin: false,
        zoomout: false,
        download: false
      },
    },
  },
  colors: ['var(--q-secondary)'],
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
    markers: {
      radius: 0,
      width: 16,
      height: 16,
      offsetX: -10,
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
    decimalsInFloat: 2,
    title: {
      text: 'mm/s', // TODO: unit from DB
      style: {
        fontSize: '16px',
        fontWeight: 600,
      },
      offsetX: -10
    }
  },
  annotations: {
    yaxis: [
      {
        y: 0.25,
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
    ]
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

// Data series from props
const series = [{
  name: props.datasetName.toUpperCase(),
  data: props.dataset
}]


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

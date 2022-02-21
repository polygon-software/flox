<template>
  <!-- Container -->
  <div
    class="q-pa-lg full-width q-mb-lg"
    style="height: 280px; margin-bottom: 110px"
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
import {useQuasar} from 'quasar';

const $q = useQuasar()

const props = defineProps({
  datasetName: {
    type: String,
    required: true
  }
})

// TODO
const options = {
  chart: {
    id: 'vuechart-example'
  },
  colors: ['#26A69A'],
  stroke: {
    width: 1.5
  },
  legend: {
    show: true,
    showForSingleSeries: true,
    position: 'bottom',
    horizontalAlign: 'left',
    offsetX: 20,
    offsetY: 10,
    fontSize: '16px'
  },
  xaxis: {
    type: 'numeric', // TODO: Date format
  },
  yaxis: {
    type: 'numeric',
    decimalsInFloat: 2,
    title: {
      text: 'mm/s', // TODO: unit from DB
      style: {
        fontSize: '16px'
      },
      offsetX: -10
    }
  },
  annotations: {
    yaxis: [
      {
        y: 0.25,
        strokeDashArray: 2,
        borderColor: '#C10015',
        label: {
          position: 'left',
          offsetX: 80,
          style: {
            color: '#C10015',
          },
          text: 'Warning at 0.25'
        }
      }
    ]
  }
}
const series = [{
  name: props.datasetName.toUpperCase(),
  data: Array.from({length: 200}, () => Math.random() / 2)
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

<template>
  <q-page class="column items-center justify-start full-width">
    <!-- Title: Station name -->
    <h5>{{pageTitle}}</h5>

    <!-- Time Period picker -->
    <h6 class="q-ma-none q-pa-none">
      {{ $t('visualisation.period') }}
    </h6>

    <div
      class="row justify-between q-ma-lg"
      style="width: 600px"
    >
      <q-btn
        v-for="option in timePeriodOptions"
        :key="option.key"
        :label="$t(`period.${option.key}`)"
        style="border-radius: 0"
        :text-color="timePeriod.key === option.key ? 'white' : 'primary'"
        :class="timePeriod.key === option.key ? 'bg-primary' : null"
        no-caps
        unelevated
        outline
        @click="option.key === 'custom' ? showCustomGraphDialog(): timePeriod = option"
      />
    </div>

    <!-- Horizontal - x -->
    <h6 class="q-ma-md q-pa-none">
      {{ $t('visualisation.horizontal') }} - X
    </h6>

    <TimeSeriesGraph
      :datasets="computedDatasets"
      :warning-level="0.25"
      unit="mm/s"
    />

    <!-- Horizontal - y -->
    <h6 class="q-ma-md q-pa-none">
      {{ $t('visualisation.horizontal') }} - Y
    </h6>

    <TimeSeriesGraph
      :datasets="computedDatasets"
      :warning-level="0.25"
      unit="mm/s"
    />
    <!-- Horizontal - z -->
    <h6 class="q-ma-md q-pa-none">
      {{ $t('visualisation.horizontal') }} - Z
    </h6>

    <TimeSeriesGraph
      :datasets="computedDatasets"
      :warning-level="0.25"
      unit="mm/s"
    />
  </q-page>
</template>

<script setup lang="ts">
import {computed, defineProps, ref} from 'vue';
import TimeSeriesGraph from 'components/graphs/TimeSeriesGraph.vue';
import {i18n} from 'boot/i18n';
import CustomGraphDialog from 'components/dialogs/CustomGraphDialog.vue';
import {useQuasar} from 'quasar';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps({
  stationId: {
    required: true,
    type: String
  }
})

// Time period options
const timePeriodOptions = [
  {
    key: 'twelve_hours',
  },
  {
    key: 'two_days',
  },
  {
    key: 'two_weeks',
  },
  {
    key: 'one_month',
  },
  {
    key: 'custom',
  }
]

// Currently chosen time period
const timePeriod = ref(timePeriodOptions[0])

// TODO remove placeholder data
const computedDatasets = computed(() => {
  const datasets = [] as Record<string, unknown>[]

  (props.stationId.split('+')).forEach((station) => {
    datasets.push(
      {
        name: station,
        data: randomTimeSeries()
      }
    )
  })

  return datasets
})

const pageTitle = computed(() => {
  const stations = props.stationId.split('+')
  let title = i18n.global.tc('dashboard.station', stations.length)

  stations.forEach((station) => {
    title += ` ${station},`
  })

  return title.substring(0, title.length-1);
})

// eslint-disable-next-line valid-jsdoc
/**
 * Placeholder function, generates a random time series with spikes
 * TODO remove
 */
function randomTimeSeries(){
  const result = []
  let date = new Date()
  for(let i = 0; i < 100; i++){
    const newElement = {
      x: date.getTime(),
      y: Math.random()/(Math.random() < 0.9 ? 10 : 2)
    }
    result.push(newElement)

    date.setTime(date.getTime() + 60000)
  }

  return result
}

const $q = useQuasar()

/**
 * Shows the Custom Graph Dialog
 * @returns {void} - done
 */
function showCustomGraphDialog(): void{
  // TODO: once we have actual data, prepend a popup here for choosing timeframe/etc options (see Figma)
  // TODO: onOK
  $q.dialog({
    component: CustomGraphDialog,
    componentProps: {},
  })
}

</script>

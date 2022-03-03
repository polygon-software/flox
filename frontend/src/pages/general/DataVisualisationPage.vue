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
        @click="timePeriod = option"
      />
    </div>

    <!-- Horizontal - x -->
    <h6 class="q-ma-md q-pa-none">
      {{ $t('visualisation.horizontal') }} - X
    </h6>

    <TimeSeriesGraph
      v-if="datasets"
      :datasets="computedDatasets.x"
      :warning-level="0.25"
      unit="mm/s"
    />

    <!-- Horizontal - y -->
    <h6 class="q-ma-md q-pa-none">
      {{ $t('visualisation.horizontal') }} - Y
    </h6>

    <TimeSeriesGraph
      v-if="datasets"
      :datasets="computedDatasets.y"
      :warning-level="0.25"
      unit="mm/s"
    />
    <!-- Horizontal - z -->
    <h6 class="q-ma-md q-pa-none">
      {{ $t('visualisation.horizontal') }} - Z
    </h6>

    <TimeSeriesGraph
      v-if="datasets"
      :datasets="computedDatasets.z"
      :warning-level="0.25"
      unit="mm/s"
    />
  </q-page>
</template>

<script setup lang="ts">
import {computed, defineProps, Ref, ref} from 'vue';
import TimeSeriesGraph from 'components/graphs/TimeSeriesGraph.vue';
import {i18n} from 'boot/i18n';
import {executeQuery} from 'src/helpers/data-helpers';
import {DEVICE_DATA} from 'src/data/queries/DEVICE';
import {round} from 'lodash';

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

const start = new Date('2022-03-01')
const end = new Date('2022-03-03')

const datasets: Ref<string|null> = ref(null)

executeQuery(DEVICE_DATA, {name: props.stationId, start: start, end: end, resolution: 1})
  .then(response => datasets.value = response.data?.deviceData as string).catch(e => console.error(e))

// TODO remove placeholder data
const computedDatasets = computed(() => {
  const JSONString: string|null = datasets.value
  const x: Array<Record<number, number>> = []
  const y: Array<Record<number, number>> = []
  const z: Array<Record<number, number>> = []
  if(JSONString){
    const array = JSON.parse(JSONString) as Array<Array<unknown>>
    const values = array[2] as Array<Array<number>>
    const step = round((end.getTime() - start.getTime()) / values.length)
    let currentStep = 0;
    values.forEach(value => {
      const time = start.getTime() + currentStep
      currentStep += step
      x.push({x: time, y: value[0]} as Record<number, number>)
      y.push({x: time, y: value[1]} as Record<number, number>)
      z.push({x: time, y: value[2]} as Record<number, number>)
    })
  }
  return {
    x: [{name: props.stationId, data: x}],
    y: [{name: props.stationId, data: y}],
    z: [{name: props.stationId, data: z}],
  }
})

const pageTitle = computed(() => {
  const stations = props.stationId.split('+')
  let title = i18n.global.tc('dashboard.station', stations.length)

  stations.forEach((station) => {
    title += ` ${station},`
  })

  return title.substring(0, title.length-1);
})

</script>

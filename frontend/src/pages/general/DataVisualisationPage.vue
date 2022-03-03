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
      v-if="!fetching"
      :datasets="datasets.x"
      :warning-level="0.25"
      :max-value="maxValue"
      unit="mm/s"
    />

    <!-- Horizontal - y -->
    <h6 class="q-ma-md q-pa-none">
      {{ $t('visualisation.horizontal') }} - Y
    </h6>

    <TimeSeriesGraph
      v-if="!fetching"
      :datasets="datasets.y"
      :warning-level="0.25"
      :max-value="maxValue"
      unit="mm/s"
    />
    <!-- Horizontal - z -->
    <h6 class="q-ma-md q-pa-none">
      {{ $t('visualisation.horizontal') }} - Z
    </h6>

    <TimeSeriesGraph
      v-if="!fetching"
      :datasets="datasets.z"
      :warning-level="0.25"
      :max-value="maxValue"
      unit="mm/s"
    />
  </q-page>
</template>

<script setup lang="ts">
import {defineProps, Ref, ref} from 'vue';
import TimeSeriesGraph from 'components/graphs/TimeSeriesGraph.vue';
import {i18n} from 'boot/i18n';
import {executeQuery} from 'src/helpers/data-helpers';
import {DEVICE_DATA} from 'src/data/queries/DEVICE';

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

const datasets: Ref<Record<string, Record<string, unknown>[]>> = ref({ x: [], y: [], z: []})
const maxValue: Ref<number> = ref(0)

const stations = props.stationId.split('+')
let title = i18n.global.tc('dashboard.station', stations.length)
stations.forEach((station) => {
  title += ` ${station},`
})
const pageTitle = title.substring(0, title.length-1);

const fetching = ref(true);

/**
 * TODO
 * @param {Date} start - start
 * @param {Date} end - end
 * @returns {Promise<void>} - async
 */
async function queryData(start: Date, end: Date){
  fetching.value = true
  maxValue.value = 0
  const promiseList = stations.map(station =>
  executeQuery(DEVICE_DATA, {stationId: station, start: start, end: end, resolution: 1})
    .then(response => {
      const deviceData = response.data.deviceData as Record<string, Record<string, unknown>|number>
      datasets.value.x.push(deviceData.x as Record<string, unknown>)
      datasets.value.y.push(deviceData.y as Record<string, unknown>)
      datasets.value.z.push(deviceData.z as Record<string, unknown>)
      maxValue.value = Math.max(maxValue.value, deviceData.max as number)
    })
    .catch(e => console.error(e)));
  await Promise.all(promiseList)
  fetching.value = false
}

queryData(start, end).catch(e => console.error(e))



</script>

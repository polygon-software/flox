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
      :max-value="datasets.max"
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
      :max-value="datasets.max"
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
      :max-value="datasets.max"
      unit="mm/s"
    />
  </q-page>
</template>

<script setup lang="ts">
import {computed, defineProps, Ref, ref, watch} from 'vue';
import TimeSeriesGraph from 'components/graphs/TimeSeriesGraph.vue';
import {i18n} from 'boot/i18n';
import {executeQuery} from 'src/helpers/data-helpers';
import {LEVEL_WRITING} from 'src/data/queries/DEVICE';

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

const end = computed(() => {
  return new Date()
})

const start = computed(() => {
  const date = new Date(end.value)
  switch (timePeriod.value.key){
    case 'twelve_hours':
      date.setHours(date.getHours() - 12)
      break
    case 'two_days':
      date.setDate(date.getDate() - 2)
      break
    case 'two_weeks':
      date.setDate(date.getDate() - 14)
      break
    case 'one_month':
      date.setMonth(date.getMonth() - 1)
      break
    case 'custom':
    default:
      break
  }
  return date
})

watch(start, () => queryData(start.value, end.value))
watch(end, () => queryData(start.value, end.value))

const datasets: Ref<Record<string, Record<string, unknown>[]|number>> = ref({ x: [], y: [], z: [], max: 0 })

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
  const response = await executeQuery(LEVEL_WRITING, {stationIds: stations, start: start, end: end, resolution: 1})
  datasets.value = response.data.levelWriting as Record<string, Record<string, unknown>[] | number>
  fetching.value = false
}

queryData(start.value, end.value).catch(e => console.error(e))
</script>

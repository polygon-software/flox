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
      :datasets="levelWritings.x"
      :warning-level="0.25"
      :max-value="levelWritings.max"
      unit="mm/s"
    />

    <!-- Horizontal - y -->
    <h6 class="q-ma-md q-pa-none">
      {{ $t('visualisation.horizontal') }} - Y
    </h6>

    <TimeSeriesGraph
      v-if="!fetching"
      :datasets="levelWritings.y"
      :warning-level="0.25"
      :max-value="levelWritings.max"
      unit="mm/s"
    />
    <!-- Horizontal - z -->
    <h6 class="q-ma-md q-pa-none">
      {{ $t('visualisation.horizontal') }} - Z
    </h6>

    <TimeSeriesGraph
      v-if="!fetching"
      :datasets="levelWritings.z"
      :warning-level="0.25"
      :max-value="levelWritings.max"
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

// Selected time period
const timePeriod = ref(timePeriodOptions[0])

// End of the visualized period
const end = computed(() => {
  return new Date()
})

// Start of the visualized period
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

// Watch for changes in time period and query new level writings
watch(start, () => fetchLevelWritings(start.value, end.value))
watch(end, () => fetchLevelWritings(start.value, end.value))

// Level Writings type
type LevelWritings = {
  x: Record<string, unknown>[],
  y: Record<string, unknown>[],
  z: Record<string, unknown>[],
  max: number
}

// Level writings
const levelWritings: Ref<LevelWritings> = ref({ x: [], y: [], z: [], max: 0 })

// Stations in URL
const stations = props.stationId.split('+')

// Title containing station IDs
let title = i18n.global.tc('dashboard.station', stations.length)
stations.forEach((station) => {
  title += ` ${station},`
})
const pageTitle = title.substring(0, title.length-1);

// If currently fetching. Used to hide graphs if no data is available.
const fetching = ref(true);

/**
 * Fetch the level writings for all stations.
 * @param {Date} start - start time
 * @param {Date} end - end time
 * @returns {Promise<void>} - async
 */
async function fetchLevelWritings(start: Date, end: Date){
  fetching.value = true
  const response = await executeQuery(LEVEL_WRITING, {stationIds: stations, start: start, end: end, resolution: 1})
  levelWritings.value = response.data.levelWriting as LevelWritings
  fetching.value = false
}

// Fetch initially
fetchLevelWritings(start.value, end.value).catch(e => console.error(e))
</script>

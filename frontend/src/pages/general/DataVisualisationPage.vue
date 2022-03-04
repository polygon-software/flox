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
      :datasets="levelWritings.x"
      :level-markers="xMarkers"
      :max-value="levelWritings.max"
      unit="mm/s"
    />

    <!-- Horizontal - y -->
    <h6 class="q-ma-md q-pa-none">
      {{ $t('visualisation.horizontal') }} - Y
    </h6>

    <TimeSeriesGraph
      :datasets="levelWritings.y"
      :level-markers="yMarkers"
      :max-value="levelWritings.max"
      unit="mm/s"
    />
    <!-- Horizontal - z -->
    <h6 class="q-ma-md q-pa-none">
      {{ $t('visualisation.horizontal') }} - Z
    </h6>

    <TimeSeriesGraph
      :datasets="levelWritings.z"
      :level-markers="zMarkers"
      :max-value="levelWritings.max"
      unit="mm/s"
    />
  </q-page>
</template>

<script setup lang="ts">
import {computed, defineProps, Ref, ref, watch} from 'vue';
import TimeSeriesGraph from 'components/graphs/TimeSeriesGraph.vue';
import {i18n} from 'boot/i18n';
import CustomGraphDialog from 'components/dialogs/CustomGraphDialog.vue';
import {useQuasar} from 'quasar';
import {executeQuery} from 'src/helpers/data-helpers';
import {DEVICE_PARAMS, LEVEL_WRITING} from 'src/data/queries/DEVICE';

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

const xMarkers = computed(() => [...levelMarkers.value, ...warningLevels.value.x])
const yMarkers = computed(() => [...levelMarkers.value, ...warningLevels.value.y])
const zMarkers = computed(() => [...levelMarkers.value, ...warningLevels.value.z])

// Horizontal markers to be displayed in the graphs
const levelMarkers = computed(() => [
  {
    label: 'Perception',
    value: 0.2,
    color: 'green',
    dashSize: 3,
  }
])

const warningLevels = computed(() => {
  const markers: Record<string, Record<string, unknown>[]> = {x: [], y: [], z: []}
  if(stations.length === 1){
    const params = deviceParams.value[stations[0]]
    if(params) {
      console.log(params)
      markers.x.push({
        label: 'Alarm 1',
        value: params.ala1X,
        color: 'orange',
        dashSize: 0,
      })
      markers.x.push({
        label: 'Alarm 2',
        value: params.ala2X,
        color: 'red',
        dashSize: 0,
      })
      markers.x.push({
        label: 'Trigger',
        value: params.trigX,
        color: 'darkgreen',
        dashSize: 0,
      })
      markers.y.push({
        label: 'Alarm 1',
        value: params.ala1Y,
        color: 'orange',
        dashSize: 0,
      })
      markers.y.push({
        label: 'Alarm 2',
        value: params.ala2Y,
        color: 'red',
        dashSize: 0,
      })
      markers.y.push({
        label: 'Trigger',
        value: params.trigY,
        color: 'darkgreen',
        dashSize: 0,
      })
      markers.z.push({
        label: 'Alarm 1',
        value: params.ala1Z,
        color: 'orange',
        dashSize: 0,
      })
      markers.z.push({
        label: 'Alarm 2',
        value: params.ala2Z,
        color: 'red',
        dashSize: 0,
      })
      markers.z.push({
        label: 'Trigger',
        value: params.trigZ,
        color: 'darkgreen',
        dashSize: 0,
      })
    }
  }
  return markers
})

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
watch(start, () => fetchLevelWritings())
watch(end, () => fetchLevelWritings())

// Level Writings type
type LevelWritings = {
  x: Record<string, unknown>[],
  y: Record<string, unknown>[],
  z: Record<string, unknown>[],
  max: number
}

// Level writings
const levelWritings: Ref<LevelWritings> = ref({ x: [], y: [], z: [], max: 0 })

// Device parameters
const deviceParams: Ref<Record<string, Record<string, string|number>>> = ref({})

// Stations in URL
const stations = props.stationId.split('+')

// Title containing station IDs
let title = i18n.global.tc('dashboard.station', stations.length)
stations.forEach((station) => {
  title += ` ${station},`
})
const pageTitle = title.substring(0, title.length-1);

/**
 * Fetch the level writings for all stations.
 * @returns {Promise<void>} - async
 */
async function fetchLevelWritings(){
  const response = await executeQuery(LEVEL_WRITING, {stationIds: stations, start: start.value, end: end.value, resolution: 1})
  levelWritings.value = response.data.levelWriting as LevelWritings
}

/**
 * Fetch the device parameters for all stations.
 * @returns {Promise<void>} - async
 */
async function fetchDeviceParams(){
  const promiseList = stations.map(async (stationId) => {
    const response = await executeQuery(DEVICE_PARAMS, {stationId: stationId})
    deviceParams.value[stationId] = response.data.deviceParams as Record<string, string|number>
  })
  await Promise.all(promiseList)
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

// Fetch initially
fetchLevelWritings().catch(e => console.error(e))
fetchDeviceParams().catch(e => console.error(e))
</script>

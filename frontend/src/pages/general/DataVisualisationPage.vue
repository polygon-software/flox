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
        :key="option"
        :label="$t(`period.${option}`)"
        style="border-radius: 0"
        :text-color="periodOption === option ? 'white' : 'primary'"
        :class="periodOption === option ? 'bg-primary' : null"
        no-caps
        unelevated
        outline
        @click="option === 'custom' ? showCustomGraphDialog() : periodOption = option"
      />
    </div>

    <!-- Horizontal - x -->
    <h6 class="q-ma-md q-pa-none">
      {{ $t('visualisation.horizontal') }} - X
    </h6>

    <TimeSeriesGraph
      :datasets="levelWritings.x"
      :level-markers="xMarkers"
      :max-value="scale"
      :unit="units.x"
    />

    <!-- Horizontal - y -->
    <h6 class="q-ma-md q-pa-none">
      {{ $t('visualisation.horizontal') }} - Y
    </h6>

    <TimeSeriesGraph
      :datasets="levelWritings.y"
      :level-markers="yMarkers"
      :max-value="scale"
      :unit="units.y"
    />
    <!-- Horizontal - z -->
    <h6 class="q-ma-md q-pa-none">
      {{ $t('visualisation.vertical') }} - Z
    </h6>

    <TimeSeriesGraph
      :datasets="levelWritings.z"
      :level-markers="zMarkers"
      :max-value="scale"
      :unit="units.z"
    />
  </q-page>
</template>

<script setup lang="ts">
import {computed, ComputedRef, defineProps, inject, Ref, ref, watch} from 'vue';
import TimeSeriesGraph from 'components/graphs/TimeSeriesGraph.vue';
import {i18n} from 'boot/i18n';
import CustomGraphDialog from 'components/dialogs/CustomGraphDialog.vue';
import {date, useQuasar} from 'quasar';
import {executeQuery} from 'src/helpers/data-helpers';
import {DEVICE_PARAMS, LEVEL_WRITING} from 'src/data/queries/DEVICE';
import {RouterService} from 'src/services/RouterService';

const routerService: RouterService|undefined = inject('$routerService')

const props = defineProps({
  stationId: {
    required: true,
    type: String
  }
})

// Time period options
const timePeriodOptions = [
  'twelve_hours',
  'two_days',
  'two_weeks',
  'one_month',
  'custom',
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

const maxAlarm = computed(() => {
  let max = 0
  // eslint-disable-next-line sonarjs/cognitive-complexity
  stations.forEach((station) => {
    const params = deviceParams.value[station]
    if (params) {
      max = Math.max(max, params.ala2X as number, params.ala2Y as number, params.ala2Z as number)
    }
  })
  return max
})

const units = computed(() => {
  const unitsRecord: Record<string, string> = {x: '', y: '', z: ''}
  // eslint-disable-next-line sonarjs/cognitive-complexity
  stations.forEach((station) => {
    const params = deviceParams.value[station]
    if (params) {
      const unitX = (params.unitX as string).trim()
      const unitY = (params.unitY as string).trim()
      const unitZ = (params.unitZ as string).trim()
      if(!unitsRecord.x.includes(unitX)){
        unitsRecord.x = unitsRecord.x ? `${unitsRecord.x}, ${unitX}` : unitX
      }
      if(!unitsRecord.y.includes(unitY)){
        unitsRecord.y = unitsRecord.y ? `${unitsRecord.y}, ${unitY}` : unitY
      }
      if(!unitsRecord.z.includes(unitZ)){
        unitsRecord.z = unitsRecord.z ? `${unitsRecord.z}, ${unitZ}` : unitZ
      }
    }
  })
  return unitsRecord
})

const warningLevels = computed(() => {
  const markers: Record<string, Record<string, unknown>[]> = {x: [], y: [], z: []}
  if(stations.length === 1){
    const params = deviceParams.value[stations[0]]
    if(params) {
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

// Selected scale
const scaleOption = computed({
  get() {
    return routerService?.getQueryParam('scale') ?? 'highest_peak'
  },
  set(val: string) {
    return routerService?.pushToQuery({scale: val})
  }
})

// Scale
const scale: ComputedRef<number> = computed(() => {
  switch (scaleOption.value){
    case 'perception_level':
      return 0.3
    case 'alarm_level':
      return Math.ceil(maxAlarm.value * 11) / 10
    case 'custom':
      return parseFloat(routerService?.getQueryParam('customScale')?.trim() ?? '1.0')
    case 'highest_peak':
    default:
      return Math.ceil(levelWritings.value.max * 10) / 10
  }
})

// Selected time period
const periodOption = computed({
  get() {
    return routerService?.getQueryParam('period') ?? timePeriodOptions[0]
  },
  set(val: string) {
    return routerService?.pushToQuery({period: val})
  }
})

const customPeriod = computed(() => {
  const period = {start: new Date(), end: new Date()}
  const periodText = routerService?.getQueryParam('customPeriod')
  if(periodText){
    const startText = periodText.split('-')[0].trim()
    const endText = periodText.split('-')[1].trim()
    period.start = date.extractDate(startText, 'DD.MM.YYYY')
    period.end = date.extractDate(endText, 'DD.MM.YYYY')
  }
  return period
})

// End of the visualized period
const end: ComputedRef<Date> = computed(() => {
  switch (periodOption.value){
    case 'custom':
      return customPeriod.value.end
    case 'twelve_hours':
    case 'two_days':
    case 'two_weeks':
    case 'one_month':
    default:
      return new Date()
  }
})

// Start of the visualized period
const start = computed(() => {
  const date = new Date(end.value)
  switch (periodOption.value){
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
      return customPeriod.value.start
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
  $q.dialog({
    component: CustomGraphDialog,
    componentProps: {
      scale: scaleOption.value,
      period: periodOption.value,
      customScale: scale.value,
      customPeriod: customPeriod.value,
    },
  }).onOk(async (settings: Record<string, string>) => {
    await routerService?.pushToQuery(settings)
  })
}

// Fetch initially
fetchLevelWritings().catch(e => console.error(e))
fetchDeviceParams().catch(e => console.error(e))
</script>

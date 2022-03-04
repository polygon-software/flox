<template>
  <q-page class="column items-center justify-start full-width">
    <!-- Title -->
    <h5>{{ $t('device_health.title') }} {{ stationId }}</h5>

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

    <!-- Battery Voltage -->
    <h6 class="q-ma-md q-pa-none">
      {{ $t('device_health.battery_voltage') }}
    </h6>

    <!-- todo: replace max value-->
    <TimeSeriesGraph
      :datasets="computedDatasetsBatteryVoltage"
      :max-value="50"
      :show-value-on-marker="false"
      unit="Volt"
    />

    <!-- Cellular Signal -->
    <h6 class="q-ma-md q-pa-none">
      {{ $t('device_health.cellular_signal') }}
    </h6>

    <TimeSeriesGraph
      :datasets="computedDatasetsCellularSignal"
      :level-markers="levelMarkersCellularSignal"
      :max-value="100"
      :show-value-on-marker="false"
      unit="%"
    />
  </q-page>
</template>

<script setup lang="ts">
import {computed, defineProps, ref} from 'vue';
import TimeSeriesGraph from 'components/graphs/TimeSeriesGraph.vue';
import { i18n } from 'boot/i18n';

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
const computedDatasetsBatteryVoltage = computed(() => {
  return [
    {
      name: i18n.global.t('device_health.main_battery'),
      data: randomTimeSeries()
    }
  ]
})

// TODO remove placeholder data
const computedDatasetsCellularSignal = computed(() => {
  return [
    {
      name: 'LTE (4G)',
      data: randomTimeSeries()
    },
    {
      name: 'UMTS (3G)',
      data: randomTimeSeries()
    },
    {
      name: 'GSM (2G)',
      data: randomTimeSeries()
    },
  ]
})

const levelMarkersCellularSignal = computed(() => [
  {
    label: i18n.global.t('device_health.good'),
    value: 80,
    color: 'green',
    dashSize: 0,
  },
  {
    label: i18n.global.t('device_health.fair'),
    value: 50,
    color: 'orange',
    dashSize: 0,
  },
  {
    label: i18n.global.t('device_health.poor'),
    value: 10,
    color: 'red',
    dashSize: 0,
  },
])

// eslint-disable-next-line valid-jsdoc
/**
 * Placeholder function, generates a random time series with spikes
 * TODO remove
 */
function randomTimeSeries(){
  const result = []
  const date = new Date()
  for(let i = 0; i < 100; i++){
    const newElement = {
      x: date.getTime(),
      y: Math.random()/(Math.random() < 0.9 ? 0.1 : 0.02)
    }
    result.push(newElement)

    date.setTime(date.getTime() + 60000)
  }

  return result
}

</script>

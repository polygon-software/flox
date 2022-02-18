<template>
  <q-page class="column items-center justify-start full-width">
    <!-- Title: Station name -->
    <h5>{{$tc('dashboard.station', 1)}} {{stationId.toUpperCase()}}</h5>

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
    <h6 class="q-ma-none q-pa-none">
      {{ $t('visualisation.horizontal') }} - X
    </h6>

    <!-- TODO params -->
    <HorizontalGraph/>

    <!-- Horizontal - y -->
    <h6 class="q-ma-none q-pa-none">
      {{ $t('visualisation.horizontal') }} - Y
    </h6>

    <!-- TODO params -->
    <HorizontalGraph/>

    <!-- Horizontal - z -->
    <h6 class="q-ma-none q-pa-none">
      {{ $t('visualisation.horizontal') }} - Z
    </h6>

    <!-- TODO params -->
    <HorizontalGraph/>

  </q-page>
</template>

<script setup lang="ts">
import {defineProps, ref} from 'vue';
import HorizontalGraph from 'components/graphs/HorizontalGraph.vue';

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
</script>

<style scoped>

</style>

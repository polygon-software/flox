<template>
  <q-page class="column items-center justify-start full-width">
    <!-- Title: Station name -->
    <h5>{{$tc('dashboard.station', 1)}} {{stationId}}</h5>

    <!-- Time Period picker -->
    <strong>{{ $t('visualisation.period') }}</strong>

    <div
      class="row justify-between q-ma-lg"
      style="width: 600px"
    >
      <q-btn
        v-for="option in timePeriodOptions"
        :key="option.key"
        :label="$t(`period.${option.key}`)"
        style="border-radius: 0"
        text-color="primary"
        no-caps
        unelevated
        outline
      />
    </div>

    <!-- Horizontal - x -->
    <strong>{{ $t('visualisation.horizontal') }} - X</strong>

    <HorizontalGraph/>

    <!-- Horizontal - y -->
    <strong>{{ $t('visualisation.horizontal') }} - Y</strong>

    <!-- Horizontal - z -->
    <strong>{{ $t('visualisation.horizontal') }} - Z</strong>

  </q-page>
</template>

<script setup lang="ts">
import {defineProps} from 'vue';
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

</script>

<style scoped>

</style>

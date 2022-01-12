<template>
  <q-page class="flex" style="flex-direction: column">
    <!-- Top row: title -->
    <h6 class="q-ma-md">{{ $t('dashboards.finances') }}</h6>

    <!-- Body: Info cards -->
    <div
      class="column full-height items-start q-pa-md full-width"
      style="padding-right: 32px"
    >
      <!-- Time frame key figures -->
      <q-card
        class="q-ma-md"
        flat
        style="width: 100%; border-radius: 20px; border: 1px solid black"
      >
        <div class="row justify-between">
          <h6 class="q-ma-md">{{ $t('finances.key_figures') }}</h6>
          <q-btn
            icon="link"
            :label="$t('finances.to_dashboard')"
            color="primary"
            rounded
            unelevated
            size="md"
            style="height: 30px"
            class="q-ma-md"
            @click="openURL(paymentProcessorUrl)"
          />
        </div>

        <!-- Time frame picker -->
        <div class="row">
          <q-tabs
            v-model="selectedTimeframe"
            dense
            class="q-mt-xs text-grey"
            active-color="primary"
            indicator-color="primary"
            narrow-indicator
          >
            <q-tab
              v-for="tab in tabs"
              :key="tab"
              :name="tab"
              :label="$t(`finances.${tab}`)"
              @click="updateKeyFigures"
            >
            </q-tab>
          </q-tabs>
        </div>

        <q-table
          :rows="rows"
          :columns="columns"
          row-key="key"
          :rows-per-page-options="[10,20, 100]"
          flat
          bordered
          class="q-ma-lg"
          style="margin-top: 24px"
        >
          <template #body="_props">

          <q-tr
            :props="_props"
            class="q-ma-none q-pa-none"
            style="cursor: pointer"
          >
            <q-td key="label" :props="_props">
              <p>
                {{_props.row.label}}:
              </p>
            </q-td>
            <q-td key="value" :props="_props">
              <div class="row">
                <p>
                  {{_props.row.value.toLocaleString()}} CHF
                </p>
                <p class="text-grey-5" style="padding-left: 6px">
                  ({{_props.row.change > 0 ? '+' + _props.row.change.toLocaleString(): _props.row.change.toLocaleString()}})
                </p>
              </div>
            </q-td>
            <q-td key="change" :props="_props">
              <q-icon
                :name="getChangeIcon(_props.row.value, _props.row.change).icon"
                :color="getChangeIcon(_props.row.value, _props.row.change).color"
                size="32px"
              />
            </q-td>
          </q-tr>
          </template>

        </q-table>
      </q-card>

      <!-- General -->
      <q-card
        class="q-ma-md q-pa-md"
        flat
        style="width: 100%; border-radius: 20px; border: 1px solid black"
      >
        <h6 class="q-ma-none">{{ $t('finances.general') }}</h6>

        <q-separator style="margin-top: 20px"/>

        <div class="row">
          <div class="col q-pa-sm">
            <!-- Income over time chart -->
            <strong>{{ $t('finances.income_by_category') }}</strong>
            <DoughnutChart v-bind="doughnutChartProps" />
          </div>
          <q-separator vertical style="margin: 0 20px 0 20px"/>
          <div class="col q-pa-sm">

            <!-- Income by category chart -->
            <strong>{{ $t('finances.income_by_category') }}</strong>
            <DoughnutChart v-bind="doughnutChartProps" />
          </div>
        </div>

        <q-separator/>

      </q-card>

    </div>

  </q-page>
</template>

<script setup lang="ts">
import {computed, ref} from 'vue';
import {openURL} from 'quasar';
import { DoughnutChart, useDoughnutChart } from 'vue-chart-3';
import { Chart, ChartData, ChartOptions, registerables } from 'chart.js';
import {CATEGORY} from '../../../../shared/definitions/ENUM';
import {i18n} from 'boot/i18n';

Chart.register(...registerables);

const selectedTimeframe = ref('year')

// URL to external payment processor page TODO update once chosen
const paymentProcessorUrl = 'https://www.polygon-software.ch'
const dataValues = ref([30, 40, 60, 70, 5]);

// Some possible charts:

const testData = computed<ChartData<'doughnut'>>(() => ({
  labels: Object.values(CATEGORY).map((category) => i18n.global.t(`interests.${category.toLowerCase()}`)),
  datasets: [
    {
      data: dataValues.value,
      backgroundColor: [
        '#77CEFF',
        '#0079AF',
        '#123E6B',
        '#97B0C4',
        '#A5C8ED',
      ],
    },
  ],
}));

const options = computed<ChartOptions<'doughnut'>>(() => ({
  plugins: {
    legend: {
      position: 'left',
    },
  },
}));

const { doughnutChartProps, doughnutChartRef } = useDoughnutChart({
  chartData: testData,
  options,
});

const columns = [
  { name: 'label', label: 'Kennzahl', field: 'label', sortable: true, align: 'start' },
  { name: 'value', label: 'Wert', field: 'value', sortable: true, align: 'start' },
  { name: 'change', label: 'Trend', field: 'change', sortable: false, align: 'start' },
]

// TODO replace this placeholder data
const rows = [
  {
    key: 'total_earnings',
    label: 'Gesamteinnahmen',
    value: 2000000,
    change: 50000
  },
  {
    key: 'total_credit',
    label: 'Guthabenvolumen',
    value: 500000,
    change: 2100
  },
  {
    key: 'new_credit',
    label: 'Neue Einzahlungen',
    value: 2300,
    change: -200
  },
  {
    key: 'refunds',
    label: 'Rückzahlungen',
    value: 200,
    change: 100
  },
]

const tabs = [
  'all_time',
  'year',
  'quarter',
  'month',
  'week',
  'day'
]

/**
 * Gets color & icon for a value change
 * @param {number} value - new value
 * @param {number} change - value change since last time epoch
 * @returns {Record<string, string>} - containing icon and color
 */
function getChangeIcon(value: number, change: number): Record<string, string>{

  // Threshold: if change is <2%, show flat trend
  const isSignificantChange = Math.abs(change) > Math.abs(value * 0.02)

  // Neutral
  if(!isSignificantChange){
    return {
      icon: 'trending_flat',
      color: 'grey-6',
    }
  }

  // Positive
  if(change > 0){
    return {
      icon: 'trending_up',
      color: 'positive'
    }
  }

  // Negative
  return {
    icon: 'trending_down',
    color: 'negative'
  }
}

/**
 * Updates the key figures on timeframe change
 * @returns {void}
 */
function updateKeyFigures(){
  console.log('Update!')
  // TODO actual implementation
}

</script>
